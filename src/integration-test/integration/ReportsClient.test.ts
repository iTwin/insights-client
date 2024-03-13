/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import "reflect-metadata";
import { accessToken, aggregationsClient, iTwinId, mappingsClient, reportsClient, testIModel } from "../utils";
import { AggregationTableSetCreate, ReportAggregation, ReportAggregationCreate, ReportCreate, ReportMapping, ReportMappingCreate, ReportUpdate } from "../../reporting";
import { MappingCreate } from "../../grouping-and-mapping";
use(chaiAsPromised);

describe("Reports Client", () => {
  const mappingIds: Array<string> = [];
  const reportIds: Array<string> = [];
  const reportMappingIds: Array<string> = [];
  const reportAggregations: Array<string> = [];
  const aggregationIds: Array<string> = [];

  before(async () => {
    // create mappings for tests
    const newMapping: MappingCreate = {
      mappingName: "Test1",
      iModelId: testIModel.id,
    };
    let mapping = await mappingsClient.createMapping(accessToken, newMapping);
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test2";
    mapping = await mappingsClient.createMapping(accessToken, newMapping);
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test3";
    mapping = await mappingsClient.createMapping(accessToken, newMapping);
    mappingIds.push(mapping.id);

    // create reports for tests
    const newReport: ReportCreate = {
      displayName: "Test1",
      projectId: iTwinId,
    };
    let report = await reportsClient.createReport(accessToken, newReport);
    reportIds.push(report.id);

    newReport.displayName = "Test2";
    report = await reportsClient.createReport(accessToken, newReport);
    reportIds.push(report.id);

    newReport.displayName = "Test3";
    report = await reportsClient.createReport(accessToken, newReport);
    reportIds.push(report.id);

    // create deleted report
    newReport.displayName = "Test";
    report = await reportsClient.createReport(accessToken, newReport);
    await reportsClient.deleteReport(accessToken, report.id);

    // create reportMappings for tests
    const newReportMapping: ReportMappingCreate = {
      mappingId: mappingIds[mappingIds.length-3],
      imodelId: testIModel.id,
    };
    let reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[0], newReportMapping);
    reportMappingIds.push(reportMapping.mappingId);

    newReportMapping.mappingId = mappingIds[mappingIds.length-2];
    reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[0], newReportMapping);
    reportMappingIds.push(reportMapping.mappingId);

    newReportMapping.mappingId = mappingIds[mappingIds.length-1];
    reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[0], newReportMapping);
    reportMappingIds.push(reportMapping.mappingId);

    // create table sets for test
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "TableSet1",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingIds[mappingIds.length-3],
      datasourceType: "IModelMapping",
    };
    let tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    aggregationIds.push(tableSet.id);

    newAggregationTableSet.tableSetName = "TableSet2";
    tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    aggregationIds.push(tableSet.id);

    newAggregationTableSet.tableSetName = "TableSet3";
    tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    aggregationIds.push(tableSet.id);

    // create report aggregations for tests
    const newAggregation: ReportAggregationCreate = {
      aggregationTableSetId: aggregationIds[aggregationIds.length-3],
    };
    let aggregation = await reportsClient.createReportAggregation(accessToken, reportIds[0], newAggregation);
    reportAggregations.push(aggregation.aggregationTableSetId);

    newAggregation.aggregationTableSetId = aggregationIds[aggregationIds.length-2];
    aggregation = await reportsClient.createReportAggregation(accessToken, reportIds[0], newAggregation);
    reportAggregations.push(aggregation.aggregationTableSetId);

    newAggregation.aggregationTableSetId = aggregationIds[aggregationIds.length-1];
    aggregation = await reportsClient.createReportAggregation(accessToken, reportIds[0], newAggregation);
    reportAggregations.push(aggregation.aggregationTableSetId);
  });

  after(async () => {
    while(mappingIds.length > 0) {
      await mappingsClient.deleteMapping(accessToken, mappingIds.pop()!);
    }
    while(reportIds.length > 0) {
      await reportsClient.deleteReport(accessToken, reportIds.pop()!);
    }
  });

  // reports tests
  it("Reports - Create and delete", async () => {
    const newReport: ReportCreate = {
      displayName: "Test",
      projectId: iTwinId,
    };
    const report = await reportsClient.createReport(accessToken, newReport);
    expect(report).to.not.be.undefined;
    expect(report.displayName).to.be.eq("Test");

    const response: Response = await reportsClient.deleteReport(accessToken, report.id);
    expect(response.status).to.be.eq(204);
  });

  it("Reports - Get", async () => {
    const report = await reportsClient.getReport(accessToken, reportIds[0]);
    expect(report).to.not.be.undefined;
    expect(report.displayName).to.be.eq("Test1");
  });

  it("Reports - Update", async () => {
    const reportUpdate: ReportUpdate = {
      description: "Updated",
    };
    const report = await reportsClient.updateReport(accessToken, reportIds[0], reportUpdate);
    expect(report).to.not.be.undefined;
    expect(report.description).to.be.eq("Updated");
  });

  it("Reports - Get all including deleted", async () => {
    const reports = await reportsClient.getReports(accessToken, iTwinId, undefined, true);
    expect(reports).to.not.be.undefined;
    expect(reports.length).to.be.gt(3);
    expect(reports.some((x) => x.deleted)).to.be.true;
  });

  it("Reports - Get all", async () => {
    const reports = await reportsClient.getReports(accessToken, iTwinId);
    expect(reports).to.not.be.undefined;
    expect(reports.length).to.be.above(2);
    for(const report of reports) {
      expect(["Test1", "Test2", "Test3"]).to.include(report.displayName);
    }
  });

  it("Reports - Get with iterator", async () => {
    const reportsIt = reportsClient.getReportsIterator(accessToken, iTwinId, 2);
    let flag = false;
    for await(const report of reportsIt) {
      flag = true;
      expect(report).to.not.be.undefined;
      expect(["Test1", "Test2", "Test3"]).to.include(report.displayName);
    }
    expect(flag).to.be.true;
  });

  it("Reports - Get pages", async () => {
    const reportsIt = reportsClient.getReportsIterator(accessToken, iTwinId, 2);
    let elementCount = 0;
    let flag = false;
    for await(const reports of reportsIt.byPage()) {
      flag = true;
      expect(reports).to.not.be.undefined;
      if(reports.length) {
        for(const report of reports) {
          expect(["Test1", "Test2", "Test3"]).to.include(report.displayName);
        }
        elementCount += reports.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // report mapping tests
  it("Report mappings - Create and delete", async () => {
    const newMapping: MappingCreate = {
      mappingName: "Test",
      iModelId: testIModel.id,
    };
    const mapping = await mappingsClient.createMapping(accessToken, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    const newReportMapping: ReportMappingCreate = {
      mappingId: mappingIds[mappingIds.length - 1],
      imodelId: testIModel.id,
    };
    const reportMapping = await reportsClient.createReportMapping(accessToken, reportIds[0], newReportMapping);
    expect(reportMapping).to.not.be.undefined;
    expect(reportMapping.imodelId).to.be.eq(testIModel.id);
    reportMappingIds.push(reportMapping.mappingId);

    let response: Response;
    response = await reportsClient.deleteReportMapping(accessToken, reportIds[0], reportMappingIds.pop()!);
    expect(response.status).to.be.eq(204);
    response = await mappingsClient.deleteMapping(accessToken, mappingIds.pop()!);
    expect(response.status).to.be.eq(204);
  });

  it("Report mappings - Get all", async () => {
    const reportMappings: Array<ReportMapping> = await reportsClient.getReportMappings(accessToken, reportIds[0]);
    expect(reportMappings).to.not.be.undefined;
    expect(reportMappings.length).to.be.above(2);
    expect([...mappingIds]).to.include(reportMappings[0].mappingId);
  });

  it("Report mappings - Get with iterator", async () => {
    const reportsIt = reportsClient.getReportMappingsIterator(accessToken, reportIds[0], 2);
    let flag = false;
    for await(const reportMapping of reportsIt) {
      flag = true;
      expect(reportMapping).to.not.be.undefined;
      expect([...mappingIds]).to.include(reportMapping.mappingId);
    }
    expect(flag).to.be.true;
  });

  it("Report mappings - Get pages with iterator", async () => {
    const reportsIt = reportsClient.getReportMappingsIterator(accessToken, reportIds[0], 2);
    let elementCount = 0;
    let flag = false;
    for await(const reportMappings of reportsIt.byPage()) {
      flag = true;
      expect(reportMappings).to.not.be.undefined;
      if(reportMappings.length) {
        expect([...mappingIds]).to.include(reportMappings[0].mappingId);
        elementCount += reportMappings.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // report aggregation tests
  it("Report aggregations - Create and delete", async () => {
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "TableSet1",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingIds[mappingIds.length-3],
      datasourceType: "IModelMapping",
    };
    const tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    aggregationIds.push(tableSet.id);

    const newAggregation: ReportAggregationCreate = {
      aggregationTableSetId: aggregationIds[aggregationIds.length - 1],
    };
    const aggregation = await reportsClient.createReportAggregation(accessToken, reportIds[0], newAggregation);
    expect(aggregation).to.not.be.undefined;
    expect(aggregation.aggregationTableSetId).to.be.eq(aggregationIds[aggregationIds.length - 1]);
    reportAggregations.push(aggregation.aggregationTableSetId);

    let response: Response;
    response = await reportsClient.deleteReportAggregation(accessToken, reportIds[0], reportAggregations.pop()!);
    expect(response.status).to.be.eq(204);
    response = await aggregationsClient.deleteAggregationTableSet(accessToken, aggregationIds.pop()!);
    expect(response.status).to.be.eq(204);
  });

  it("Report aggregations - Get all", async () => {
    const aggregations: Array<ReportAggregation> = await reportsClient.getReportAggregations(accessToken, reportIds[0]);
    expect(aggregations).to.not.be.undefined;
    expect(aggregations.length).to.be.above(2);
    expect([...reportIds]).to.include(aggregations[0].reportId);
  });

  it("Report aggregations - Get with iterator", async () => {
    const aggregationsIt = reportsClient.getReportAggregationsIterator(accessToken, reportIds[0], 2);
    let flag = false;
    for await(const aggregation of aggregationsIt) {
      flag = true;
      expect(aggregation).to.not.be.undefined;
      expect([...reportIds]).to.include(aggregation.reportId);
    }
    expect(flag).to.be.true;
  });

  it("Report aggregations - Get pages with iterator", async () => {
    const aggregationsIt = reportsClient.getReportAggregationsIterator(accessToken, reportIds[0], 2);
    let elementCount = 0;
    let flag = false;
    for await(const aggregations of aggregationsIt.byPage()) {
      flag = true;
      expect(aggregations).to.not.be.undefined;
      if(aggregations.length) {
        expect([...reportIds]).to.include(aggregations[0].reportId);
        elementCount += aggregations.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });
});
