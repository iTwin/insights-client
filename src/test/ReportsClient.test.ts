/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { Report, ReportCreate, ReportMapping, ReportMappingCreate, ReportsClient, ReportUpdate } from "../reporting";
use(chaiAsPromised);

describe("Reports Client", () => {
  const reportsClient: ReportsClient = new ReportsClient();
  const reportsClientNewBase: ReportsClient = new ReportsClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(ReportsClient.prototype, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(ReportsClient.prototype, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Reports - Get", async () => {
    const returns = {
      report: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    let report = await reportsClient.getReport("-", "-");
    expect(report.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-",
      "pass"
    )).to.be.true;

    report = await reportsClientNewBase.getReport("-", "-");
    expect(fetchStub.calledWith(
      "BASE/reports/-",
      "pass"
    )).to.be.true;
  });

  it("Reports - Get all non deleted", async () => {
    const returns1 = {
      reports: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      reports: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports?projectId=-&deleted=false", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/reports?projectId=-&deleted=false", "pass").resolves(returns2);

    let reports: Array<Report> = await reportsClient.getReports("-", "-");
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=-&deleted=false",
      "pass"
    )).to.be.true;

    reports = await reportsClientNewBase.getReports("-", "-");
    expect(fetchStub.calledWith(
      "BASE/reports?projectId=-&deleted=false",
      "pass"
    )).to.be.true;
  });

  it("Get iterator with and without top", async () => {
    const returns = {
      reports: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.resolves(returns);
    let it = reportsClient.getReportsIterator("-", "-");
    expect(it).to.not.be.undefined;
    await it.next();
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=-&deleted=false",
      "pass"
    )).to.be.true;

    it = reportsClient.getReportsIterator("-", "-", false, 2);
    expect(it).to.not.be.undefined;
    await it.next();
    expect(fetchStub.calledWith(
      `https://api.bentley.com/insights/reporting/reports?projectId=-&deleted=false&%24top=2`,
      "pass"
    )).to.be.true;
  });

  it("Reports - Get all", async () => {
    const returns1 = {
      reports: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      reports: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports?projectId=-&deleted=true", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/reports?projectId=-&deleted=true", "pass").resolves(returns2);

    let reports: Array<Report> = await reportsClient.getReports("-", "-", true);
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=-&deleted=true",
      "pass"
    )).to.be.true;

    reports = await reportsClientNewBase.getReports("-", "-", true);
    expect(fetchStub.calledWith(
      "BASE/reports?projectId=-&deleted=true",
      "pass"
    )).to.be.true;
  });

  it("Reports - get all with top", async () => {
    const returns1 = {
      reports: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      reports: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports?projectId=-&deleted=false&%24top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/reports?projectId=-&deleted=false&%24top=2", "pass").resolves(returns2);

    let reports: Array<Report> = await reportsClient.getReports("-", "-", false, 2);
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=-&deleted=false&%24top=2",
      "pass"
    )).to.be.true;

    reports = await reportsClientNewBase.getReports("-", "-", false, 2);
    expect(fetchStub.calledWith(
      "BASE/reports?projectId=-&deleted=false&%24top=2",
      "pass"
    )).to.be.true;
  });

  it("Reports - Create", async () => {
    const newReport: ReportCreate = {
      displayName: "Test1",
      projectId: "-",
    };
    const returns = {
      report: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let report = await reportsClient.createReport("-", newReport);
    expect(report.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newReport)
    )).to.be.true;

    report = await reportsClientNewBase.createReport("-", newReport);
    expect(fetchStub.calledWith(
      "BASE/reports/",
      "pass",
    )).to.be.true;
  });

  it("Reports - Update", async () => {
    const newReport: ReportUpdate = {
      displayName: "Test1",
    };
    const returns = {
      report: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let report = await reportsClient.updateReport("-", "-", newReport);
    expect(report.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newReport)
    )).to.be.true;

    report = await reportsClientNewBase.updateReport("-", "-", newReport);
    expect(fetchStub.calledWith(
      "BASE/reports/-",
      "pass",
    )).to.be.true;
  });

  it("Reports - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let report = await reportsClient.deleteReport("-", "-");
    expect(report.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-",
      "pass",
    )).to.be.true;

    report = await reportsClientNewBase.deleteReport("-", "-");
    expect(fetchStub.calledWith(
      "BASE/reports/-",
      "pass",
    )).to.be.true;
  });

  it("Report Mappings - Get all", async () => {
    const returns1 = {
      mappings: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      mappings: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/reports/-/datasources/imodelMappings", "pass").resolves(returns2);

    let reports: Array<ReportMapping> = await reportsClient.getReportMappings("-", "-");
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings",
      "pass",
    )).to.be.true;

    reports = await reportsClientNewBase.getReportMappings("-", "-");
    expect(fetchStub.calledWith(
      "BASE/reports/-/datasources/imodelMappings",
      "pass",
    )).to.be.true;
  });

  it("Report Mappings - get all with top", async () => {
    const returns1 = {
      mappings: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      mappings: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings/?%24top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/reports/-/datasources/imodelMappings/?%24top=2", "pass").resolves(returns2);

    let reports: Array<ReportMapping> = await reportsClient.getReportMappings("-", "-", 2);
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings/?%24top=2",
      "pass",
    )).to.be.true;

    reports = await reportsClientNewBase.getReportMappings("-", "-", 2);
    expect(fetchStub.calledWith(
      "BASE/reports/-/datasources/imodelMappings/?%24top=2",
      "pass",
    )).to.be.true;
  });

  it("Report Mappings - Create", async () => {
    const newMapping: ReportMappingCreate = {
      mappingId: "-",
      imodelId: "-",
    };
    const returns = {
      mapping: {
        mappingId: "1",
      },
    };
    fetchStub.resolves(returns);
    let report = await reportsClient.createReportMapping("-", "-", newMapping);
    expect(report.mappingId).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newMapping)
    )).to.be.true;

    report = await reportsClientNewBase.createReportMapping("-", "-", newMapping);
    expect(fetchStub.calledWith(
      "BASE/reports/-/datasources/imodelMappings",
      "pass",
    )).to.be.true;
  });

  it("Report Mappings - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let report = await reportsClient.deleteReportMapping("-", "-", "--");
    expect(report.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/-/datasources/imodelMappings/--",
      "pass",
    )).to.be.true;

    report = await reportsClientNewBase.deleteReportMapping("-", "-", "--");
    expect(fetchStub.calledWith(
      "BASE/reports/-/datasources/imodelMappings/--",
      "pass",
    )).to.be.true;
  });
});
