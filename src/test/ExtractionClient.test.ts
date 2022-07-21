/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai').use(require('chai-as-promised'));
import { expect } from "chai";
import * as sinon from "sinon";
import { ExtractionLog, ExtractionClient, ExtractorState } from "../reporting";

chai.should();
describe("Extraction Client", () => {

  const extractionClient: ExtractionClient = new ExtractionClient();
  const extractionClientNewBase: ExtractionClient = new ExtractionClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(ExtractionClient.prototype, "fetchData");
    requestStub = sinon.stub(ExtractionClient.prototype, "createRequest");
    requestStub.returns("pass");
  })

  afterEach(() => {
    sinon.restore();
  })

  //run tests

  it("run extraction", async function () {
    const returns = {
      run: {
        id: 1,
      }
    }
    fetchStub.resolves(returns);
    let extraction = await extractionClient.runExtraction("-", "-");
    expect(extraction.id).to.be.equals(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/extraction/run",
      "pass",
    )).to.be.equals(true);

    extraction = await extractionClientNewBase.runExtraction("-", "-");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/extraction/run",
      "pass",
    )).to.be.equals(true);
  });

  it("Get Logs", async function () {
    const returns1 = {
      logs: new Array(1, 2),
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      logs: new Array(3, 4),
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs("-", "-");
    expect(extraction.length).to.be.equals(4);
    expect(extraction[0]).to.be.equals(1);
    expect(extraction[3]).to.be.equals(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/-/logs",
      "pass",
    )).to.be.equals(true);

    extraction = await extractionClientNewBase.getExtractionLogs("-", "-");
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/-/logs",
      "pass",
    )).to.be.equals(true);
  });

  it("Get Logs with top", async function () {
    const returns1 = {
      logs: new Array(1, 2),
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      logs: new Array(3, 4),
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs("-", "-", 2);
    expect(extraction.length).to.be.equals(4);
    expect(extraction[0]).to.be.equals(1);
    expect(extraction[3]).to.be.equals(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/-/logs/?%24top=2",
      "pass",
    )).to.be.equals(true);

    extraction = await extractionClientNewBase.getExtractionLogs("-", "-", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/-/logs/?%24top=2",
      "pass",
    )).to.be.equals(true);
  });

  it("Get Status", async function () {
    const returns = {
      status: {
        state: ExtractorState.Succeeded
      }
    }
    fetchStub.resolves(returns);
    let extraction = await extractionClient.getExtractionStatus("-", "-");
    expect(extraction.state).to.be.equals("Succeeded");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/-",
      "pass",
    )).to.be.equals(true);

    extraction = await extractionClientNewBase.getExtractionStatus("-", "-");
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/-",
      "pass",
    )).to.be.equals(true);
  });
});