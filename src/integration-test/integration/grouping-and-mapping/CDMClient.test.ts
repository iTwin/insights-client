/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { ExtractionState, ExtractionStatus } from "../../../grouping-and-mapping/interfaces/Extraction";
import { Group } from "../../../grouping-and-mapping/interfaces/Groups";
import { Mapping } from "../../../grouping-and-mapping/interfaces/Mappings";
import { accessToken, cdmClient, extractionClient, groupsClient, mappingsClient, testIModel } from "../../utils/GlobalSetup";
import { sleep } from "../../utils/imodels-client-test-utils/CommonTestUtils";

describe("CDM Client Integration Tests", ()=> {
  let mappingOne: Mapping;
  let groupOne: Group;
  let extraction: ExtractionStatus;

  before(async () => {
    mappingOne = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "mappingOne",
    });

    groupOne = await groupsClient.createGroup(accessToken, mappingOne.id, {
      groupName: "GroupOne",
      description: "Group number one",
      query: "SELECT * FROM bis.Element limit 10",
    });
  });

  after(async () => {
    await groupsClient.deleteGroup(accessToken, mappingOne.id, groupOne.id);
    await mappingsClient.deleteMapping(accessToken, mappingOne.id);
  });

  it("CDM Client - Get CDM and Get CDM partition", async ()=> {
    extraction = await extractionClient.runExtraction(accessToken, {
      iModelId: testIModel.id,
      mappings: [
        { id: mappingOne.id },
      ],
    });

    let state = ExtractionState.Queued;
    let status: ExtractionStatus;
    for (const start = performance.now(); performance.now() - start < 6 * 60 * 1000; await sleep(3000)) {
      status = await extractionClient.getExtractionStatus(accessToken, extraction.id);
      state = status.state;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if(state !== ExtractionState.Queued && state.valueOf() !== ExtractionState.Running)
        break;
    }
    expect(state).to.be.eq(ExtractionState.Succeeded);

    const cdm = await cdmClient.getCDM(accessToken, mappingOne.id, extraction.id);
    expect(cdm).not.be.undefined;

    const entity = cdm.entities[0];
    const cdmPartitionLocation = entity.partitions[0].location;
    const cdmPartition = await cdmClient.getCDMPartition(accessToken, mappingOne.id, extraction.id, cdmPartitionLocation);
    expect(cdmPartition.status).to.be.equal(200);
  });
});
