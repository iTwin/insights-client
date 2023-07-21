/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { ExtractionStatus, ExtractorState, GroupCreate, MappingCreate, ODataItem, ReportCreate, ReportMappingCreate } from "../../reporting";
import "reflect-metadata";
import { accessToken, iTwinId, sleep, testIModel, mappingsClient, extractionClient, oDataClient, reportsClient } from "../utils";
use(chaiAsPromised);

describe("OData Client", () => {
  let reportId: string;
  let oDataItem: ODataItem;
  let mappingId: string;

  before(async () => {
    const newMapping: MappingCreate = {
      mappingName: "Test",
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingId = mapping.id;

    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "select * from biscore.element limit 10",
    };
    await mappingsClient.createGroup(accessToken, testIModel.id, mapping.id, newGroup);

    const newReport: ReportCreate = {
      displayName: "Test",
      projectId: iTwinId,
    };
    const report = await reportsClient.createReport(accessToken, newReport);
    reportId = report.id;

    const newReportMapping: ReportMappingCreate = {
      mappingId: mapping.id,
      imodelId: testIModel.id,
    };
    await reportsClient.createReportMapping(accessToken, report.id, newReportMapping);

    const extraction = await extractionClient.runExtraction(accessToken, testIModel.id);
    let state = ExtractorState.Queued;
    let status: ExtractionStatus;
    for (const start = performance.now(); performance.now() - start < 6 * 60 * 1000; await sleep(3000)) {
      status = await extractionClient.getExtractionStatus(accessToken, extraction.id);
      state = status.state;
      if(state !== ExtractorState.Queued && state.valueOf() !== ExtractorState.Running)
        break;
    }
    expect(state).to.be.eq(ExtractorState.Succeeded);

    const oDataResponse = await oDataClient.getODataReport(accessToken, reportId);
    oDataItem = oDataResponse.value[0];
  });

  after(async () => {
    await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingId);
    await reportsClient.deleteReport(accessToken, reportId);
  });

  it("get OData report", async () => {
    const oDataResponse = await oDataClient.getODataReport(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
    expect(oDataResponse["@odata.context"]).to.not.be.empty;
  });

  it("get OData report metadata", async () => {
    const oDataResponse = await oDataClient.getODataReportMetadata(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
    expect(oDataResponse).to.not.be.empty;
    expect(oDataResponse[0].name).to.be.a("string").and.satisfy((msg: string) => msg.startsWith("Test_Test"));
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(oDataResponse[0].columns[0].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(oDataResponse[0].columns[1].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(oDataResponse[0].columns[2].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(oDataResponse[0].columns[3].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(oDataResponse[0].columns[4].name);
    expect(oDataResponse[0].columns[0].type).to.be.eq("Edm.String");
    expect(oDataResponse[0].columns[1].type).to.be.eq("Edm.String");
    expect(oDataResponse[0].columns[2].type).to.be.eq("Edm.String");
    expect(oDataResponse[0].columns[3].type).to.be.eq("Edm.String");
    expect(oDataResponse[0].columns[4].type).to.be.eq("Edm.String");
  });

  it("throw OData report metadata", async () => {
    await expect(oDataClient.getODataReportMetadata(accessToken, "-")).to.be.rejected;
  });

  it("get OData report entity", async () => {
    const oDataEntity = await oDataClient.getODataReportEntities(accessToken, reportId, oDataItem);
    expect(oDataEntity).to.not.be.undefined;
    expect(oDataEntity).to.not.be.empty;
  });

  it("get OData report entity page", async () => {
    const oDataEntity = await oDataClient.getODataReportEntityPage(accessToken, reportId, oDataItem, 0);
    expect(oDataEntity).to.not.be.undefined;
    expect(oDataEntity).to.not.be.empty;
  });
});

