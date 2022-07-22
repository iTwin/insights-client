/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai').use(require('chai-as-promised'))
import { expect } from "chai";
import "reflect-metadata";
import { AuthorizationCallback, getTestRunId, TestConstants, getTestDIContainer, TestIModelGroup, TestIModelGroupFactory, IModelMetadata, TestIModelFileProvider, TestAuthorizationProvider, TestIModelCreator, ReusableTestIModelProvider, TestProjectProvider } from "../utils";
import { MappingCreate, MappingsClient, Report, ReportCreate, ReportMapping, ReportMappingCreate, ReportsClient, ReportUpdate, RequiredError } from "../../reporting";

chai.should();
describe("Reports Client", () => {
  const reportsClient: ReportsClient = new ReportsClient();
  const mappingsClient: MappingsClient = new MappingsClient();
  let accessToken: string;

  let authorization: AuthorizationCallback;
  let testIModelGroup: TestIModelGroup;
  let testIModel: IModelMetadata;
  let testIModelFileProvider: TestIModelFileProvider;

  let projectId: string;
  let mappingIds: Array<string> = [];
  let reportIds: Array<string> = [];
  let reportMappingIds: Array<string> = [];

  before(async function () {
    this.timeout(0);

    const container = getTestDIContainer();
    
    const authorizationProvider = container.get(TestAuthorizationProvider);
    authorization = authorizationProvider.getAdmin1Authorization();
    accessToken = "Bearer " + (await authorization()).token;

    const testProjectProvider = container.get(TestProjectProvider);
    projectId = await testProjectProvider.getOrCreate();

    testIModelFileProvider = container.get(TestIModelFileProvider);

    const testIModelGroupFactory = container.get(TestIModelGroupFactory);
    testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: TestConstants.PackagePrefix, testSuiteName: "ManagementNamedVersionOperations" });

    const testIModelCreator = container.get(TestIModelCreator);
    testIModel = await testIModelCreator.createEmptyAndUploadChangesets(testIModelGroup.getPrefixedUniqueIModelName("Test iModel for write"));

    const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
    testIModel = await reusableTestIModelProvider.getOrCreate();

    //create mappings for tests
    const newMapping: MappingCreate = {
      mappingName: "Test1"
    }
    let mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test2";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test3";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    //create reports for tests
    const newReport: ReportCreate = {
      displayName: "Test1",
      projectId: projectId
    }
    let report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    reportIds.push(report.id);

    newReport.displayName = "Test2";
    report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    reportIds.push(report.id);

    newReport.displayName = "Test3";
    report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    reportIds.push(report.id);

    //create reportMappings for tests
    let newReportMapping: ReportMappingCreate = {
      mappingId: mappingIds[mappingIds.length-3],
      imodelId: testIModel.id
    };
    let reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[reportIds.length-1], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    reportMappingIds.push(reportMapping.mappingId);

    newReportMapping.mappingId = mappingIds[mappingIds.length-2];
    reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[reportIds.length-1], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    reportMappingIds.push(reportMapping.mappingId);

    newReportMapping.mappingId = mappingIds[mappingIds.length-1];
    reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[reportIds.length-1], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    reportMappingIds.push(reportMapping.mappingId);
  });

  after(async function () {
    this.timeout(0);

    let response: Response;
    while(reportMappingIds.length > 0) {
      response = await reportsClient.deleteReportMapping(accessToken, reportIds[reportIds.length - 1], reportMappingIds.pop() ?? "");
      expect(response.status).to.be.equals(204);
    }
    while(mappingIds.length > 0) {
      response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop() ?? "");
      expect(response.status).to.be.equals(204);
    }
    while(reportIds.length > 0) {
      response = await reportsClient.deleteReport(accessToken, reportIds.pop() ?? "");
      expect(response.status).to.be.equals(204);
    }

    await testIModelGroup.cleanupIModels();
  });

  //reports tests

  it("Reports - Create and delete", async function () {
    this.timeout(0);
    const newReport: ReportCreate = {
      displayName: "Test",
      projectId: projectId
    }
    let report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;

    let response: Response = await reportsClient.deleteReport(accessToken, report.id);
    expect(response.status).to.be.equals(204);
  });

  it("Reports - Get", async function () {
    this.timeout(0);
    let report = await reportsClient.getReport(accessToken, reportIds[reportIds.length - 1]);
    expect(report).to.not.be.undefined;
  });

  it("Reports - Update", async function () {
    this.timeout(0);
    const reportUpdate: ReportUpdate = {
      displayName: "Updated"
    }
    let report = await reportsClient.updateReport(accessToken, reportIds[reportIds.length - 1], reportUpdate);
    expect(report).to.not.be.undefined;
  });

  it("Reports - Get all", async function () {
    this.timeout(0);
    let reports = await reportsClient.getReports(accessToken, projectId);
    expect(reports).to.not.be.undefined;
    expect(reports.length).to.be.above(2);
  });

  it("Reports - Get 2 with iterator", async function () {
    this.timeout(0);
    let reportsIt = reportsClient.getReportsIterator(accessToken, projectId, 2);
    let reports: Report = (await reportsIt.next()).value;
    expect(reports).to.not.be.undefined;
    reports = (await reportsIt.next()).value;
    expect(reports).to.not.be.undefined;
  });

  it("Reports - Get 2 pages", async function () {
    this.timeout(0);
    let reportsIt = reportsClient.getReportsIterator(accessToken, projectId, 2);
    let reports: Array<Report> = (await reportsIt.byPage().next()).value;
    expect(reports).to.not.be.undefined;
    expect(reports.length).to.be.equals(2);
    reports = (await reportsIt.byPage().next()).value;
    expect(reports).to.not.be.undefined;
    expect(reports.length).to.be.above(0);
  });

  //report mapping tests

  it("Report mappings - Create and delete", async function() {
    this.timeout(0);
    const newMapping: MappingCreate = {
      mappingName: "Test"
    }
    let mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    const newReportMapping: ReportMappingCreate = {
      mappingId: mappingIds[mappingIds.length - 1],
      imodelId: testIModel.id
    };
    let reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[reportIds.length - 1], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    reportMappingIds.push(reportMapping.mappingId);

    let response: Response;
    response = await reportsClient.deleteReportMapping(accessToken, reportIds[reportIds.length - 1], reportMappingIds.pop() ?? "");
    expect(response.status).to.be.equals(204);
    response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop() ?? "");
    expect(response.status).to.be.equals(204);
  })

  it("Report mappings - Get all", async function () {
    this.timeout(0);
    let reportMappings: Array<ReportMapping> = await reportsClient.getReportMappings(accessToken, reportIds[reportIds.length - 1]);
    expect(reportMappings).to.not.be.undefined;
  });

  it("Report mappings - Get 3 with iterator", async function () {
    this.timeout(0);
    let reportsIt = reportsClient.getReportMappingsIterator(accessToken, reportIds[reportIds.length - 1], 2);
    let reportMapping: ReportMapping = (await reportsIt.next()).value;
    expect(reportMapping).to.not.be.undefined;
    reportMapping = (await reportsIt.next()).value;
    expect(reportMapping).to.not.be.undefined;
    reportMapping = (await reportsIt.next()).value;
    expect(reportMapping).to.not.be.undefined;
  });

  it("Report mappings - Get 2 pages with iterator", async function () {
    this.timeout(0);
    let reportsIt = reportsClient.getReportMappingsIterator(accessToken, reportIds[reportIds.length - 1], 2);
    let reportMappings: Array<ReportMapping> = (await reportsIt.byPage().next()).value;
    expect(reportMappings).to.not.be.undefined;
    expect(reportMappings.length).to.be.equals(2);

    reportMappings = (await reportsIt.byPage().next()).value;
    expect(reportMappings).to.not.be.undefined;
    expect(reportMappings.length).to.be.above(0);
  });
});
