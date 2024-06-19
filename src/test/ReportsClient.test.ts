/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { ReportsClient } from "../reporting/clients/ReportsClient";
import { Report, ReportAggregation, ReportAggregationCreate, ReportCreate, ReportMapping, ReportMappingCreate, ReportUpdate } from "../reporting/interfaces/Reports";
use(chaiAsPromised);

describe("Reports Client", () => {
  const reportsClient: ReportsClient = new ReportsClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(reportsClient, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(reportsClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("ReportsClient - change base path", async () => {
    const client = new ReportsClient("BASE");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(client, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(client, "createRequest" as any);

    const returns = {
      report: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    await client.getReport("auth", "reportId");
    expect(fetchStub.getCall(0).args[0].substring(0, 4)).to.be.eq("BASE");
  });

  it("Reports - Get", async () => {
    const returns = {
      report: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    const report = await reportsClient.getReport("auth", "reportId");
    expect(report.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId",
      "pass",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports?projectId=projectId&deleted=false", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const reports: Array<Report> = await reportsClient.getReports("auth", "projectId");
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=projectId&deleted=false",
      "pass",
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
    let it = reportsClient.getReportsIterator("auth", "projectId");
    expect(it).to.not.be.undefined;
    await it.next();
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=projectId&deleted=false",
      "pass",
    )).to.be.true;

    it = reportsClient.getReportsIterator("auth", "projectId", 2);
    expect(it).to.not.be.undefined;
    await it.next();
    expect(fetchStub.calledWith(
      `https://api.bentley.com/insights/reporting/reports?projectId=projectId&deleted=false&$top=2`,
      "pass",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports?projectId=projectId&deleted=true", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const reports: Array<Report> = await reportsClient.getReports("auth", "projectId", undefined, true);
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=projectId&deleted=true",
      "pass",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports?projectId=projectId&deleted=false&$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const reports: Array<Report> = await reportsClient.getReports("auth", "projectId", 2);
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports?projectId=projectId&deleted=false&$top=2",
      "pass",
    )).to.be.true;
  });

  it("Reports - Create", async () => {
    const newReport: ReportCreate = {
      displayName: "Test1",
      projectId: "id",
    };
    const returns = {
      report: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const report = await reportsClient.createReport("auth", newReport);
    expect(report.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newReport),
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
    const report = await reportsClient.updateReport("auth", "reportId", newReport);
    expect(report.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "auth",
      JSON.stringify(newReport),
    )).to.be.true;
  });

  it("Reports - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    const report = await reportsClient.deleteReport("auth", "reportId");
    expect(report.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports/reportId/datasources/imodelMappings", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const reports: Array<ReportMapping> = await reportsClient.getReportMappings("auth", "reportId");
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId/datasources/imodelMappings",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports/reportId/datasources/imodelMappings/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const reports: Array<ReportMapping> = await reportsClient.getReportMappings("auth", "reportId", 2);
    expect(reports.length).to.be.eq(4);
    expect(reports[0]).to.be.eq(1);
    expect(reports[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId/datasources/imodelMappings/?$top=2",
      "pass",
    )).to.be.true;
  });

  it("Report Mappings - Create", async () => {
    const newMapping: ReportMappingCreate = {
      mappingId: "id",
      imodelId: "id",
    };
    const returns = {
      mapping: {
        mappingId: "1",
      },
    };
    fetchStub.resolves(returns);
    const report = await reportsClient.createReportMapping("auth", "reportId", newMapping);
    expect(report.mappingId).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId/datasources/imodelMappings",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newMapping),
    )).to.be.true;
  });

  it("Report Mappings - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    const report = await reportsClient.deleteReportMapping("auth", "reportId", "reportMappingId");
    expect(report.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId/datasources/imodelMappings/reportMappingId",
      "pass",
    )).to.be.true;
  });

  it("Report Aggregations - Get All", async () => {
    const returns1 = {
      aggregations: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      aggregations: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports/reportId/datasources/aggregations", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const aggregations: Array<ReportAggregation> = await reportsClient.getReportAggregations("auth", "reportId");
    expect(aggregations.length).to.be.eq(4);
    expect(aggregations[0]).to.be.eq(1);
    expect(aggregations[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId/datasources/aggregations",
      "pass",
    )).to.be.true;
  });

  it("Report Aggregations -  Get all with top", async () => {
    const returns1 = {
      aggregations: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      aggregations: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/reports/reportId/datasources/aggregations/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const aggregations: Array<ReportAggregation> = await reportsClient.getReportAggregations("auth", "reportId", 2);
    expect(aggregations.length).to.be.eq(4);
    expect(aggregations[0]).to.be.eq(1);
    expect(aggregations[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId/datasources/aggregations/?$top=2",
      "pass",
    )).to.be.true;
  });

  it("Report Aggregations - Create", async () => {
    const newAggregation: ReportAggregationCreate = {
      aggregationTableSetId: "id",
    };
    const returns = {
      aggregation: {
        aggregationTableSetId: "1",
      },
    };
    fetchStub.resolves(returns);
    const aggregation = await reportsClient.createReportAggregation("auth", "reportId", newAggregation);
    expect(aggregation.aggregationTableSetId).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId/datasources/aggregations",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newAggregation),
    )).to.be.true;
  });

  it("Report Aggregations - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    const aggregation = await reportsClient.deleteReportAggregation("auth", "reportId", "aggregationTableSetId");
    expect(aggregation.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/reports/reportId/datasources/aggregations/aggregationTableSetId",
      "pass",
    )).to.be.true;
  });
});
