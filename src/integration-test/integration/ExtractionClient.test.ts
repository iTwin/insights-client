/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { ExtractionClient, ExtractionLog, ExtractionRun, ExtractionStatus, ExtractorState, MappingCreate, MappingsClient } from "../../reporting";
import "reflect-metadata";
import { accessToken, testIModel, testIModelGroup } from "../utils";
use(chaiAsPromised);

describe("Extraction Client", () => {
  const extractionClient: ExtractionClient = new ExtractionClient();
  const mappingsClient: MappingsClient = new MappingsClient();

  let extractionId: string;
  let mappingId: string;

  before(async function () {
    const newMap: MappingCreate = {
      mappingName: "Test",
    };
    const map = await mappingsClient.createMapping(accessToken, testIModel.id, newMap);
    expect(map).to.not.be.undefined;
    expect(map.mappingName).to.be.eq("Test");
    mappingId = map.id;

    const extraction: ExtractionRun = await extractionClient.runExtraction(accessToken, testIModel.id);
    expect(extraction).to.not.be.undefined;
    extractionId = extraction.id;
  });

  after(async function () {
    await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingId);
    await testIModelGroup.cleanupIModels();
  });

  it("run extraction", async function () {
    const extraction: ExtractionRun = await extractionClient.runExtraction(accessToken, testIModel.id);
    expect(extraction).to.not.be.undefined;
    expect(extraction.id).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
  });

  it("Get Logs", async function () {
    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs(accessToken, extractionId);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
  });

  it("Get Logs with top", async function () {
    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs(accessToken, extractionId, 1);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
  });

  it("Get Status", async function () {
    const extraction: ExtractionStatus = await extractionClient.getExtractionStatus(accessToken, extractionId);
    expect(extraction).to.not.be.undefined;
    expect(extraction.state).to.not.be.eq("Failed");
  });
});
