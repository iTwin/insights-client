/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { Extraction, ExtractionClient, ExtractionLog, ExtractorState } from "../reporting";
use(chaiAsPromised);

describe("Extraction Client", () => {
  const extractionClient: ExtractionClient = new ExtractionClient();
  const extractionClientNewBase: ExtractionClient = new ExtractionClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(ExtractionClient.prototype, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(ExtractionClient.prototype, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("run extraction", async () => {
    const returns = {
      run: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    let extraction = await extractionClient.runExtraction("auth", "iModelId");
    expect(extraction.id).to.be.eql(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/run",
      "pass",
    )).to.be.true;

    extraction = await extractionClientNewBase.runExtraction("auth", "iModelId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/extraction/run",
      "pass",
    )).to.be.true;
  });

  it("Get Logs", async () => {
    const returns1 = {
      logs: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      logs: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/extraction/status/jobId/logs", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/extraction/status/jobId/logs", "pass").resolves(returns2);

    let extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs("auth", "jobId");
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/jobId/logs",
      "pass",
    )).to.be.true;

    extraction = await extractionClientNewBase.getExtractionLogs("auth", "jobId");
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/jobId/logs",
      "pass",
    )).to.be.true;
  });

  it("Get Logs with top", async () => {
    const returns1 = {
      logs: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      logs: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/extraction/status/jobId/logs/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/extraction/status/jobId/logs/?$top=2", "pass").resolves(returns2);

    let extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs("auth", "jobId", 2);
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/jobId/logs/?$top=2",
      "pass",
    )).to.be.true;

    extraction = await extractionClientNewBase.getExtractionLogs("auth", "jobId", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/jobId/logs/?$top=2",
      "pass",
    )).to.be.true;
  });

  it("Get Status", async () => {
    const returns = {
      status: {
        state: ExtractorState.Succeeded,
      },
    };
    fetchStub.resolves(returns);
    let extraction = await extractionClient.getExtractionStatus("auth", "jobId");
    expect(extraction.state).to.be.eq("Succeeded");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/jobId",
      "pass",
    )).to.be.true;

    extraction = await extractionClientNewBase.getExtractionStatus("auth", "jobId");
    expect(fetchStub.calledWith(
      "BASE/datasources/extraction/status/jobId",
      "pass",
    )).to.be.true;
  });

  it("Get History", async () => {
    const returns1 = {
      extractions: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      extractions: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/history", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/extraction/history", "pass").resolves(returns2);

    let extraction: Array<Extraction> = await extractionClient.getExtractionHistory("auth", "iModelId");
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/history",
      "pass",
    )).to.be.true;

    extraction = await extractionClientNewBase.getExtractionHistory("auth", "iModelId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/extraction/history",
      "pass",
    )).to.be.true;
  });

  it("Get Logs with top", async () => {
    const returns1 = {
      extractions: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      extractions: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/history/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/extraction/history/?$top=2", "pass").resolves(returns2);

    let extraction: Array<Extraction> = await extractionClient.getExtractionHistory("auth", "iModelId", 2);
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/history/?$top=2",
      "pass",
    )).to.be.true;

    extraction = await extractionClientNewBase.getExtractionHistory("auth", "iModelId", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/extraction/history/?$top=2",
      "pass",
    )).to.be.true;
  });
});
