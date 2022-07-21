/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai').use(require('chai-as-promised'))
import { expect } from "chai";
import { ExtractionClient, ExtractionLog, ExtractionRun, ExtractionStatus, ExtractionStatusSingle, ExtractorState, GroupCollection, GroupCreate, MappingCreate, MappingsClient, ODataClient, ODataItem, ReportCreate, ReportMappingCreate, ReportsClient } from "../../reporting";
import "reflect-metadata";
import { getTestRunId, Constants, getTestDIContainer } from "../utils/index";
import { IModelsClient, IModelsClientOptions } from "../imodels-client-authoring/src/IModelsClient";
import { AuthorizationCallback, sleep } from "../imodels-client-management/src/IModelsClientExports";
import { TestUtilTypes, TestIModelGroup, TestIModelGroupFactory, BaseIntegrationTestsConfig, IModelMetadata, TestIModelFileProvider, TestAuthorizationProvider, TestIModelCreator, ReusableTestIModelProvider, TestProjectProvider } from "../imodels-client-test-utils/src/iModelsClientTestUtilsExports";
import { report } from "process";

chai.should();
describe("OData Client", () => {
  const oDataClient: ODataClient = new ODataClient();
  const reportsClient: ReportsClient = new ReportsClient();
  const mappingsClient: MappingsClient = new MappingsClient();
  const extractionClient: ExtractionClient = new ExtractionClient(); 
  let accessToken: string;
  let projectId: string;
  let reportId: string;
  let oDataItem: ODataItem;

  let deletionTracker: Array<string> = [];

  let iModelsClient: IModelsClient;
  let authorization: AuthorizationCallback;
  let testIModelGroup: TestIModelGroup;
  let testIModel: IModelMetadata;
  let testIModelFileProvider: TestIModelFileProvider;

  before(async function () {
    this.timeout(0);

    const container = getTestDIContainer();

    const iModelsClientOptions = container.get<IModelsClientOptions>(TestUtilTypes.IModelsClientOptions);
    iModelsClient = new IModelsClient(iModelsClientOptions);
    
    const authorizationProvider = container.get(TestAuthorizationProvider);
    authorization = authorizationProvider.getAdmin1Authorization();
    accessToken = "Bearer " + (await authorization()).token;

    testIModelFileProvider = container.get(TestIModelFileProvider);

    const testProjectProvider = container.get(TestProjectProvider);
    projectId = await testProjectProvider.getOrCreate();

    const testIModelGroupFactory = container.get(TestIModelGroupFactory);
    testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: Constants.PackagePrefix, testSuiteName: "ManagementNamedVersionOperations" });

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
      query: "select * from biscore.element"
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

    let status: ExtractionStatus;
    for (const start = performance.now(); performance.now() - start < 6 * 60 * 1000; await sleep(3000)) {
      status = await extractionClient.getExtractionStatus(accessToken, extraction.id);
      if(status.state !== ExtractorState.Queued && status.state.valueOf() !== ExtractorState.Running)
        break;
    }
    expect(status!.state).to.be.equals(ExtractorState.Succeeded);

    const oDataResponse = await oDataClient.getODataReport(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
    expect(oDataResponse.value.length).to.be.above(0);
    oDataItem = oDataResponse.value[0];

  });

  after(async function () {
    this.timeout(0);
    let response: Response;
    let i = 0;
    if(i < deletionTracker.length) {
      response = await mappingsClient.deleteMapping(accessToken, testIModel.id, deletionTracker[i]);
      expect(response.status).to.be.equals(204);
    }
    if(++i < deletionTracker.length) {
      response = await reportsClient.deleteReport(accessToken, deletionTracker[i]);
      expect(response.status).to.be.equals(204);
    }
    if(++i < deletionTracker.length) {
      response = await reportsClient.deleteReportMapping(accessToken, deletionTracker[i - 1], deletionTracker[i]);
      expect(response.status).to.be.equals(204);
    }

    await testIModelGroup.cleanupIModels();
  });

  it("get OData report", async function() {
    this.timeout(0);
    const oDataResponse = await oDataClient.getODataReport(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
  });

  it("get OData report metadata", async function() {
    this.timeout(0);
    const oDataResponse = await oDataClient.getODataReportMetadata(accessToken, reportId);
    expect(oDataResponse).to.not.be.undefined;
  });

  it("throw OData report metadata", async function() {
    this.timeout(0);
    await expect(oDataClient.getODataReportMetadata(accessToken, "-")).to.be.rejected;
  });

  it("get OData report entity", async function() {
    this.timeout(0);
    const oDataEntity = await oDataClient.getODataReportEntity(accessToken, reportId, oDataItem);
    expect(oDataEntity).to.not.be.undefined;
  });
});

