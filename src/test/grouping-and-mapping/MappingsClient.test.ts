/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { MappingsClient } from "../../grouping-and-mapping/clients/MappingsClient";
import { MappingContainer, MappingCreate, MappingExtractionCollection, MappingList, MappingUpdate } from "../../grouping-and-mapping/interfaces/Mappings";
import * as sinon from "sinon";

describe("Mappings Client Unit tests", ()=> {
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
    const mapping = await mappingsClient.createMapping("authToken", newMapping);

    expect(mapping.id).to.be.deep.equal("1");
    expect(mapping.mappingName).to.be.deep.equal("MappingTest");
    expect(mapping._links.iModel.href).to.deep.equal("https://api.bentley.com/imodels/iModelIdTest");

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings",
      "pass",
    )).to.be.true;

    expect(requestStub.calledWith(
      "POST",
      "authToken",
      JSON.stringify(newMapping),
    )).to.be.true;

  });

  it("Mappings client - Delete", async () => {
    const returns = {
      status: 204,
    };
    fetchStub.resolves(returns);
    const mapping = await mappingsClient.deleteMapping("authToken", "mappingId");

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId",
      "pass",
    )).to.be.true;

    expect(mapping.status).to.be.eq(204);
  });

  it("Mappings client - Get mapping", async () => {
    const getResponse: MappingContainer = {
      mapping: {
        id: "1",
        mappingName: "MappingGet",
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

    fetchStub.resolves(getResponse);
    const mapping = await mappingsClient.getMapping("authToken", "1");

    expect(mapping.id).to.be.eq("1");
    expect(mapping.mappingName).to.be.deep.equal("MappingGet");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/1",
      "pass",
    )).to.be.true;
  });

  it("Mappings client - Get all mappings", async ()=> {
    const mappingListResponse: MappingList = {
      mappings: [{
        id: "1",
        mappingName: "MappingOne",
        description: "Mapping one",
        extractionEnabled: true,
        createdOn: "2021-09-03T10:48:45+00:00",
        createdBy: "john.doe@example.com",
        modifiedOn: "2022-01-10T13:44:56+00:00",
        modifiedBy: "john.doe@example.com",
        _links: {
          iModel: {
            href: "https://api.bentley.com/imodels/iModelIdTest",
          },
        },
      },
      {
        id: "2",
        mappingName: "MappingTwo",
        description: "Mapping two",
        extractionEnabled: true,
        createdOn: "2021-09-03T10:48:45+00:00",
        createdBy: "john.doe@example.com",
        modifiedOn: "2022-01-10T13:44:56+00:00",
        modifiedBy: "john.doe@example.com",
        _links: {
          iModel: {
            href: "https://api.bentley.com/imodels/iModelIdTest",
          },
        },
      }],

      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings?iModelId=iModelIdTest",
        },
      },
    };
    fetchStub.resolves(mappingListResponse);

    const mappingList = await mappingsClient.getMappings("authToken", "iModelIdTest");

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings?iModelId=iModelIdTest",
      "pass",
    )).to.be.true;

    expect(mappingList.mappings.length).to.be.equal(2);
    expect(mappingList.mappings[0].mappingName).to.deep.equal("MappingOne");
    expect(mappingList.mappings[1].mappingName).to.deep.equal("MappingTwo");
    expect(mappingList._links.next).to.be.undefined;
  });

  it("Mappings client - Update", ()=> {
    it("Mappings - Update", async () => {
      const newMapping: MappingUpdate = {
        mappingName: "mappingUpdate",
        description: "Updated mapping",
      };
      const returns: MappingContainer = {
        mapping: {
          id: "1",
          mappingName: "mappingUpdate",
          description: "Updated mapping",
          extractionEnabled: false,
          createdOn: "2021-09-03T10:48:45+00:00",
          createdBy: "john.doe@example.com",
          modifiedOn: "2022-01-10T13:44:56+00:00",
          modifiedBy: "john.doe@example.com",
          _links: {
            iModel: {
              href: "https://api.bentley.com/imodels/iModelIdTest",
            },
          },
        },
      };
      fetchStub.resolves(returns);
      const mapping = await mappingsClient.updateMapping("authToken", "1", newMapping);

      expect(fetchStub.calledWith(
        "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/1",
        "pass",
      )).to.be.true;

      expect(requestStub.calledWith(
        "PATCH",
        "authToken",
        JSON.stringify(newMapping),
      )).to.be.true;

      expect(mapping.id).to.be.eq("1");
      expect(mapping.mappingName).to.be.equal(returns.mapping.mappingName);
      expect(mapping.description).to.be.equal(returns.mapping.description);
    });
  });

  it("Mappings Client - Get mapping extractions", async ()=> {
    const returns: MappingExtractionCollection = {
      extractions: [{
        extractionId: "someExtractionId",
        extractionTimestamp: "2023-01-10T13:44:56+00:00",
        changesetIndex: 5,
        mappingTimestamp: "2022-01-10T13:44:56+00:00",
        _links: {
          cdm: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/extractions/someExtractionId/cdm",
          },
        },
      }],
      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/extractions?$top=10",
        },
      },
    };
    fetchStub.resolves(returns);

    const mappingExtractions = await mappingsClient.getMappingExtractions("authToken", "mappingId", 10);

    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/extractions?$top=10",
      "pass",
    )).to.be.true;

    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;

    expect(mappingExtractions.extractions.length).to.be.equal(1);
    expect(mappingExtractions.extractions[0].extractionId).to.deep.equal("someExtractionId");
    expect(mappingExtractions._links.next).to.be.undefined;
  });
});
