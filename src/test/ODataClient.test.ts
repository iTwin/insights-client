/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from 'chai-as-promised';
import { expect, use } from 'chai';
import * as sinon from "sinon";
import { ODataClient, ODataItem, ODataEntityResponse, ODataEntityValue } from "../reporting";
use(chaiAsPromised);

describe("OData Client", () => {
  const oDataClient: ODataClient = new ODataClient();
  const oDataClientNewBase: ODataClient = new ODataClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;
  
  beforeEach(() => {
    fetchStub = sinon.stub(ODataClient.prototype, "fetchJSON");
    requestStub = sinon.stub(ODataClient.prototype, "createRequest");
    requestStub.returns("pass");
  })

  afterEach(() => {
    sinon.restore();
  })

  it("Get OData report", async function () {
    const returns = {
      value: [1, 2],
    }
    fetchStub.resolves(returns);
    let report = await oDataClient.getODataReport("-", "-");
    expect(report.value.length).to.be.eq(2);
    expect(report.value[0]).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/-",
      "pass",
    )).to.be.true;

    report = await oDataClientNewBase.getODataReport("-", "-");
    expect(fetchStub.calledWith(
      "BASE/odata/-",
      "pass",
    )).to.be.true;
  });

  it("Get OData report metadata", async function () {
    const fetchStub = sinon.stub(ODataClient.prototype, "fetchData")
    const request: RequestInit = {
      body: "Test",
    }
    requestStub.returns(request);
    const myOptions = { status: 200, statusText: "Test" };
    const body = {
      "Test": "test"
    }
    let response: Response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    let report = await oDataClient.getODataReportMetadata("-", "-");
    expect(report.status).to.be.eq(200);

    myOptions.status = 400;
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.throws(response);
    await expect(oDataClient.getODataReportMetadata("-", "-")).to.be.rejected;
    
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/-/$metadata",
      request,
    )).to.be.true;

    myOptions.status = 200;
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    report = await oDataClientNewBase.getODataReportMetadata("-", "-");
    expect(fetchStub.calledWith(
      "BASE/odata/-/$metadata",
      request,
    )).to.be.true;
  });

  it("Get OData report Entity", async function () {
    const item: ODataItem = {
      name: "test",
      url: "1/2/3"
    }
    const returns1: ODataEntityResponse = {
      "@odata.context": "-",
      value: [{"one": "1", "two": "2"}, {"one": "1", "two": "2"}],
      "@odata.nextLink": "url"
    }
    const returns2 = {
      "@odata.context": "-",
      value: [{"three": "3", "four": "4"}, {"three": "3", "four": "4"}],
      "@odata.nextLink": undefined
    }
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/odata/-/1/2/3", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/odata/-/1/2/3", "pass").resolves(returns2);
    
    let report: Array<ODataEntityValue> = await oDataClient.getODataReportEntities("-", "-", item);
    expect(report).to.not.be.undefined;
    expect(report.length).to.be.eq(4);
    expect(report[0]["one"]).to.be.eq("1");
    expect(report[3]["four"]).to.be.eq("4");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/-/1/2/3",
      "pass",
    )).to.be.true;

    report = await oDataClientNewBase.getODataReportEntities("-", "-", item);
    expect(fetchStub.calledWith(
      "BASE/odata/-/1/2/3",
      "pass",
    )).to.be.true;
  });

  it("Get OData report Entity", async function () {
    const item: ODataItem = {
      name: "test",
      url: "1/2/3"
    }
    const returns: ODataEntityResponse = {
      "@odata.context": "-",
      value: [{"one": "1", "two": "2"}, {"one": "1", "two": "2"}],
      "@odata.nextLink": "url"
    }
    fetchStub.onCall(0).resolves(returns);
    let report: ODataEntityResponse = await oDataClient.getODataReportEntityPage("-", "-", item, 1);
    expect(report).to.not.be.undefined;
    expect(report['@odata.context']).to.be.eq("-");
    expect(report['@odata.nextLink']).to.be.eq("url");
    expect(report.value[0]["one"]).to.be.eq("1");
    expect(report.value[1]["two"]).to.be.eq("2");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/-/1/2/3?sequence=1",
      "pass",
    )).to.be.true;

    report = await oDataClientNewBase.getODataReportEntityPage("-", "-", item, 1);
    expect(fetchStub.calledWith(
      "BASE/odata/-/1/2/3?sequence=1",
      "pass",
    )).to.be.true;
  });
});
