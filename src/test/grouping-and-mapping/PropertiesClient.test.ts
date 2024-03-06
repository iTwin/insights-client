/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import { PropertiesClient } from "../../grouping-and-mapping/clients/PropertiesClient";
import { CalculatedPropertyType, DataType, ECPropertyReference, PropertyContainer, PropertyList, PropertyModify, QuantityType } from "../../grouping-and-mapping/interfaces/Properties";
import { expect } from "chai";
import * as sinon from "sinon";

describe("Properties Client Unit tests", ()=> {
  const propertiesClient: PropertiesClient = new PropertiesClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(propertiesClient, "fetchJSON" as any);
    requestStub = sinon.stub(propertiesClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Properties client - Create property", async ()=> {
    const newProperty: PropertyModify = {
      propertyName: "BeamVolume",
      dataType: DataType.Double,
      quantityType: QuantityType.Volume,
      calculatedPropertyType: CalculatedPropertyType.Volume,
    };

    const returns: PropertyContainer = {
      property: {
        id: "1",
        propertyName: "BeamVolume",
        dataType: DataType.Double,
        quantityType: "Volume",
        calculatedPropertyType: CalculatedPropertyType.Volume,
        _links: {
          iModel: {
            href: "https://api.bentley.com/imodels/iModelid",
          },
          mapping: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId",
          },
          group: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const property = await propertiesClient.createProperty("authToken", "mappingId", "groupId", newProperty);

    expect(property.id).to.deep.equal("1");
    expect(property.propertyName).to.deep.equal(returns.property.propertyName);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId/properties",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "authToken",
      JSON.stringify(newProperty)
    )).to.be.true;
  });

  it("Properties client - Delete property", async ()=> {
    const returns = {
      status: 204,
    };
    fetchStub.resolves(returns);

    const response = await propertiesClient.deleteProperty("authToken", "mappingId", "groupId", "1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId/properties/1",
      "pass",
    )).to.be.true;
    expect(response.status).to.be.eq(204);
  });

  it("Properties client - Get property", async ()=> {
    const returns: PropertyContainer = {
      property: {
        id: "1",
        propertyName: "BeamVolume",
        dataType: DataType.Double,
        quantityType: "Volume",
        ecProperties: [{
          ecSchemaName: "*",
          ecClassName: "*",
          ecPropertyName: "Volume",
        }],
        calculatedPropertyType: CalculatedPropertyType.Volume,
        formula: "Length * CrossSectionArea",
        _links: {
          iModel: {
            href: "https://api.bentley.com/imodels/iModelid",
          },
          mapping: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId",
          },
          group: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const property = await propertiesClient.getProperty("authToken", "mappingId", "groupId", "1");
    expect(property.id).to.equal("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId/properties/1",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken"
    )).to.be.true;
  });

  it("Properties client - Get properties", async ()=> {
    const returns: PropertyList = {
      properties: [{
        id: "1",
        propertyName: "BeamVolume",
        dataType: DataType.Double,
        quantityType: "Volume",
        ecProperties: [{
          ecSchemaName: "*",
          ecClassName: "*",
          ecPropertyName: "Volume",
        }],
        calculatedPropertyType: CalculatedPropertyType.Volume,
        formula: "Length * CrossSectionArea",
        _links: {
          iModel: {
            href: "https://api.bentley.com/imodels/iModelid",
          },
          mapping: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId",
          },
          group: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId",
          },
        },
      }],
      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId/properties",
        },
      },
    };
    fetchStub.resolves(returns);

    const properties = await propertiesClient.getProperties("authToken", "mappingId", "groupId");
    expect(properties.properties.length).to.be.equal(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId/properties",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken"
    )).to.be.true;
  });

  it("Properties client - Update property", async ()=> {
    const ecProperty: ECPropertyReference = {
      ecSchemaName: "*",
      ecClassName: "*",
      ecPropertyName: "Volume",
    };
    const updateProperty: PropertyModify = {
      propertyName: "BeamVolume",
      dataType: DataType.Double,
      quantityType: QuantityType.Volume,
      ecProperties: [ecProperty],
      calculatedPropertyType: CalculatedPropertyType.Volume,
      formula: "Length * CrossSectionArea",
    };

    const returns: PropertyContainer = {
      property: {
        id: "1",
        propertyName: "BeamVolume",
        dataType: DataType.Double,
        quantityType: "Volume",
        calculatedPropertyType: CalculatedPropertyType.Volume,
        ecProperties:[{
          ecSchemaName: "*",
          ecClassName: "*",
          ecPropertyName: "Volume",
        }],
        formula: "Length * CrossSectionArea",
        _links: {
          iModel: {
            href: "https://api.bentley.com/imodels/iModelid",
          },
          mapping: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId",
          },
          group: {
            href: "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const updatedProperty = await propertiesClient.updateProperty("authToken", "mappingId", "groupId", "1", updateProperty);
    expect(updatedProperty.id).to.equal("1");
    expect(updatedProperty.formula).to.deep.equal("Length * CrossSectionArea");
    expect(updatedProperty.ecProperties?.length).to.equal(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/datasources/imodel-mappings/mappingId/groups/groupId/properties/1",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PUT",
      "authToken"
    )).to.be.true;

  });
});

