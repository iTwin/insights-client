/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import "reflect-metadata";
import { accessToken, projectId, testIModel, testIModelGroup } from "../utils";
import { MappingCreate, MappingsClient, ReportCreate, ReportMapping, ReportMappingCreate, ReportsClient, ReportUpdate } from "../../reporting";
use(chaiAsPromised);

describe("Reports Client", () => {
  const reportsClient: ReportsClient = new ReportsClient();
  const mappingsClient: MappingsClient = new MappingsClient();

  const mappingIds: Array<string> = [];
  const reportIds: Array<string> = [];
  const reportMappingIds: Array<string> = [];

  before(async function () {
    // create mappings for tests
    const newMapping: MappingCreate = {
      mappingName: "Test1",
    };
    let mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.be.eq("Test1");
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test2";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.be.eq("Test2");
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test3";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.be.eq("Test3");
    mappingIds.push(mapping.id);

    // create reports for tests
    const newReport: ReportCreate = {
      displayName: "Test1",
      projectId,
    };
    let report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    expect(report.displayName).to.be.eq("Test1");
    reportIds.push(report.id);

    newReport.displayName = "Test2";
    report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    expect(report.displayName).to.be.eq("Test2");
    reportIds.push(report.id);

    newReport.displayName = "Test3";
    report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    expect(report.displayName).to.be.eq("Test3");
    reportIds.push(report.id);

    // create reportMappings for tests
    const newReportMapping: ReportMappingCreate = {
      mappingId: mappingIds[mappingIds.length-3],
      imodelId: testIModel.id,
    };
    let reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[reportIds.length-1], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    expect(reportMapping.mappingId).to.be.eq(mappingIds[mappingIds.length-3]);
    reportMappingIds.push(reportMapping.mappingId);

    newReportMapping.mappingId = mappingIds[mappingIds.length-2];
    reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[reportIds.length-1], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    expect(reportMapping.mappingId).to.be.eq(mappingIds[mappingIds.length-2]);
    reportMappingIds.push(reportMapping.mappingId);

    newReportMapping.mappingId = mappingIds[mappingIds.length-1];
    reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[reportIds.length-1], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    expect(reportMapping.mappingId).to.be.eq(mappingIds[mappingIds.length-1]);
    reportMappingIds.push(reportMapping.mappingId);
  });

  after(async function () {
    while(reportMappingIds.length > 0) {
      await reportsClient.deleteReportMapping(accessToken, reportIds[reportIds.length - 1], reportMappingIds.pop()!);
    }
    while(mappingIds.length > 0) {
      await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop()!);
    }
    while(reportIds.length > 0) {
      await reportsClient.deleteReport(accessToken, reportIds.pop()!);
    }
    await testIModelGroup.cleanupIModels();
  });

  // reports tests
  it("Reports - Create and delete", async function () {
    const newReport: ReportCreate = {
      displayName: "Test",
      projectId,
    };
    const report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    expect(report.displayName).to.not.be.undefined;

    const response: Response = await reportsClient.deleteReport(accessToken, report.id);
    expect(response.status).to.be.eq(204);
  });

  it("Reports - Get", async function () {
    const report = await reportsClient.getReport(accessToken, reportIds[reportIds.length - 1]);
    expect(report).to.not.be.undefined;
    expect(report.displayName).to.not.be.undefined;
  });

  it("Reports - Update", async function () {
    const reportUpdate: ReportUpdate = {
      displayName: "Updated",
    };
    const report = await reportsClient.updateReport(accessToken, reportIds[reportIds.length - 1], reportUpdate);
    expect(report).to.not.be.undefined;
    expect(report.displayName).to.not.be.undefined;
    expect(report.displayName).to.be.eq("Updated");
  });

  it("Reports - Get all non deleted", async function () {
    const reports = await reportsClient.getReports(accessToken, projectId);
    expect(reports).to.not.be.undefined;
    expect(reports.length).to.be.above(2);
    expect(reports[0].displayName).to.not.be.undefined;
  });

  it("Reports - Get all", async function () {
    const reports = await reportsClient.getReports(accessToken, projectId, true, undefined);
    expect(reports).to.not.be.undefined;
    expect(reports.length).to.be.above(2);
    expect(reports[0].displayName).to.not.be.undefined;
  });

  it("Reports - Get with iterator", async function () {
    const reportsIt = reportsClient.getReportsIterator(accessToken, projectId, false, 2);
    let flag = false;
    for await(const report of reportsIt) {
      flag = true;
      expect(report).to.not.be.undefined;
      expect(report.displayName).to.not.be.undefined;
    }
    expect(flag).to.be.true;
  });

  it("Reports - Get pages", async function () {
    const reportsIt = reportsClient.getReportsIterator(accessToken, projectId, false, 2);
    let elementCount = 0;
    let flag = false;
    for await(const reports of reportsIt.byPage()) {
      flag = true;
      expect(reports).to.not.be.undefined;
      if(reports.length) {
        expect(reports[0].displayName).to.not.be.undefined;
        elementCount += reports.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // report mapping tests
  it("Report mappings - Create and delete", async function () {
    const newMapping: MappingCreate = {
      mappingName: "Test",
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    const newReportMapping: ReportMappingCreate = {
      mappingId: mappingIds[mappingIds.length - 1],
      imodelId: testIModel.id,
    };
    const reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[reportIds.length - 1], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    expect(reportMapping.imodelId).to.not.be.undefined;
    reportMappingIds.push(reportMapping.mappingId);

    let response: Response;
    response = await reportsClient.deleteReportMapping(accessToken, reportIds[reportIds.length - 1], reportMappingIds.pop()!);
    expect(response.status).to.be.eq(204);
    response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop()!);
    expect(response.status).to.be.eq(204);
  });

  it("Report mappings - Get all", async function () {
    const reportMappings: Array<ReportMapping> = await reportsClient.getReportMappings(accessToken, reportIds[reportIds.length - 1]);
    expect(reportMappings).to.not.be.undefined;
    expect(reportMappings.length).to.be.above(2);
    expect(reportMappings[0].mappingId).to.not.be.undefined;
  });

  it("Report mappings - Get with iterator", async function () {
    const reportsIt = reportsClient.getReportMappingsIterator(accessToken, reportIds[reportIds.length - 1], 2);
    let flag = false;
    for await(const reportMapping of reportsIt) {
      flag = true;
      expect(reportMapping).to.not.be.undefined;
      expect(reportMapping.imodelId).to.not.be.undefined;
    }
    expect(flag).to.be.true;
  });

  it("Report mappings - Get pages with iterator", async function () {
    const reportsIt = reportsClient.getReportMappingsIterator(accessToken, reportIds[reportIds.length - 1], 2);
    let elementCount = 0;
    let flag = false;
    for await(const reportMappings of reportsIt.byPage()) {
      flag = true;
      expect(reportMappings).to.not.be.undefined;
      if(reportMappings.length) {
        expect(reportMappings[0].mappingId).to.not.be.undefined;
        elementCount += reportMappings.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });
});
