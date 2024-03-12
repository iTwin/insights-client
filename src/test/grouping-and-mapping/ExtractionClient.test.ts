/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */

import { ExtractionClient } from "../../grouping-and-mapping/clients/ExtractionClient";
import { ExtractionContainer, ExtractionLogsResponse, ExtractionRequestDetails, ExtractionsResponse, ExtractionState, LogLevelEntry } from "../../grouping-and-mapping/interfaces/Extraction";
import { expect } from "chai";
import * as sinon from "sinon";

describe("Extraction Client unit tests", ()=> {
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;
  const extractionClient = new ExtractionClient();

  beforeEach(() => {
    fetchStub = sinon.stub(extractionClient, "fetchJSON" as any);
    requestStub = sinon.stub(extractionClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Extraction Client - Run extraction", async ()=> {
    const extractionRequestDetails: ExtractionRequestDetails = {
      iModelId: "iModelId",
      mappings: [{
        id: "mappingIdOne",
      }],
    };

    const returns: ExtractionContainer = {
      extraction: {
        id: "extractionId",
        state: ExtractionState.Queued,
        startedOn: "2022-09-10T13:44:56+00:00",
        _links: {
          status: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions/extractionId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const extraction = await extractionClient.runExtraction("authToken", extractionRequestDetails);

    expect(extraction.id).to.be.deep.equal("extractionId");
    expect(extraction.state).to.be.deep.equal(ExtractionState.Queued);

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions",
      "pass",
    )).to.be.true;

    expect(requestStub.calledWith(
      "POST",
      "authToken",
      JSON.stringify(extractionRequestDetails)
    )).to.be.true;
  });

  it("Extraction Client - Get extraction status", async ()=> {
    const returns: ExtractionContainer = {
      extraction: {
        id: "extractionId",
        state: ExtractionState.Succeeded,
        startedOn: "2022-09-10T13:44:56+00:00",
        _links: {
          status: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions/extractionId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const extraction = await extractionClient.getExtractionStatus("authToken", "extractionId");
    expect(extraction.id).to.be.deep.equal("extractionId");
    expect(extraction.state).to.be.deep.equal(ExtractionState.Succeeded);

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions/extractionId",
      "pass",
    )).to.be.true;

    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;
  });

  it("Extraction Client - Get iModel Extractions", async ()=> {
    const returns: ExtractionsResponse = {
      extractions: [
        {
          id: "extractionIdOne",
          state: ExtractionState.Succeeded,
          startedOn: "2022-09-10T13:44:56+00:00",
          _links: {
            status: {
              href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions/extractionIdOne",
            },
          },
        },
        {
          id: "extractionIdTwo",
          state: ExtractionState.Succeeded,
          startedOn: "2022-09-10T13:44:56+00:00",
          _links: {
            status: {
              href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions/extractionIdTwo",
            },
          },
        },

      ],
      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions?iModelId=iModelId",
        },
      },
    };
    fetchStub.resolves(returns);

    const extractionsResponse = await extractionClient.getIModelExtractions("authToken", "iModelId");
    expect(extractionsResponse).not.be.undefined;
    expect(extractionsResponse.extractions.length).to.be.equal(2);

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions?iModelId=iModelId",
      "pass",
    )).to.be.true;

    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;
  });

  it("Extraction Client - Get Extraction logs", async ()=> {
    const returns: ExtractionLogsResponse = {
      logs: [
        {
          state: ExtractionState.Succeeded,
          dateTime: "2022-09-10T13:44:56+00:00",
          contextType: "IModel",
          contextId: "70a3d6d3",
          level: LogLevelEntry.Information,
          category: "StateChange",
          message: "Completed.",
        },
        {
          state: ExtractionState.Running,
          dateTime: "2022-09-10T13:43:56+00:00",
          contextType: "IModel",
          contextId: "70a3d6d3",
          level: LogLevelEntry.Information,
          category: "StateChange",
          message: "Not completed yet.",
        },
      ],
      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions/extractionId/logs?$top=2",
        },
      },
    };
    fetchStub.resolves(returns);

    const extractionLogs = await extractionClient.getExtractionLogs("authToken", "extractionId", 2);

    expect(extractionLogs.logs.length).to.be.equal(2);

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/extractions/extractionId/logs?$top=2",
      "pass",
    )).to.be.true;

    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;

  });

});
