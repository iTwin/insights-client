/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { Extraction, ExtractionLog, ExtractionRun, ExtractionRunRequest, ExtractionStatus, ExtractorState } from "../../reporting";
import "reflect-metadata";
import { accessToken, extractionClient, mappingsClient, testIModel } from "../utils";
import { MappingCreate } from "../../grouping-and-mapping";
use(chaiAsPromised);

describe("Extraction Client", () => {
  let extractionId: string;
  let mappingId: string;

  before(async () => {
    const newMap: MappingCreate = {
      mappingName: "Test",
      iModelId: testIModel.id,
    };
    const map = await mappingsClient.createMapping(accessToken, newMap);
    mappingId = map.id;

    const extraction: ExtractionRun = await extractionClient.runExtraction(accessToken, testIModel.id);
    extractionId = extraction.id;
  });

  after(async () => {
    await mappingsClient.deleteMapping(accessToken, mappingId);
  });

  it("run extraction", async () => {
    const extraction: ExtractionRun = await extractionClient.runExtraction(accessToken, testIModel.id);
    expect(extraction).to.not.be.undefined;
    expect(extraction.id).to.not.be.undefined;
  });

  it("run extraction with parameters", async () => {
    const extractionRequest: ExtractionRunRequest = {
      changesetId: testIModel.changesetId,
      mappings: [{ id: mappingId }],
    };
    const extraction: ExtractionRun = await extractionClient.runExtraction(accessToken, testIModel.id, extractionRequest);
    expect(extraction).to.not.be.undefined;
    expect(extraction.id).to.not.be.undefined;
  });

  it("Get Logs", async () => {
    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs(accessToken, extractionId);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
    expect(Object.values(ExtractorState).includes(extraction[0].state)).to.be.true;
  });

  it("Get Logs with top", async () => {
    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs(accessToken, extractionId, 1);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
    expect(Object.values(ExtractorState).includes(extraction[0].state)).to.be.true;
  });

  it("Get Status", async () => {
    const extraction: ExtractionStatus = await extractionClient.getExtractionStatus(accessToken, extractionId);
    expect(extraction).to.not.be.undefined;
    expect(extraction.state).to.not.be.eq("Failed");
  });

  it("Get history", async () => {
    const extractions: Array<Extraction> = await extractionClient.getExtractionHistory(accessToken, testIModel.id);
    expect(extractions).to.not.be.undefined;
    expect(extractions).to.not.be.empty;
    let flag = false;
    for await (const extraction of extractions) {
      if (extraction.jobId === extractionId) {
        flag = true;
        break;
      }
    }
    expect(flag).to.be.true;
  });

  it("Get history with top", async () => {
    const extractions: Array<Extraction> = await extractionClient.getExtractionHistory(accessToken, testIModel.id, 1);
    expect(extractions).to.not.be.undefined;
    expect(extractions).to.not.be.empty;
    let flag = false;
    for await (const extraction of extractions) {
      if (extraction.jobId === extractionId) {
        flag = true;
        break;
      }
    }
    expect(flag).to.be.true;
  });
});
