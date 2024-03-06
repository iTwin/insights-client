/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { Group } from "../../../grouping-and-mapping/interfaces/Groups";
import { Mapping } from "../../../grouping-and-mapping/interfaces/Mappings";
import { accessToken, groupsClient, mappingsClientV2, propertiesClient, testIModel } from "../../utils";
import { CalculatedPropertyType, DataType, ECPropertyReference, Property, QuantityType } from "../../../grouping-and-mapping/interfaces/Properties";

describe("Properties Client", ()=> {
  let mappingOne: Mapping;
  let groupOne: Group;

  let propertyOne: Property;
  let propertyTwo: Property;
  let propertyThree: Property;
  let propertyFour: Property;

  before(async ()=> {
    mappingOne = await mappingsClientV2.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "MappingForGroups",
      description: "Mapping created for groups testing",
      extractionEnabled: true,
    });

    groupOne = await groupsClient.createGroup(accessToken, mappingOne.id, {
      groupName: "GroupOne",
      description: "Group number one",
      query: "SELECT * FROM bis.Element limit 10",
    });

    propertyOne = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyOne",
      dataType: DataType.Integer,
    });

    propertyTwo = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyTwo",
      dataType: DataType.String,
    });

    propertyThree = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyThree",
      dataType: DataType.Boolean,
    });

    propertyFour = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyFour",
      dataType: DataType.Double,
    });
  });

  after(async ()=> {
    await mappingsClientV2.deleteMapping(accessToken, mappingOne.id);
  });

  it("Properties - Get property", async ()=> {
    const retrievedProperty = await propertiesClient.getProperty(accessToken, mappingOne.id, groupOne.id, propertyOne.id);

    expect(retrievedProperty.id).to.deep.equal(propertyOne.id);
    expect(retrievedProperty.propertyName).to.deep.equal(propertyOne.propertyName);
  });

  it("Properties - Get all properties", async ()=> {
    const properties = await propertiesClient.getProperties(accessToken, mappingOne.id, groupOne.id);
    let flag = false;

    for(const property of properties.properties){
      flag = true;
      expect([
        propertyOne.propertyName,
        propertyTwo.propertyName,
        propertyThree.propertyName,
        propertyFour.propertyName,
      ]).to.include(property.propertyName);
    }

    expect(flag).to.be.true;
  });

  it("Properties - Get top properties", async ()=> {
    const topProperties = await propertiesClient.getProperties(accessToken, mappingOne.id, groupOne.id, 3);
    expect(topProperties.properties.length).to.be.equal(3);
    expect(topProperties._links.next).not.be.undefined;
  });

  it("Properties - Get pages of properties using iterator", async ()=> {
    const propertiesIterator = propertiesClient.getPropertiesIterator(accessToken, mappingOne.id, groupOne.id, 2);

    for await(const propertiesPage of propertiesIterator.byPage()){
      expect(propertiesPage.length).to.be.equal(2);
      for(const property of propertiesPage){
        expect([
          propertyOne.propertyName,
          propertyTwo.propertyName,
          propertyThree.propertyName,
          propertyFour.propertyName,
        ]).to.include(property.propertyName);
      }
    }
  });

  it("Properties - Create and Delete", async ()=> {
    const newProperty = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "newProperty",
      dataType: DataType.String,
    });

    expect(newProperty).not.be.undefined;
    expect(newProperty.propertyName).to.deep.equal("newProperty");

    const response = await propertiesClient.deleteProperty(accessToken, mappingOne.id, groupOne.id, newProperty.id);
    expect(response.status).to.be.deep.equal(204);
  });

  it("Properties - Create calculated property", async ()=> {
    const calculatedProperty = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "BeamVolume",
      dataType: DataType.Double,
      quantityType: QuantityType.Volume,
      ecProperties: [{
        ecSchemaName: "*",
        ecClassName: "*",
        ecPropertyName: "Volume",
      }],
      calculatedPropertyType: CalculatedPropertyType.Volume,
    });

    expect(calculatedProperty).not.be.undefined;
    expect(calculatedProperty.propertyName).to.be.equal("BeamVolume");
    expect(calculatedProperty.calculatedPropertyType).to.be.equal(CalculatedPropertyType.Volume);
  });

  it("Properties - Create custom calculation property", async ()=> {
    const customCalculationProperty = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "CustomPrice",
      dataType: DataType.Double,
      quantityType: QuantityType.Monetary,
      formula: "100 * 3.123",
    });

    expect(customCalculationProperty).not.be.undefined;
    expect(customCalculationProperty.propertyName).to.be.equal("CustomPrice");
    expect(customCalculationProperty.formula).to.be.equal("100 * 3.123");
  });

  it("Properties - Update", async ()=> {
    const ecProperty: ECPropertyReference = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecSchemaName: "schema",
    };

    const updatedProperty = await propertiesClient.updateProperty(accessToken, mappingOne.id, groupOne.id, propertyFour.id, {
      propertyName: "updatedPropertyFour",
      dataType: DataType.Integer,
      quantityType: QuantityType.Volume,
      ecProperties:[ecProperty],
    });

    expect(updatedProperty.id).to.not.be.undefined;
    expect(updatedProperty.id).to.deep.equal(propertyFour.id);
    expect(updatedProperty.dataType).to.deep.equal(DataType.Integer);
    expect(updatedProperty.quantityType).to.deep.equal(QuantityType.Volume);
    expect(updatedProperty.propertyName).to.deep.equal("updatedPropertyFour");
  });
});
