/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai').use(require('chai-as-promised'));
import { expect } from "chai";
import * as sinon from "sinon";
import { ExtractionRun, ExtractionLog, ExtractionStatus, ExtractionClient, ExtractorState, ReportsClient, Report, ReportCreate, ReportUpdate, ReportMapping, ReportMappingCreate } from "../reporting";
import { OperationsBase } from "../reporting/OperationsBase";

chai.should();
describe("Reports Client", () => {

  const reportsClient: ReportsClient = new ReportsClient();
  const reportsClientNewBase: ReportsClient = new ReportsClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;
  
  beforeEach(() => {
    fetchStub = sinon.stub(ReportsClient.prototype, "fetchData");
    requestStub = sinon.stub(ReportsClient.prototype, "createRequest");
    requestStub.returns("pass");
  })

  afterEach(() => {
    sinon.restore();
  })

  //run tests

  it("Reports - Get", async function () {
    const returns = {
      report: {
        id: 1,
      }
    }
    fetchStub.resolves(returns);
    let report = await reportsClient.getReport("-", "-");
    expect(report.id).to.be.equals(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-",
      "pass"
    )).to.be.equals(true);

    report = await reportsClientNewBase.getReport("-", "-");
    expect(fetchStub.calledWith(
      "BASE/reports/-",
      "pass"
    )).to.be.equals(true);
  });

  it("Reports - Get all", async function () {
    const returns1 = {
      reports: new Array(1, 2),
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      reports: new Array(3, 4),
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let reports: Array<Report> = await reportsClient.getReports("-", "-");
    expect(reports.length).to.be.equals(4);
    expect(reports[0]).to.be.equals(1);
    expect(reports[3]).to.be.equals(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=-",
      "pass"
    )).to.be.equals(true);

    reports = await reportsClientNewBase.getReports("-", "-");
    expect(fetchStub.calledWith(
      "BASE/reports?projectId=-",
      "pass"
    )).to.be.equals(true);
  });

  it("Reports - get all with top", async function () {
    const returns1 = {
      reports: new Array(1, 2),
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      reports: new Array(3, 4),
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let reports: Array<Report> = await reportsClient.getReports("-", "-", 2);
    expect(reports.length).to.be.equals(4);
    expect(reports[0]).to.be.equals(1);
    expect(reports[3]).to.be.equals(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=-&%24top=2",
      "pass"
    )).to.be.equals(true);

    reports = await reportsClientNewBase.getReports("-", "-", 2);
    expect(fetchStub.calledWith(
      "BASE/reports?projectId=-&%24top=2",
      "pass"
    )).to.be.equals(true);
  });

  it("Reports - Create", async function () {
    const newReport: ReportCreate = {
      displayName: "Test1",
      projectId: "-"
    }
    const returns = {
      report: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let report = await reportsClient.createReport("-", newReport);
    expect(report.id).to.be.equals("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/",
      "pass",
    )).to.be.equals(true);
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newReport)
    )).to.be.equals(true);

    report = await reportsClientNewBase.createReport("-", newReport);
    expect(fetchStub.calledWith(
      "BASE/reports/",
      "pass",
    )).to.be.equals(true);
  });

  it("Reports - Update", async function () {
    const newReport: ReportUpdate = {
      displayName: "Test1"
    }
    const returns = {
      report: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let report = await reportsClient.updateReport("-", "-", newReport);
    expect(report.id).to.be.equals("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-",
      "pass",
    )).to.be.equals(true);
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newReport)
    )).to.be.equals(true);

    report = await reportsClientNewBase.updateReport("-", "-", newReport);
    expect(fetchStub.calledWith(
      "BASE/reports/-",
      "pass",
    )).to.be.equals(true);
  });

  it("Reports - Delete", async function () {
    const returns = {
      status: 200
    }
    fetchStub.resolves(returns);
    let report = await reportsClient.deleteReport("-", "-");
    expect(report.status).to.be.equals(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-",
      "pass",
    )).to.be.equals(true);

    report = await reportsClientNewBase.deleteReport("-", "-");
    expect(fetchStub.calledWith(
      "BASE/reports/-",
      "pass",
    )).to.be.equals(true);
  });

  it("Report Mappings - Get all", async function () {
    const returns1 = {
      mappings: new Array(1, 2),
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      mappings: new Array(3, 4),
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let reports: Array<ReportMapping> = await reportsClient.getReportMappings("-", "-");
    expect(reports.length).to.be.equals(4);
    expect(reports[0]).to.be.equals(1);
    expect(reports[3]).to.be.equals(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings",
      "pass",
    )).to.be.equals(true);

    reports = await reportsClientNewBase.getReportMappings("-", "-");
    expect(fetchStub.calledWith(
      "BASE/reports/-/datasources/imodelMappings",
      "pass",
    )).to.be.equals(true);
  });

  it("Report Mappings - get all with top", async function () {
    const returns1 = {
      mappings: new Array(1, 2),
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      mappings: new Array(3, 4),
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let reports: Array<ReportMapping> = await reportsClient.getReportMappings("-", "-", 2);
    expect(reports.length).to.be.equals(4);
    expect(reports[0]).to.be.equals(1);
    expect(reports[3]).to.be.equals(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings/?%24top=2",
      "pass",
    )).to.be.equals(true);

    reports = await reportsClientNewBase.getReportMappings("-", "-", 2);
    expect(fetchStub.calledWith(
      "BASE/reports/-/datasources/imodelMappings/?%24top=2",
      "pass",
    )).to.be.equals(true);
  });

  it("Report Mappings - Create", async function () {
    const newMapping: ReportMappingCreate = {
      mappingId: "-",
      imodelId: "-"
    }
    const returns = {
      mapping: {
        mappingId: "1"
      }
    }
    fetchStub.resolves(returns);
    let report = await reportsClient.createReportMapping("-", "-", newMapping);
    expect(report.mappingId).to.be.equals("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings",
      "pass",
    )).to.be.equals(true);
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newMapping)
    )).to.be.equals(true);

    report = await reportsClientNewBase.createReportMapping("-", "-", newMapping);
    expect(fetchStub.calledWith(
      "BASE/reports/-/datasources/imodelMappings",
      "pass",
    )).to.be.equals(true);
  });

  it("Report Mappings - Delete", async function () {
    const returns = {
      status: 200
    }
    fetchStub.resolves(returns);
    let report = await reportsClient.deleteReportMapping("-", "-", "--");
    expect(report.status).to.be.equals(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings/--",
      "pass",
    )).to.be.equals(true);

    report = await reportsClientNewBase.deleteReportMapping("-", "-", "--");
    expect(fetchStub.calledWith(
      "BASE/reports/-/datasources/imodelMappings/--",
      "pass",
    )).to.be.equals(true);
  });
});