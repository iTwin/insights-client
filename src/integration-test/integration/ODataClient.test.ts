/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import type { ExtractionStatus, GroupCreate, MappingCreate, ODataItem, ReportCreate, ReportMappingCreate} from "../../reporting";
import { ExtractionClient, ExtractorState, MappingsClient, ODataClient, ReportsClient } from "../../reporting";
import "reflect-metadata";
import { accessToken, projectId, sleep, testIModel, testIModelGroup } from "../utils";
use(chaiAsPromised);

describe("OData Client", () => {
  const oDataClient: ODataClient = new ODataClient();
  const reportsClient: ReportsClient = new ReportsClient();
  const mappingsClient: MappingsClient = new MappingsClient();
  const extractionClient: ExtractionClient = new ExtractionClient();

  let reportId: string;
  let oDataItem: ODataItem;
  const deletionTracker: Array<string> = [];

  before(async function () {
    const newMapping: MappingCreate = {
      mappingName: "Test",
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    deletionTracker.push(mapping.id);

    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "select * from biscore.element limit 10",
    };
    const group = await mappingsClient.createGroup(accessToken, testIModel.id, mapping.id, newGroup);
    expect(group).to.not.be.undefined;

    const newReport: ReportCreate = {
      displayName: "Test",
      projectId,
    };
    const report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    deletionTracker.push(report.id);
    reportId = report.id;

    const newReportMapping: ReportMappingCreate = {
      mappingId: mapping.id,
      imodelId: testIModel.id,
    };
    const reportMapping = await reportsClient.createReportMapping(accessToken, report.id, newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    deletionTracker.push(reportMapping.mappingId);

    const extraction = await extractionClient.runExtraction(accessToken, testIModel.id);
    expect(extraction).to.not.be.undefined;

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
    expect(oDataResponse).to.not.be.undefined;
    expect(oDataResponse.value).to.not.be.empty;
    oDataItem = oDataResponse.value[0];

  });

  after(async function () {
    let i = 0;
    if(i < deletionTracker.length) {
      await mappingsClient.deleteMapping(accessToken, testIModel.id, deletionTracker[i]);
    }
    if(++i < deletionTracker.length) {
      await reportsClient.deleteReport(accessToken, deletionTracker[i]);
    }
    if(++i < deletionTracker.length) {
      await reportsClient.deleteReportMapping(accessToken, deletionTracker[i - 1], deletionTracker[i]);
    }

    await testIModelGroup.cleanupIModels();
  });

  it("get OData report", async function () {
    const oDataResponse = await oDataClient.getODataReport(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
    expect(oDataResponse["@odata.context"]).to.not.be.undefined;
  });

  it("get OData report metadata", async function () {
    const oDataResponse = await oDataClient.getODataReportMetadata(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
    expect(oDataResponse.status).to.not.be.undefined;
  });

  it("throw OData report metadata", async function () {
    await expect(oDataClient.getODataReportMetadata(accessToken, "-")).to.be.rejected;
  });

  it("get OData report entity", async function () {
    const oDataEntity = await oDataClient.getODataReportEntities(accessToken, reportId, oDataItem);
    expect(oDataEntity).to.not.be.undefined;
    expect(oDataEntity).to.not.be.empty;
  });

  it("get OData report entity page", async function () {
    const oDataEntity = await oDataClient.getODataReportEntityPage(accessToken, reportId, oDataItem, 0);
    expect(oDataEntity).to.not.be.undefined;
    expect(oDataEntity).to.not.be.empty;
  });
});

