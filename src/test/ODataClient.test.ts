/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { ODataClient, ODataEntityResponse, ODataEntityValue, ODataItem } from "../reporting";
import * as fs from "fs";
import * as path from "path";
use(chaiAsPromised);

describe("ODataClient", () => {
  const oDataClient: ODataClient = new ODataClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(oDataClient, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(oDataClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("ODataClient - change base path", async () => {
    const client = new ODataClient("BASE");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(client, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(client, "createRequest" as any);

    const returns = {
      value: [1, 2],
    };
    fetchStub.resolves(returns);
    await client.getODataReport("auth", "reportId");
    expect(fetchStub.getCall(0).args[0]).to.match(new RegExp("^BASE"));
  });

  it("Get OData report", async () => {
    const returns = {
      value: [1, 2],
    };
    fetchStub.resolves(returns);
    const report = await oDataClient.getODataReport("auth", "reportId");
    expect(report.value.length).to.be.eq(2);
    expect(report.value[0]).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/reportId",
      "pass",
    )).to.be.true;
  });

  it("Get OData report metadata", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(ODataClient.prototype, "fetchData" as any);
    const request: RequestInit = {
      body: "Test",
    };
    requestStub.returns(request);
    const myOptions = { status: 200, statusText: "Test" };
    let body: string = fs.readFileSync(path.join(__dirname, "test-data/validMetaData.xml"), "utf-8");
    let response: Response = new Response(body, myOptions);
    fetchStub.resolves(response);

    let report = await oDataClient.getODataReportMetadata("auth", "reportId");
    expect(report).to.not.be.undefined;
    expect(report[0].name).to.be.eq("EntityName");
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[0].columns[0].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[0].columns[1].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[0].columns[2].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[0].columns[3].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[0].columns[4].name);
    expect(report[0].columns[0].type).to.be.eq("Edm.String");
    expect(report[0].columns[1].type).to.be.eq("Edm.String");
    expect(report[0].columns[2].type).to.be.eq("Edm.String");
    expect(report[0].columns[3].type).to.be.eq("Edm.String");
    expect(report[0].columns[4].type).to.be.eq("Edm.String");

    body = fs.readFileSync(path.join(__dirname, "test-data/largeMetaData.xml"), "utf-8");
    response = new Response(body, myOptions);
    fetchStub.resolves(response);

    report = await oDataClient.getODataReportMetadata("auth", "reportId");
    expect(report).to.not.be.undefined;
    expect(report.length).to.be.eq(2);
    expect(report[1].name).to.be.eq("EntityName2");
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[1].columns[0].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[1].columns[1].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[1].columns[2].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[1].columns[3].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel", "BBoxLow", "BBoxHigh"]).to.include(report[1].columns[4].name);
    expect(report[1].columns[0].type).to.be.eq("Edm.String");
    expect(report[1].columns[1].type).to.be.eq("Edm.String");
    expect(report[1].columns[2].type).to.be.eq("Edm.String");
    expect(report[1].columns[3].type).to.be.eq("Edm.String");
    expect(report[1].columns[4].type).to.be.eq("Edm.String");

    body = fs.readFileSync(path.join(__dirname, "test-data/repeatNameSpaceMetaData.xml"), "utf-8");
    response = new Response(body, myOptions);
    fetchStub.resolves(response);

    report = await oDataClient.getODataReportMetadata("auth", "reportId");
    expect(report).to.not.be.undefined;
    expect(report.length).to.be.eq(2);
    expect(report[1].name).to.be.eq("EntityName2");
    expect(["ECInstanceId", "ECClassId", "UserLabel"]).to.include(report[0].columns[0].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel"]).to.include(report[0].columns[1].name);
    expect(["ECInstanceId", "ECClassId", "UserLabel"]).to.include(report[0].columns[2].name);
    expect(["BBoxLow", "BBoxHigh"]).to.include(report[1].columns[0].name);
    expect(["BBoxLow", "BBoxHigh"]).to.include(report[1].columns[1].name);
    expect(report[0].columns[0].type).to.be.eq("Edm.String");
    expect(report[0].columns[1].type).to.be.eq("Edm.String");
    expect(report[0].columns[2].type).to.be.eq("Edm.String");
    expect(report[1].columns[0].type).to.be.eq("Edm.String");
    expect(report[1].columns[1].type).to.be.eq("Edm.String");

    body = fs.readFileSync(path.join(__dirname, "test-data/noSchemaMetaData.xml"), "utf-8");
    response = new Response(body, myOptions);
    fetchStub.resolves(response);

    report = await oDataClient.getODataReportMetadata("auth", "reportId");
    expect(report).to.be.empty;

    body = fs.readFileSync(path.join(__dirname, "test-data/noDefaultSchemaMetaData.xml"), "utf-8");
    response = new Response(body, myOptions);
    fetchStub.resolves(response);

    report = await oDataClient.getODataReportMetadata("auth", "reportId");
    expect(report).to.be.empty;

    myOptions.status = 400;
    response = new Response(body, myOptions);
    fetchStub.throws(response);
    await expect(oDataClient.getODataReportMetadata("auth", "reportId")).to.be.rejected;

    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/reportId/$metadata",
      request,
    )).to.be.true;
  });

  it("Get OData report Entity", async () => {
    const item: ODataItem = {
      name: "test",
      url: "1/2/3",
    };
    const returns1: ODataEntityResponse = {
      "@odata.context": "context",
      "value": [{ one: "1", two: "2" }, { one: "1", two: "2" }],
      "@odata.nextLink": "url",
    };
    const returns2 = {
      "@odata.context": "context",
      "value": [{ three: "3", four: "4" }, { three: "3", four: "4" }],
      "@odata.nextLink": undefined,
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/odata/reportId/1/2/3", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const report: Array<ODataEntityValue> = await oDataClient.getODataReportEntities("auth", "reportId", item);
    expect(report).to.not.be.undefined;
    expect(report.length).to.be.eq(4);
    expect(report[0].one).to.be.eq("1");
    expect(report[3].four).to.be.eq("4");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/reportId/1/2/3",
      "pass",
    )).to.be.true;
  });

  it("Get OData report Entity", async () => {
    const item: ODataItem = {
      name: "test",
      url: "1/2/3",
    };
    const returns: ODataEntityResponse = {
      "@odata.context": "context",
      "value": [{ one: "1", two: "2" }, { one: "1", two: "2" }],
      "@odata.nextLink": "url",
    };
    fetchStub.onCall(0).resolves(returns);
    const report: ODataEntityResponse = await oDataClient.getODataReportEntityPage("auth", "reportId", item, 1);
    expect(report).to.not.be.undefined;
    expect(report["@odata.context"]).to.be.eq("context");
    expect(report["@odata.nextLink"]).to.be.eq("url");
    expect(report.value[0].one).to.be.eq("1");
    expect(report.value[1].two).to.be.eq("2");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/reportId/1/2/3?sequence=1",
      "pass",
    )).to.be.true;
  });
});
