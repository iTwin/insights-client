/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised"
import { expect, use } from "chai";
import { MappingsClient, MappingCreate, GroupCreate, GroupPropertyCreate, CalculatedPropertyCreate, CustomCalculationCreate, MappingUpdate, ECProperty, GroupUpdate, CalculatedPropertyUpdate, CustomCalculationUpdate, GroupPropertyUpdate, MappingCopy, DataType, QuantityType, CalculatedPropertyType } from "../../reporting";
import "reflect-metadata";
import {accessToken, testIModel, testIModelGroup } from "../utils/";
use(chaiAsPromised);

describe("Mapping Client", () => {
  const mappingsClient: MappingsClient = new MappingsClient();

  const mappingIds: Array<string> = [];
  let groupId: string;
  let groupPropertyId: string;
  let calculatedPropertyId: string;
  let customCalculationId: string;

  before( async function () {
    //create mappings

    const newMapping: MappingCreate = {
      mappingName: "Test1"
    };
    let mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.not.be.undefined;
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test2";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.not.be.undefined;
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test3"
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.not.be.undefined;
    mappingIds.push(mapping.id);

    //create groups
    const newGroup: GroupCreate = {
      groupName: "Test1",
      query: "select * from biscore.element limit 10"
    }
    let group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.not.be.undefined;

    groupId = group.id;

    newGroup.groupName = "Test2";
    group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.not.be.undefined;

    newGroup.groupName = "Test3";
    group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.not.be.undefined;

    //create group properties
    const ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    const newProperty: GroupPropertyCreate = {
      propertyName: "prop1",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    let property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;
    groupPropertyId = property.id;

    newProperty.propertyName = "prop2";
    property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;

    newProperty.propertyName = "prop3";
    property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;
    //create calculated properties

    const newCalculatedProperty: CalculatedPropertyCreate = {
      propertyName: "calc1",
      type: CalculatedPropertyType.Length,
    };
    let calcProperty = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newCalculatedProperty);
    expect(calcProperty).to.not.be.undefined;
    calculatedPropertyId = calcProperty.id;

    newCalculatedProperty.propertyName = "calc2";
    calcProperty = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newCalculatedProperty);
    expect(calcProperty).to.not.be.undefined;
    
    newCalculatedProperty.propertyName = "calc3";
    calcProperty = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newCalculatedProperty);
    expect(calcProperty).to.not.be.undefined;

    //create customCalculations
    const newCustomCalculation: CustomCalculationCreate = {
      propertyName: "cust1",
      formula: "1+1",
      quantityType: QuantityType.Distance,
    };
    let custCalculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCustomCalculation);
    expect(custCalculation).to.not.be.undefined;
    customCalculationId = custCalculation.id;

    newCustomCalculation.propertyName = "cust2";
    custCalculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCustomCalculation);
    expect(custCalculation).to.not.be.undefined;

    newCustomCalculation.propertyName = "cust3";
    custCalculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCustomCalculation);
    expect(custCalculation).to.not.be.undefined;
  });

  after(async () => {
    let response: Response;
    while(mappingIds.length > 0) {
      response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop() ?? "");
    }
    await testIModelGroup.cleanupIModels();
  });

  //mapping tests
  it("General - get all with iterator", async function () {
    const iterator = mappingsClient.getMappingsIterator(accessToken, testIModel.id);
    for await(const mapping of iterator) {
      expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.not.be.undefined;
    }
  });

  it("General - fail request", async function () {
    await expect(mappingsClient.getMappings(accessToken, "-")).to.be.rejected;
  });

  it("Mappings - Create and delete", async function () {
    const newMapping: MappingCreate = {
      mappingName: "Test",
    }
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.not.be.undefined;

    const response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mapping.id);
    expect(response.status).to.be.eq(204);
  });

  it("Mappings - Update", async function () {
    const mappingUpdate: MappingUpdate = {
      description: "Updated description"
    }
    const mapping = await mappingsClient.updateMapping(accessToken, testIModel.id, mappingIds[0], mappingUpdate);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.not.be.undefined;
    expect(mapping.description).to.be.eq("Updated description");
  });

  it("Mappings - Copy", async function () {
    const mappingCopy: MappingCopy = {
      targetIModelId: testIModel.id,
      mappingName: "MappingCopy",
    };
    const mapping = await mappingsClient.copyMapping(accessToken, testIModel.id, mappingIds[0], mappingCopy);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.not.be.undefined;

    const response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mapping.id);
    expect(response.status).to.be.eq(204);
  });

  it("Mappings - Get", async function () {
    const mapping = await mappingsClient.getMapping(accessToken, testIModel.id, mappingIds[0]);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.not.be.undefined;
  });

  it("Mappings - Get all", async function () {
    const mappings = await mappingsClient.getMappings(accessToken, testIModel.id);
    expect(mappings).to.not.be.undefined;
    expect(mappings.length).to.be.above(2);
    expect(mappings[0].mappingName).to.not.be.undefined;
  });

  it("Mappings - Get all with top", async function () {
    const mappings = await mappingsClient.getMappings(accessToken, testIModel.id, 2);
    expect(mappings).to.not.be.undefined;
    expect(mappings.length).to.be.above(2);
    expect(mappings[0].mappingName).to.not.be.undefined;
  });

  it("Mappings - Get with iterator", async function () {
    const mappingsIt = mappingsClient.getMappingsIterator(accessToken, testIModel.id, 2);
    for await(const mapping of mappingsIt) {
      expect(mapping).to.not.be.undefined;
      expect(mapping.mappingName).to.not.be.undefined;
    }
  });

  it("Mappings - Get pages with iterator", async function () {
    const mappingsIt = mappingsClient.getMappingsIterator(accessToken, testIModel.id, 2);
    for await(const mappings of mappingsIt.byPage()) {
      expect(mappings).to.not.be.undefined;
      expect(mappings).to.not.be.empty;
      expect(mappings[0].mappingName).to.not.be.undefined;
    }
  });

  //group tests
  it("Groups - Create and delete", async function () {
    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "select * from biscore.element limit 10"
    }
    const group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.not.be.undefined;

    const response = await mappingsClient.deleteGroup(accessToken, testIModel.id, mappingIds[0], group.id);
    expect(response.status).to.be.eq(204);
  });

  it("Groups - Update", async function () {
    const groupUpdate: GroupUpdate = {
      description: "Updated description"
    }
    const group = await mappingsClient.updateGroup(accessToken, testIModel.id, mappingIds[0], groupId, groupUpdate);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.not.be.undefined;
    expect(group.description).to.be.eq("Updated description");
  });

  it("Groups - Get", async function () {
    const group = await mappingsClient.getGroup(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.not.be.undefined;
  });

  it("Groups - Get all", async function () {
    const groups = await mappingsClient.getGroups(accessToken, testIModel.id, mappingIds[0]);
    expect(groups).to.not.be.undefined;
    expect(groups.length).to.be.above(2);
    expect(groups[0].groupName).to.not.be.undefined;
  });

  it("Groups - Get all with top", async function () {
    const groups = await mappingsClient.getGroups(accessToken, testIModel.id, mappingIds[0], 2);
    expect(groups).to.not.be.undefined;
    expect(groups.length).to.be.above(2);
    expect(groups[0].groupName).to.not.be.undefined;
  });

  it("Groups - Get with iterator", async function () {
    const groupsIt = mappingsClient.getGroupsIterator(accessToken, testIModel.id, mappingIds[0], 2);
    for await(const group of groupsIt) {
      expect(group).to.not.be.undefined;
      expect(group.groupName).to.not.be.undefined;
    }
  });

  it("Groups - Get pages with iterator", async function () {
    const groupsIt = mappingsClient.getGroupsIterator(accessToken, testIModel.id, mappingIds[0], 2);
    for await(const groups of groupsIt.byPage()) {
      expect(groups).to.not.be.undefined;
      expect(groups).to.not.be.empty;
      expect(groups[0].groupName).to.not.be.undefined;
    }
  });

  //group properties tests
  it("Group properties - Create and delete", async function () {
    const ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    const newProperty: GroupPropertyCreate = {
      propertyName: "Test",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    const property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;
    
    const response = await mappingsClient.deleteGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, property.id);
    expect(response.status).to.be.eq(204);
  });

  it("Group properties - Update", async function () {
    const ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    const groupPropertyUpdate: GroupPropertyUpdate = {
      propertyName: "UpdatedGP",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    const property = await mappingsClient.updateGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, groupPropertyId, groupPropertyUpdate);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;
    expect(property.propertyName).to.be.eq("UpdatedGP");
  });

  it("Group properties - Get", async function () {
    const property = await mappingsClient.getGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, groupPropertyId);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;
  });

  it("Group properties - Get all", async function () {
    const properties = await mappingsClient.getGroupProperties(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
    expect(properties[0].propertyName).to.not.be.undefined;
  });

  it("Group properties - Get all with top", async function () {
    const properties = await mappingsClient.getGroupProperties(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
    expect(properties[0].propertyName).to.not.be.undefined;
  });

  it("Group properties - Get with iterator", async function () {
    const propertiesIt = mappingsClient.getGroupPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    for await(const property of propertiesIt) {
      expect(property).to.not.be.undefined;
      expect(property.propertyName).to.not.be.undefined;
    }
  });

  it("Group properties - Get pages with iterator", async function () {
    const propertiesIt = mappingsClient.getGroupPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    for await(const properties of propertiesIt.byPage()) {
      expect(properties).to.not.be.undefined;
      expect(properties).to.not.be.empty;
      expect(properties[0].propertyName).to.not.be.undefined;
    }
  });

  //calculated properties tests
  it("Calculated properties - Create and delete", async function () {
    const newProperty: CalculatedPropertyCreate = {
      propertyName: "Test",
      type: CalculatedPropertyType.Length,
    }
    const property = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;

    const response = await mappingsClient.deleteCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, property.id);
    expect(response.status).to.be.eq(204);
  });

  it("Calculated properties - Update", async function () {
    const calcPropertyUpdate: CalculatedPropertyUpdate = {
      propertyName: "UpdatedCP",
    };
    const property = await mappingsClient.updateCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, calculatedPropertyId, calcPropertyUpdate);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;
    expect(property.propertyName).to.be.eq("UpdatedCP");
  });

  it("Calculated properties - Get", async function () {
    const property = await mappingsClient.getCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, calculatedPropertyId);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.not.be.undefined;
  });

  it("Calculated properties - Get all", async function () {
    const properties = await mappingsClient.getCalculatedProperties(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
    expect(properties[0].propertyName).to.not.be.undefined;
  });

  it("Calculated properties - Get all with top", async function () {
    const properties = await mappingsClient.getCalculatedProperties(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
    expect(properties[0].propertyName).to.not.be.undefined;
  });

  it("Calculated properties - Get with iterator", async function () {
    const propertiesIt = mappingsClient.getCalculatedPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    for await(const property of propertiesIt) {
      expect(property).to.not.be.undefined;
      expect(property.propertyName).to.not.be.undefined;
    }
  });

  it("Calculated properties - Get pages with iterator", async function () {
    const propertiesIt = mappingsClient.getCalculatedPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    for await(const properties of propertiesIt.byPage()) {
      expect(properties).to.not.be.undefined;
      expect(properties).to.not.be.empty;
      expect(properties[0].propertyName).to.not.be.undefined;
    }
  });

  //custom calculations tests
  it("Custom calculations - Create and delete", async function () {
    const newCalculation: CustomCalculationCreate = {
      propertyName: "Test",
      formula: "1+1",
      quantityType: QuantityType.Distance
    }
    const calculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCalculation);
    expect(calculation).to.not.be.undefined;
    expect(calculation.propertyName).to.not.be.undefined;

    const response = await mappingsClient.deleteCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, calculation.id);
    expect(response.status).to.be.eq(204);
  });

  it("Custom calculations - Update", async function () {
    const custCalculationUpdate: CustomCalculationUpdate = {
      propertyName: "UpdatedCC",
    };
    const calculation = await mappingsClient.updateCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, customCalculationId, custCalculationUpdate);
    expect(calculation).to.not.be.undefined;
    expect(calculation.propertyName).to.not.be.undefined;
    expect(calculation.propertyName).to.be.eq("UpdatedCC");
  });

  it("Custom calculations - Get", async function () {
    const calculation = await mappingsClient.getCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, customCalculationId);
    expect(calculation).to.not.be.undefined;
    expect(calculation.propertyName).to.not.be.undefined;
  });

  it("Custom calculations - Get all with top", async function () {
    const calculations = await mappingsClient.getCustomCalculations(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(calculations).to.not.be.undefined;
    expect(calculations.length).to.be.above(2);
    expect(calculations[0].propertyName).to.not.be.undefined;
  });

  it("Custom calculations - Get all", async function () {
    const calculations = await mappingsClient.getCustomCalculations(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(calculations).to.not.be.undefined;
    expect(calculations.length).to.be.above(2);
    expect(calculations[0].propertyName).to.not.be.undefined;
  });

  it("Custom calculations - Get with iterator", async function () {
    const calculationsIt = mappingsClient.getCustomCalculationsIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    for await(const calculation of calculationsIt) {
      expect(calculation).to.not.be.undefined;
      expect(calculation.propertyName).to.not.be.undefined;
    }
  });

  it("Custom calculations - Get pages with iterator", async function () {
    const calculationsIt = mappingsClient.getCustomCalculationsIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    for await(const calculations of calculationsIt.byPage()) {
      expect(calculations).to.not.be.undefined;
      expect(calculations).to.not.be.empty;
      expect(calculations[0].propertyName).to.not.be.undefined;
    }
  });
});