/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai').use(require('chai-as-promised'));
import { expect } from "chai";
import * as sinon from "sinon";
import * as isomorphicFetch from 'cross-fetch';
import { ExtractionLog, ExtractionClient, ExtractorState, ODataClient, ODataItem, ODataEntityResponse } from "../reporting";
import { OperationsBase } from "../reporting/OperationsBase";

chai.should();
describe("OData Client", () => {

  const oDataClient: ODataClient = new ODataClient();
  const oDataClientNewBase: ODataClient = new ODataClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;
  
  beforeEach(() => {
    fetchStub = sinon.stub(ODataClient.prototype, "fetchData");
    requestStub = sinon.stub(ODataClient.prototype, "createRequest");
    requestStub.returns("pass");
  })

  afterEach(() => {
    sinon.restore();
  })

  //run tests

  it("Get OData report", async function () {
    const returns = {
      value: new Array(1, 2),
    }
    fetchStub.resolves(returns);
    let report = await oDataClient.getODataReport("-", "-");
    expect(report.value.length).to.be.equals(2);
    expect(report.value[0]).to.be.equals(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/-",
      "pass",
    )).to.be.equals(true);

    report = await oDataClientNewBase.getODataReport("-", "-");
    expect(fetchStub.calledWith(
      "BASE/odata/-",
      "pass",
    )).to.be.equals(true);
  });

  it("Get OData report metadata", async function () {
    const request: RequestInit = {
      body: "Test",
    }
    requestStub.returns(request);
    const fetchStub = sinon.stub(oDataClient, "fetch")
    let myOptions = { status: 200, statusText: "Test" };
    const body = {
      "Test": "test"
    }
    let response: Response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    let report = await oDataClient.getODataReportMetadata("-", "-");
    expect(report.status).to.be.equals(200);

    myOptions.status = 400;
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    await expect(oDataClient.getODataReportMetadata("-", "-")).to.be.rejected;
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/-/$metadata",
      request,
    )).to.be.equals(true);

    myOptions.status = 200;
    const fetchStubNewBase = sinon.stub(oDataClientNewBase, "fetch")
    response = new Response(JSON.stringify(body), myOptions);
    fetchStubNewBase.resolves(response);
    report = await oDataClientNewBase.getODataReportMetadata("-", "-");
    expect(fetchStubNewBase.calledWith(
      "BASE/odata/-/$metadata",
      request,
    )).to.be.equals(true);
  });

  it("Get OData report Entity", async function () {
    const item: ODataItem = {
      name: "test",
      url: "1/2/3"
    }
    const returns1: ODataEntityResponse = {
      "@odata.context": "-",
      value: new Array({"one": "1", "two": "2"}, {"one": "1", "two": "2"}),
      "@odata.nextLink": "url"
    }
    const returns2 = {
      "@odata.context": "-",
      value: new Array({"three": "3", "four": "4"}, {"three": "3", "four": "4"}),
      "@odata.nextLink": undefined
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let report: {[key: string]: string;}[] | undefined = await oDataClient.getODataReportEntity("-", "-", item);
    expect(report).to.not.be.undefined;
    expect(report!.length).to.be.equals(4);
    expect(report![0]["one"]).to.be.equals("1");
    expect(report![3]["four"]).to.be.equals("4");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/odata/-/1/2/3?sequence=0",
      "pass",
    )).to.be.equals(true);

    report = await oDataClientNewBase.getODataReportEntity("-", "-", item);
    expect(fetchStub.calledWith(
      "BASE/odata/-/1/2/3?sequence=0",
      "pass",
    )).to.be.equals(true);
  });
});
