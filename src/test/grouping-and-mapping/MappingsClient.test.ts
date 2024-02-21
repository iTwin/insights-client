/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { MappingsClient } from "../../grouping-and-mapping/clients/MappingsClient";
import { MappingContainer, MappingCreate } from "../../grouping-and-mapping/interfaces/Mappings";
import * as sinon from "sinon";

describe.only("Mappings Client Unit tests", ()=> {
  const mappingsClient: MappingsClient = new MappingsClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(mappingsClient, "fetchJSON" as any);
    requestStub = sinon.stub(mappingsClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Mappings client - Create", async ()=> {
    const newMapping: MappingCreate = {
      iModelId: "iModelIdTest",
      mappingName: "MappingTest",
    };

    const createdResponse: MappingContainer = {
      mapping: {
        id: "1",
        mappingName: "MappingTest",
        description: "Test mapping created response",
        extractionEnabled: false,
        createdOn: "2021-09-03T10:48:45+00:00",
        createdBy: "john.doe@example.com",
        modifiedOn: "2022-01-10T13:44:56+00:00",
        modifiedBy: "john.doe@example.com",
        /* eslint-disable @typescript-eslint/naming-convention */
        _links: {
          iModel: {
            href: "https://api.bentley.com/imodels/iModelIdTest",
          },
        },
      },
    };

    fetchStub.resolves(createdResponse);
    const mapping = await mappingsClient.createMapping("token", newMapping);

    expect(mapping.id).to.be.deep.equal("1");
    expect(mapping.mappingName).to.be.deep.equal("MappingTest");
    expect(mapping._links.iModel.href).to.deep.equal("https://api.bentley.com/imodels/iModelIdTest");

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings",
      "pass",
    )).to.be.true;

    expect(requestStub.calledWith(
      "POST",
      "token",
      JSON.stringify(newMapping)
    )).to.be.true;
  });

  it("Mappings client - Delete", async () => {
    const returns = {
      status: 204,
    };
    fetchStub.resolves(returns);
    const mapping = await mappingsClient.deleteMapping("auth", "mappingId");
    expect(mapping.status).to.be.eq(204);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId",
      "pass",
    )).to.be.true;
  });

});
