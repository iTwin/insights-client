/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { ODataItem, ReportCreate, ReportMappingCreate } from "../../reporting";
import "reflect-metadata";
import { accessToken, extractionClient, groupsClient, iTwinId, mappingsClient, oDataClient, reportsClient, sleep, testIModel } from "../utils";
import { GroupCreate, MappingCreate } from "../../grouping-and-mapping";
import { ExtractionRequestDetails, ExtractionState, ExtractionStatus } from "../../grouping-and-mapping/interfaces/Extraction";
use(chaiAsPromised);

describe("OData Client", () => {
  let reportId: string;
  let oDataItem: ODataItem;
  let mappingId: string;

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
    await groupsClient.createGroup(accessToken, mapping.id, newGroup);

    const newReport: ReportCreate = {
      displayName: "TestR",
      projectId: iTwinId,
    };
    const report = await reportsClient.createReport(accessToken, newReport);
    reportId = report.id;

    const newReportMapping: ReportMappingCreate = {
      mappingId: mapping.id,
      imodelId: testIModel.id,
    };
    await reportsClient.createReportMapping(accessToken, report.id, newReportMapping);

    const extractionRequestDetails: ExtractionRequestDetails = {
      iModelId: testIModel.id,
      mappings: [
        { id : mappingId },
      ],
    };

    const extraction = await extractionClient.runExtraction(accessToken, extractionRequestDetails);
    let state = ExtractionState.Queued;
    let status: ExtractionStatus;
    for (const start = performance.now(); performance.now() - start < 6 * 60 * 1000; await sleep(3000)) {
      status = await extractionClient.getExtractionStatus(accessToken, extraction.id);
      state = status.state;
      if(state !== ExtractionState.Queued && state.valueOf() !== ExtractionState.Running)
        break;
    }
    expect(state).to.be.eq(ExtractionState.Succeeded);

    const oDataResponse = await oDataClient.getODataReport(accessToken, reportId);
    oDataItem = oDataResponse.value[0];
  });

  after(async () => {
    await mappingsClient.deleteMapping(accessToken, mappingId);
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
    expect(oDataResponse[0].name).to.be.a("string").and.satisfy((msg: string) => msg.startsWith("TestM_TestG"));
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
    expect(oDataResponse[0].annotations[0].term).to.be.eq("Bentley.iTwin.Reporting.DisplayName");
    expect(oDataResponse[0].annotations[0].stringValue).to.be.eq("TestG");
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

