/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { CalculatedPropertyCreate, CalculatedPropertyType, CalculatedPropertyUpdate, CustomCalculationCreate, CustomCalculationUpdate, DataType, ECProperty, GroupCreate, GroupPropertyCreate, GroupPropertyUpdate, GroupUpdate, MappingCopy, MappingCreate, MappingUpdate, QuantityType } from "../../reporting";
import "reflect-metadata";
import { accessToken, mappingsClient, testIModel } from "../utils/";
use(chaiAsPromised);

describe("Mapping Client", () => {
  const mappingIds: Array<string> = [];
  let groupId: string;
  let groupPropertyId: string;
  let calculatedPropertyId: string;
  let customCalculationId: string;

  before(async () => {
    // create mappings
    const newMapping: MappingCreate = {
      mappingName: "Test1",
    };
    let mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test2";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test3";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);

    // create groups
    const newGroup: GroupCreate = {
      groupName: "Test1",
      query: "select * from biscore.element limit 10",
    };
    let group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    groupId = group.id;

    newGroup.groupName = "Test2";
    group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);

    newGroup.groupName = "Test3";
    group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);

    // create group properties
    const ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    const newProperty: GroupPropertyCreate = {
      propertyName: "Prop1",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    let property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    groupPropertyId = property.id;

    newProperty.propertyName = "Prop2";
    property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);

    newProperty.propertyName = "Prop3";
    property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);

    // create calculated properties
    const newCalculatedProperty: CalculatedPropertyCreate = {
      propertyName: "Calc1",
      type: CalculatedPropertyType.Length,
    };
    let calcProperty = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newCalculatedProperty);
    calculatedPropertyId = calcProperty.id;

    newCalculatedProperty.propertyName = "Calc2";
    calcProperty = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newCalculatedProperty);

    newCalculatedProperty.propertyName = "Calc3";
    calcProperty = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newCalculatedProperty);

    // create customCalculations
    const newCustomCalculation: CustomCalculationCreate = {
      propertyName: "Cust1",
      formula: "1+1",
      quantityType: QuantityType.Distance,
    };
    let custCalculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCustomCalculation);
    customCalculationId = custCalculation.id;

    newCustomCalculation.propertyName = "Cust2";
    custCalculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCustomCalculation);

    newCustomCalculation.propertyName = "Cust3";
    custCalculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCustomCalculation);
  });

  after(async () => {
    while(mappingIds.length > 0) {
      await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop()!);
    }
  });

  // mapping tests
  it("Mappings - fail request", async () => {
    await expect(mappingsClient.getMappings(accessToken, "-")).to.be.rejected;
  });

  it("Mappings - Create and delete", async () => {
    const newMapping: MappingCreate = {
      mappingName: "Test",
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.be.eq("Test");

    const response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mapping.id);
    expect(response.status).to.be.eq(204);
  });

  it("Mappings - Update", async () => {
    const mappingUpdate: MappingUpdate = {
      description: "Updated description",
    };
    const mapping = await mappingsClient.updateMapping(accessToken, testIModel.id, mappingIds[0], mappingUpdate);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.be.eq("Test1");
    expect(mapping.description).to.be.eq("Updated description");
  });

  it("Mappings - Copy", async () => {
    const mappingCopy: MappingCopy = {
      targetIModelId: testIModel.id,
      mappingName: "MappingCopy",
    };
    const mapping = await mappingsClient.copyMapping(accessToken, testIModel.id, mappingIds[0], mappingCopy);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.be.eq("MappingCopy");

    const response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mapping.id);
    expect(response.status).to.be.eq(204);
  });

  it("Mappings - Get", async () => {
    const mapping = await mappingsClient.getMapping(accessToken, testIModel.id, mappingIds[0]);
    expect(mapping).to.not.be.undefined;
    expect(mapping.mappingName).to.be.eq("Test1");
  });

  it("Mappings - Get all", async () => {
    const mappings = await mappingsClient.getMappings(accessToken, testIModel.id);
    expect(mappings).to.not.be.undefined;
    expect(mappings.length).to.be.above(2);
    for(const mapping of mappings) {
      expect(["Test1", "Test2", "Test3"]).to.include(mapping.mappingName);
    }
  });

  it("Mappings - Get all with top", async () => {
    const mappings = await mappingsClient.getMappings(accessToken, testIModel.id, 2);
    expect(mappings).to.not.be.undefined;
    expect(mappings.length).to.be.above(2);
    for(const mapping of mappings) {
      expect(["Test1", "Test2", "Test3"]).to.include(mapping.mappingName);
    }
  });

  it("Mappings - Get with iterator", async () => {
    const mappingsIt = mappingsClient.getMappingsIterator(accessToken, testIModel.id, 2);
    let flag = false;
    for await(const mapping of mappingsIt) {
      flag = true;
      expect(mapping).to.not.be.undefined;
      expect(["Test1", "Test2", "Test3"]).to.include(mapping.mappingName);
    }
    expect(flag).to.be.true;
  });

  it("Mappings - Get pages with iterator", async () => {
    const mappingsIt = mappingsClient.getMappingsIterator(accessToken, testIModel.id, 2);
    let elementCount = 0;
    let flag = false;
    for await(const mappings of mappingsIt.byPage()) {
      flag = true;
      expect(mappings).to.not.be.undefined;
      if(mappings.length) {
        for(const mapping of mappings) {
          expect(["Test1", "Test2", "Test3"]).to.include(mapping.mappingName);
        }
        elementCount += mappings.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // group tests
  it("Groups - Create and delete", async () => {
    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "select * from biscore.element limit 10",
    };
    const group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.be.eq("Test");

    const response = await mappingsClient.deleteGroup(accessToken, testIModel.id, mappingIds[0], group.id);
    expect(response.status).to.be.eq(204);
  });

  it("Groups - Update", async () => {
    const groupUpdate: GroupUpdate = {
      description: "Updated description",
    };
    const group = await mappingsClient.updateGroup(accessToken, testIModel.id, mappingIds[0], groupId, groupUpdate);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.be.eq("Test1");
    expect(group.description).to.be.eq("Updated description");
  });

  it("Groups - Get", async () => {
    const group = await mappingsClient.getGroup(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(group).to.not.be.undefined;
    expect(group.groupName).to.be.eq("Test1");
  });

  it("Groups - Get all", async () => {
    const groups = await mappingsClient.getGroups(accessToken, testIModel.id, mappingIds[0]);
    expect(groups).to.not.be.undefined;
    expect(groups.length).to.be.above(2);
    for(const group of groups) {
      expect(["Test1", "Test2", "Test3"]).to.include(group.groupName);
    }
  });

  it("Groups - Get all with top", async () => {
    const groups = await mappingsClient.getGroups(accessToken, testIModel.id, mappingIds[0], 2);
    expect(groups).to.not.be.undefined;
    expect(groups.length).to.be.above(2);
    for(const group of groups) {
      expect(["Test1", "Test2", "Test3"]).to.include(group.groupName);
    }
  });

  it("Groups - Get with iterator", async () => {
    const groupsIt = mappingsClient.getGroupsIterator(accessToken, testIModel.id, mappingIds[0], 2);
    let flag = false;
    for await(const group of groupsIt) {
      flag = true;
      expect(group).to.not.be.undefined;
      expect(["Test1", "Test2", "Test3"]).to.include(group.groupName);
    }
    expect(flag).to.be.true;
  });

  it("Groups - Get pages with iterator", async () => {
    const groupsIt = mappingsClient.getGroupsIterator(accessToken, testIModel.id, mappingIds[0], 2);
    let elementCount = 0;
    let flag = false;
    for await(const groups of groupsIt.byPage()) {
      flag = true;
      expect(groups).to.not.be.undefined;
      if(groups.length) {
        for(const group of groups) {
          expect(["Test1", "Test2", "Test3"]).to.include(group.groupName);
        }
        elementCount += groups.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // group properties tests
  it("Group properties - Create and delete", async () => {
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
    expect(property.propertyName).to.be.eq("Test");
    expect(property.dataType).to.be.eq(DataType.Number);
    expect(property.quantityType).to.be.eq(QuantityType.Distance);
    expect(property.ecProperties[0].ecPropertyType).to.be.eq(DataType.String);

    const response = await mappingsClient.deleteGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, property.id);
    expect(response.status).to.be.eq(204);
  });

  it("Group properties - Update", async () => {
    const ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    const groupPropertyUpdate: GroupPropertyUpdate = {
      propertyName: "Prop1",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    const property = await mappingsClient.updateGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, groupPropertyId, groupPropertyUpdate);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.be.eq("Prop1");
    expect(property.dataType).to.be.eq(DataType.Number);
    expect(property.quantityType).to.be.eq(QuantityType.Distance);
    expect(property.ecProperties[0].ecPropertyType).to.be.eq(DataType.String);
  });

  it("Group properties - Get", async () => {
    const property = await mappingsClient.getGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, groupPropertyId);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.be.eq("Prop1");
  });

  it("Group properties - Get all", async () => {
    const properties = await mappingsClient.getGroupProperties(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
    for(const property of properties) {
      expect(["Prop1", "Prop2", "Prop3"]).to.include(property.propertyName);
    }
  });

  it("Group properties - Get all with top", async () => {
    const properties = await mappingsClient.getGroupProperties(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
    for(const property of properties) {
      expect(["Prop1", "Prop2", "Prop3"]).to.include(property.propertyName);
    }
  });

  it("Group properties - Get with iterator", async () => {
    const propertiesIt = mappingsClient.getGroupPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let flag = false;
    for await(const property of propertiesIt) {
      flag = true;
      expect(property).to.not.be.undefined;
      expect(["Prop1", "Prop2", "Prop3"]).to.include(property.propertyName);
    }
    expect(flag).to.be.true;
  });

  it("Group properties - Get pages with iterator", async () => {
    const propertiesIt = mappingsClient.getGroupPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let elementCount = 0;
    let flag = false;
    for await(const properties of propertiesIt.byPage()) {
      flag = true;
      expect(properties).to.not.be.undefined;
      if(properties.length) {
        for(const property of properties) {
          expect(["Prop1", "Prop2", "Prop3"]).to.include(property.propertyName);
        }
        elementCount += properties.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // calculated properties tests
  it("Calculated properties - Create and delete", async () => {
    const newProperty: CalculatedPropertyCreate = {
      propertyName: "Test",
      type: CalculatedPropertyType.Length,
    };
    const property = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.be.eq("Test");
    expect(property.type).to.be.eq(CalculatedPropertyType.Length);

    const response = await mappingsClient.deleteCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, property.id);
    expect(response.status).to.be.eq(204);
  });

  it("Calculated properties - Update", async () => {
    const calcPropertyUpdate: CalculatedPropertyUpdate = {
      type: CalculatedPropertyType.BoundingBoxDiagonalLength,
    };
    const property = await mappingsClient.updateCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, calculatedPropertyId, calcPropertyUpdate);
    expect(property).to.not.be.undefined;
    expect(property.type).to.be.eq(CalculatedPropertyType.BoundingBoxDiagonalLength);
  });

  it("Calculated properties - Get", async () => {
    const property = await mappingsClient.getCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, calculatedPropertyId);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.be.eq("Calc1");
  });

  it("Calculated properties - Get all", async () => {
    const properties = await mappingsClient.getCalculatedProperties(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
    for(const property of properties) {
      expect(["Calc1", "Calc2", "Calc3"]).to.include(property.propertyName);
    }
  });

  it("Calculated properties - Get all with top", async () => {
    const properties = await mappingsClient.getCalculatedProperties(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
    for(const property of properties) {
      expect(["Calc1", "Calc2", "Calc3"]).to.include(property.propertyName);
    }
  });

  it("Calculated properties - Get with iterator", async () => {
    const propertiesIt = mappingsClient.getCalculatedPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let flag = false;
    for await(const property of propertiesIt) {
      flag = true;
      expect(property).to.not.be.undefined;
      expect(["Calc1", "Calc2", "Calc3"]).to.include(property.propertyName);
    }
    expect(flag).to.be.true;
  });

  it("Calculated properties - Get pages with iterator", async () => {
    const propertiesIt = mappingsClient.getCalculatedPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let elementCount = 0;
    let flag = false;
    for await(const properties of propertiesIt.byPage()) {
      flag = true;
      expect(properties).to.not.be.undefined;
      if(properties.length) {
        for(const property of properties) {
          expect(["Calc1", "Calc2", "Calc3"]).to.include(property.propertyName);
        }
        elementCount += properties.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // custom calculations tests
  it("Custom calculations - Create and delete", async () => {
    const newCalculation: CustomCalculationCreate = {
      propertyName: "Test",
      formula: "1+1",
      quantityType: QuantityType.Distance,
    };
    const calculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCalculation);
    expect(calculation).to.not.be.undefined;
    expect(calculation.propertyName).to.be.eq("Test");
    expect(calculation.quantityType).to.be.eq(QuantityType.Distance);

    const response = await mappingsClient.deleteCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, calculation.id);
    expect(response.status).to.be.eq(204);
  });

  it("Custom calculations - Update", async () => {
    const custCalculationUpdate: CustomCalculationUpdate = {
      formula: "0+0",
    };
    const calculation = await mappingsClient.updateCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, customCalculationId, custCalculationUpdate);
    expect(calculation).to.not.be.undefined;
    expect(calculation.propertyName).to.be.eq("Cust1");
    expect(calculation.formula).to.be.eq("0+0");
  });

  it("Custom calculations - Get", async () => {
    const calculation = await mappingsClient.getCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, customCalculationId);
    expect(calculation).to.not.be.undefined;
    expect(calculation.propertyName).to.be.eq("Cust1");
  });

  it("Custom calculations - Get all with top", async () => {
    const calculations = await mappingsClient.getCustomCalculations(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(calculations).to.not.be.undefined;
    expect(calculations.length).to.be.above(2);
    for(const property of calculations) {
      expect(["Cust1", "Cust2", "Cust3"]).to.include(property.propertyName);
    }
  });

  it("Custom calculations - Get all", async () => {
    const calculations = await mappingsClient.getCustomCalculations(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(calculations).to.not.be.undefined;
    expect(calculations.length).to.be.above(2);
    for(const property of calculations) {
      expect(["Cust1", "Cust2", "Cust3"]).to.include(property.propertyName);
    }
  });

  it("Custom calculations - Get with iterator", async () => {
    const calculationsIt = mappingsClient.getCustomCalculationsIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let flag = false;
    for await(const calculation of calculationsIt) {
      flag = true;
      expect(["Cust1", "Cust2", "Cust3"]).to.include(calculation.propertyName);
    }
    expect(flag).to.be.true;
  });

  it("Custom calculations - Get pages with iterator", async () => {
    const calculationsIt = mappingsClient.getCustomCalculationsIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let elementCount = 0;
    let flag = false;
    for await(const calculations of calculationsIt.byPage()) {
      flag = true;
      expect(calculations).to.not.be.undefined;
      if(calculations.length) {
        for(const property of calculations) {
          expect(["Cust1", "Cust2", "Cust3"]).to.include(property.propertyName);
        }
        elementCount += calculations.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });
});
