/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AttributeDataType, CDM } from "../../grouping-and-mapping/interfaces/CDM";
import { expect } from "chai";
import { CDMClient } from "../../grouping-and-mapping/clients/CDMClient";
import * as sinon from "sinon";

describe.only("CDM Client unit tests", ()=> {
  const cdmClient: CDMClient = new CDMClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(cdmClient, "fetchJSON" as any);
    requestStub = sinon.stub(cdmClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("CDM Client - Get CDM", async ()=> {
    const returns: CDM = {
      name: "Insights_and_Reporting_Extractor",
      version: "1.0",
      entities: [{
        $type: "LocalEntity",
        name: "Beam",
        attributes: [{
          name: "ECInstanceId",
          dataType: AttributeDataType.String,
        },
        {
          name: "ECClassId",
          dataType: AttributeDataType.String,
        },
        {
          name: "UserLabel",
          dataType: AttributeDataType.String,
        },
        {
          name: "BBoxLow",
          dataType: AttributeDataType.String,
        },
        {
          name: "BBoxHigh",
          dataType: AttributeDataType.String,
        },
        ],
        partitions: [{
          name: "part00000",
          location: "Beam/part00000.csv",
        }],
      }],
    };
    fetchStub.resolves(returns);

    const cdm = await cdmClient.getCDM("authToken", "mappingId", "extractionId");
    expect(cdm.name).to.deep.equal("Insights_and_Reporting_Extractor");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/extractions/extractionId/cdm",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;
  });

  it("CDM Client - Get CMD Partition", async ()=> {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);

    const response = await cdmClient.getCDMPartition("authToken", "mappingId", "extractionId", "someLocation");

    expect(response.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/extractions/extractionId/cdm/partitions?location=someLocation",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;

  });
});
