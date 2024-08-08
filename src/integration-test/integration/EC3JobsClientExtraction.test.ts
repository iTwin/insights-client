/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import "reflect-metadata";
import { accessToken, configurationsClient, extractionClient, groupsClient, iTwinId, jobsClient, mappingsClient, testIModel } from "../utils/GlobalSetup";
import { EC3Configuration, EC3ConfigurationMaterial, EC3ExtractionConfigurationCreate, EC3ExtractionConfigurationLabel } from "../../carbon-calculation/interfaces/EC3Configurations";
import { EC3ExtractionJobCreate, EC3Job, EC3JobStatus } from "../../carbon-calculation/interfaces/EC3Jobs";
import { MappingCreate } from "../../grouping-and-mapping/interfaces/Mappings";
import { GroupCreate } from "../../grouping-and-mapping/interfaces/Groups";
import { ExtractionRequestDetails, ExtractionState, ExtractionStatus } from "../../grouping-and-mapping/interfaces/Extraction";
import { sleep } from "../utils/imodels-client-test-utils/CommonTestUtils";
use(chaiAsPromised);

describe("EC3JobsClient (extraction schema)", () => {
  let configurationId: string;
  let mappingId: string;
  let extractionId: string;

  before(async () => {
    const newMapping: MappingCreate = {
      mappingName: "TestM",
      iModelId: testIModel.id,
      extractionEnabled: true,
    };
    const mapping = await mappingsClient.createMapping(accessToken, newMapping);
    mappingId = mapping.id;

    const newGroup: GroupCreate = {
      groupName: "TestG",
      query: "select * from biscore.element limit 10",
    };
    const group = await groupsClient.createGroup(accessToken, mapping.id, newGroup);

    const extractionRequestDetails: ExtractionRequestDetails = {
      iModelId: testIModel.id,
      mappings: [
        { id: mappingId },
      ],
    };

    const extraction = await extractionClient.runExtraction(accessToken, extractionRequestDetails);
    extractionId = extraction.id;
    let state = ExtractionState.Queued;
    let status: ExtractionStatus;
    for (const start = performance.now(); performance.now() - start < 6 * 60 * 1000; await sleep(3000)) {
      status = await extractionClient.getExtractionStatus(accessToken, extraction.id);
      state = status.state;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (state !== ExtractionState.Queued && state.valueOf() !== ExtractionState.Running)
        break;
    }
    expect(state).to.be.eq(ExtractionState.Succeeded);

    const material: EC3ConfigurationMaterial = {
      nameColumn: "materialName",
    };

    const label: EC3ExtractionConfigurationLabel = {
      name: "name",
      mappingId,
      groupName: group.groupName,
      elementNameColumn: "elementName",
      elementQuantityColumn: "elementQuantity",
      materials: [material],
    };

    const newConfig: EC3ExtractionConfigurationCreate = {
      iTwinId,
      iModelId: testIModel.id,
      displayName: "Test",
      labels: [label],
    };
    const config: EC3Configuration = await configurationsClient.createConfiguration(accessToken, newConfig);
    configurationId = config.id;
  });

  after(async () => {
    await mappingsClient.deleteMapping(accessToken, mappingId);
    await configurationsClient.deleteConfiguration(accessToken, configurationId);
  });

  it("jobs - run extraction and get status", async () => {
    const newJob: EC3ExtractionJobCreate = {
      projectName: "test",
      ec3BearerToken: "no token :(",
      configurationId,
      extractionId,
    };
    const job: EC3Job = await jobsClient.createJob(accessToken, newJob);
    expect(job).to.not.be.undefined;
    expect(job.id).to.not.be.undefined;

    const status: EC3JobStatus = await jobsClient.getEC3JobStatus(accessToken, job.id);
    expect(status).to.not.be.undefined;
    expect(["Failed", "Running", "Queued"]).to.include(status.status);
  });
});
