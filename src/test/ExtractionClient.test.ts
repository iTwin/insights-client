/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised"
import { expect, use } from "chai";
import * as sinon from "sinon";
import { ExtractionLog, ExtractionClient, ExtractorState } from "../reporting";
use(chaiAsPromised);

describe("Extraction Client", () => {

  const extractionClient: ExtractionClient = new ExtractionClient();
  const extractionClientNewBase: ExtractionClient = new ExtractionClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(ExtractionClient.prototype, "fetchJSON");
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
    expect(extraction.id).to.be.eql(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/extraction/run",
      "pass",
    )).to.be.eq(true);

    extraction = await extractionClientNewBase.runExtraction("-", "-");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/extraction/run",
      "pass",
    )).to.be.eq(true);
  });

  it("Get Logs", async function () {
    const returns1 = {
      logs: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      logs: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs("-", "-");
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/-/logs",
      "pass",
    )).to.be.eq(true);

    extraction = await extractionClientNewBase.getExtractionLogs("-", "-");
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/-/logs",
      "pass",
    )).to.be.eq(true);
  });

  it("Get Logs with top", async function () {
    const returns1 = {
      logs: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      logs: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs("-", "-", 2);
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/-/logs/?%24top=2",
      "pass",
    )).to.be.eq(true);

    extraction = await extractionClientNewBase.getExtractionLogs("-", "-", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/-/logs/?%24top=2",
      "pass",
    )).to.be.eq(true);
  });

  it("Get Status", async function () {
    const returns = {
      status: {
        state: ExtractorState.Succeeded
      }
    }
    fetchStub.resolves(returns);
    let extraction = await extractionClient.getExtractionStatus("-", "-");
    expect(extraction.state).to.be.eq("Succeeded");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/-",
      "pass",
    )).to.be.eq(true);

    extraction = await extractionClientNewBase.getExtractionStatus("-", "-");
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/-",
      "pass",
    )).to.be.eq(true);
  });
});