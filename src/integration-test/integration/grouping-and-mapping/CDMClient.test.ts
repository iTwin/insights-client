/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { ExtractionStatus, Mapping } from "../../../grouping-and-mapping";
import { accessToken, cdmClient, extractionClient, mappingsClient, testIModel } from "../../utils";

describe.only("CDM Client Integration Tests", ()=> {
  let mappingOne: Mapping;
  let extraction: ExtractionStatus;

  before(async () => {
    mappingOne = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "mappingOne",
    });

    extraction = await extractionClient.runExtraction(accessToken, {
      iModelId: testIModel.id,
      mappings: [
        { id: mappingOne.id },
      ],
    });
  });

  after(async () => {
    await mappingsClient.deleteMapping(accessToken, mappingOne.id);
  });

  it("CDM Client - Get CDM and Get CDM partition", async ()=> {
    const cdm = await cdmClient.getCDM(accessToken, mappingOne.id, extraction.id);
    expect(cdm).not.be.undefined;

    const entity = cdm.entities[0];
    const cdmPartitionLocation = entity.partitions[0].location;
    const cdmPartition = await cdmClient.getCDMPartition(accessToken, mappingOne.id, extraction.id, cdmPartitionLocation);
    expect(cdmPartition.status).to.be.equal(200);
  });

});
