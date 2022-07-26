/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised"
import { expect, use } from "chai";
import { ExtractionClient, ExtractionStatus, ExtractorState, GroupCreate, MappingCreate, MappingsClient, ODataClient, ODataItem, ReportCreate, ReportMappingCreate, ReportsClient } from "../../reporting";
import "reflect-metadata";
import { getTestRunId, TestConstants, getTestDIContainer, AuthorizationCallback, TestIModelGroup, TestIModelGroupFactory, IModelMetadata, TestAuthorizationProvider, TestIModelCreator, ReusableTestIModelProvider, TestProjectProvider, sleep } from "../utils";
use(chaiAsPromised);

describe("OData Client", () => {
  const oDataClient: ODataClient = new ODataClient();
  const reportsClient: ReportsClient = new ReportsClient();
  const mappingsClient: MappingsClient = new MappingsClient();
  const extractionClient: ExtractionClient = new ExtractionClient(); 
  let accessToken: string;
  let projectId: string;
  let reportId: string;
  let oDataItem: ODataItem;

  const deletionTracker: Array<string> = [];

  let authorization: AuthorizationCallback;
  let testIModelGroup: TestIModelGroup;
  let testIModel: IModelMetadata;

  before(async function () {
    const container = getTestDIContainer();
    
    const authorizationProvider = container.get(TestAuthorizationProvider);
    authorization = authorizationProvider.getAdmin1Authorization();
    accessToken = "Bearer " + (await authorization()).token;

    const testProjectProvider = container.get(TestProjectProvider);
    projectId = await testProjectProvider.getOrCreate();

    const testIModelGroupFactory = container.get(TestIModelGroupFactory);
    testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: TestConstants.PackagePrefix, testSuiteName: "ManagementNamedVersionOperations" });

    const testIModelCreator = container.get(TestIModelCreator);
    testIModel = await testIModelCreator.createEmptyAndUploadChangesets(testIModelGroup.getPrefixedUniqueIModelName("Test iModel for write"));

    const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
    testIModel = await reusableTestIModelProvider.getOrCreate();

    const newMapping: MappingCreate = {
      mappingName: "Test"
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    deletionTracker.push(mapping.id);

    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "select * from biscore.element limit 10"
    }
    const group = await mappingsClient.createGroup(accessToken, testIModel.id, mapping.id, newGroup);
    expect(group).to.not.be.undefined;

    const newReport: ReportCreate = {
      displayName: "Test",
      projectId: projectId
    }
    const report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    deletionTracker.push(report.id);
    reportId = report.id;

    const newReportMapping: ReportMappingCreate = {
      mappingId: mapping.id,
      imodelId: testIModel.id,
    }
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
        {break;}
    }
    expect(state).to.be.eq(ExtractorState.Succeeded);

    const oDataResponse = await oDataClient.getODataReport(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
    expect(oDataResponse.value.length).to.be.above(0);
    oDataItem = oDataResponse.value[0];

  });

  after(async function () {
    let response: Response;
    let i = 0;
    if(i < deletionTracker.length) {
      response = await mappingsClient.deleteMapping(accessToken, testIModel.id, deletionTracker[i]);
    }
    if(++i < deletionTracker.length) {
      response = await reportsClient.deleteReport(accessToken, deletionTracker[i]);
    }
    if(++i < deletionTracker.length) {
      response = await reportsClient.deleteReportMapping(accessToken, deletionTracker[i - 1], deletionTracker[i]);
    }

    await testIModelGroup.cleanupIModels();
  });

  it("get OData report", async function() {
    const oDataResponse = await oDataClient.getODataReport(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
  });

  it("get OData report metadata", async function() {
    const oDataResponse = await oDataClient.getODataReportMetadata(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
  });

  it("throw OData report metadata", async function() {
    await expect(oDataClient.getODataReportMetadata(accessToken, "-")).to.be.rejected;
  });

  it("get OData report entity", async function() {
    const oDataEntity = await oDataClient.getODataReportEntity(accessToken, reportId, oDataItem);
    expect(oDataEntity).to.not.be.undefined;
  });
});

