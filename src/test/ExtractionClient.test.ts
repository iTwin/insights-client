/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { Extraction, ExtractionClient, ExtractionLog, ExtractionRunRequest, ExtractorState } from "../reporting";
use(chaiAsPromised);

describe("ExtractionClient", () => {
  const extractionClient: ExtractionClient = new ExtractionClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(extractionClient, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(extractionClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("ExtractionClient - change base path", async () => {
    const client = new ExtractionClient("BASE");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(client, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(client, "createRequest" as any);

    const returns = {
      run: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    await client.runExtraction("auth", "iModelId");
    expect(fetchStub.getCall(0).args[0].substring(0, 4)).to.be.eq("BASE");
  });

  it("run extraction", async () => {
    const returns = {
      run: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    const extraction = await extractionClient.runExtraction("auth", "iModelId");
    expect(extraction.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/run",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      undefined,
    )).to.be.true;
  });

  it("run extraction with parameters", async () => {
    const returns = {
      run: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    const extractionRequest: ExtractionRunRequest = {
      changesetId: "changesetId",
      mappings: [{ id: "mappingId" }],
      ecInstanceIds: ["ecInstanceId"],
    };
    const extraction = await extractionClient.runExtraction("auth", "iModelId", extractionRequest);
    expect(extraction.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/run",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(extractionRequest),
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
      .withArgs("url", "pass").resolves(returns2);

    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs("auth", "jobId");
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/jobId/logs",
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
      .withArgs("url", "pass").resolves(returns2);

    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs("auth", "jobId", 2);
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/jobId/logs/?$top=2",
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
    const extraction = await extractionClient.getExtractionStatus("auth", "jobId");
    expect(extraction.state).to.be.eq("Succeeded");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/extraction/status/jobId",
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
      .withArgs("url", "pass").resolves(returns2);

    const extraction: Array<Extraction> = await extractionClient.getExtractionHistory("auth", "iModelId");
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/history",
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
      .withArgs("url", "pass").resolves(returns2);

    const extraction: Array<Extraction> = await extractionClient.getExtractionHistory("auth", "iModelId", 2);
    expect(extraction.length).to.be.eq(4);
    expect(extraction[0]).to.be.eq(1);
    expect(extraction[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/extraction/history/?$top=2",
      "pass",
    )).to.be.true;
  });
});
