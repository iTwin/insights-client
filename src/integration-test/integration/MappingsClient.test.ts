/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai').use(require('chai-as-promised'))
import { expect } from "chai";
import { MappingsClient, MappingCreate, GroupCreate, GroupPropertyCreate, CalculatedPropertyCreate, CustomCalculationCreate, MappingUpdate, ECProperty, GroupUpdate, CalculatedPropertyUpdate, CustomCalculationUpdate, GroupPropertyUpdate, MappingCopy, DataType, QuantityType, CalculatedPropertyType, Mapping } from "../../reporting";
import "reflect-metadata";
import { getTestRunId, Constants, getTestDIContainer } from "../utils/index";
import { IModelsClient, IModelsClientOptions } from "../imodels-client-authoring/src/IModelsClient";
import { AuthorizationCallback, EntityListIterator } from "../imodels-client-management/src/IModelsClientExports";
import { TestUtilTypes, TestIModelGroup, TestIModelGroupFactory, IModelMetadata, TestIModelFileProvider, TestAuthorizationProvider, TestIModelCreator, ReusableTestIModelProvider } from "../imodels-client-test-utils/src/iModelsClientTestUtilsExports";

chai.should();
describe("Mapping Client", () => {
  const mappingsClient: MappingsClient = new MappingsClient();
  let accessToken: string;

  let mappingIds: Array<string> = [];
  let groupId: string;
  let groupPropertyId: string;
  let calculatedPropertyId: string;
  let customCalculationId: string;

  let iModelsClient: IModelsClient;
  let authorization: AuthorizationCallback;
  let testIModelGroup: TestIModelGroup;
  let testIModel: IModelMetadata;
  let testIModelFileProvider: TestIModelFileProvider;

  before( async function () {
    this.timeout(0);

    const container = getTestDIContainer();

    const iModelsClientOptions = container.get<IModelsClientOptions>(TestUtilTypes.IModelsClientOptions);
    iModelsClient = new IModelsClient(iModelsClientOptions);
    
    const authorizationProvider = container.get(TestAuthorizationProvider);
    authorization = authorizationProvider.getAdmin1Authorization();
    accessToken = "Bearer " + (await authorization()).token;

    testIModelFileProvider = container.get(TestIModelFileProvider);

    const testIModelGroupFactory = container.get(TestIModelGroupFactory);
    testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: Constants.PackagePrefix, testSuiteName: "ManagementNamedVersionOperations" });

    const testIModelCreator = container.get(TestIModelCreator);
    testIModel = await testIModelCreator.createEmptyAndUploadChangesets(testIModelGroup.getPrefixedUniqueIModelName("Test iModel for write"));

    const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
    testIModel = await reusableTestIModelProvider.getOrCreate();

    //create mappings

    let newMapping: MappingCreate = {
      mappingName: "Test1"
    };
    let mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test2";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test3"
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;
    mappingIds.push(mapping.id);

    //create groups

    let newGroup: GroupCreate = {
      groupName: "Test1",
      query: "select * from biscore.element"
    }
    let group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;
    groupId = group.id;

    newGroup.groupName = "Test2";
    group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;

    newGroup.groupName = "Test3";
    group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;

    //create group properties

    let ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    let newProperty: GroupPropertyCreate = {
      propertyName: "prop1",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: new Array(ecProperty),
    };
    let property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;
    groupPropertyId = property.id;

    newProperty.propertyName = "prop2";
    property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;

    newProperty.propertyName = "prop3";
    property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;

    //create calculated properties

    let newCalculatedProperty: CalculatedPropertyCreate = {
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

    let newCustomCalculation: CustomCalculationCreate = {
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
      expect(response.status).to.be.equals(204);
    }
    await testIModelGroup.cleanupIModels();
  });

  //mapping tests
  it("General - get all with iterator", async function () {
    let iterator = mappingsClient.getMappingsIterator(accessToken, testIModel.id);
    let mapping = await iterator.next();
    do {
      expect(mapping.value).to.not.be.undefined;
      mapping = await iterator.next();
    } while(!mapping.done);
  });

  it("General - fail request", async function () {
    await expect(mappingsClient.getMappings(accessToken, "-")).to.be.rejected;
  });

  it("Mappings - Create and delete", async function () {
    let newMapping: MappingCreate = {
      mappingName: "Test",
    }
    let mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    expect(mapping).to.not.be.undefined;

    let response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mapping.id);
    expect(response.status).to.be.equals(204);
  });

  it("Mappings - Update", async function () {
    const mappingUpdate: MappingUpdate = {
      description: "Updated description"
    }
    let mapping = await mappingsClient.updateMapping(accessToken, testIModel.id, mappingIds[0], mappingUpdate);
    expect(mapping).to.not.be.undefined;
  });

  it("Mappings - Copy", async function () {
    const mappingCopy: MappingCopy = {
      targetIModelId: testIModel.id,
      mappingName: "MappingCopy",
    };
    let mapping = await mappingsClient.copyMapping(accessToken, testIModel.id, mappingIds[0], mappingCopy);
    expect(mapping).to.not.be.undefined;

    let response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mapping.id);
    expect(response.status).to.be.equals(204);
  });

  it("Mappings - Get", async function () {
    let mapping = await mappingsClient.getMapping(accessToken, testIModel.id, mappingIds[0]);
    expect(mapping).to.not.be.undefined;
  });

  it("Mappings - Get all", async function () {
    let mappings = await mappingsClient.getMappings(accessToken, testIModel.id);
    expect(mappings).to.not.be.undefined;
    expect(mappings.length).to.be.above(2);
  });

  it("Mappings - Get all with top", async function () {
    let mappings = await mappingsClient.getMappings(accessToken, testIModel.id, 2);
    expect(mappings).to.not.be.undefined;
    expect(mappings.length).to.be.above(2);
  });

  it("Mappings - Get 3 with iterator", async function () {
    let mappingsIt = mappingsClient.getMappingsIterator(accessToken, testIModel.id, 2);
    let mapping = (await mappingsIt.next()).value;
    expect(mapping).to.not.be.undefined;
    mapping = (await mappingsIt.next()).value;
    expect(mapping).to.not.be.undefined;
    mapping = (await mappingsIt.next()).value;
    expect(mapping).to.not.be.undefined;
  });

  it("Mappings - Get 2 pages with iterator", async function () {
    let mappingsIt = mappingsClient.getMappingsIterator(accessToken, testIModel.id, 2);
    let mappings = (await mappingsIt.byPage().next()).value;
    expect(mappings).to.not.be.undefined;
    expect(mappings.length).to.be.equals(2);
    mappings = (await mappingsIt.byPage().next()).value;
    expect(mappings).to.not.be.undefined;
    expect(mappings.length).to.be.above(0);
  });

  //group tests
  it("Groups - Create and delete", async function () {
    let newGroup: GroupCreate = {
      groupName: "Test",
      query: "select * from biscore.element"
    }
    let group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingIds[0], newGroup);
    expect(group).to.not.be.undefined;

    let response = await mappingsClient.deleteGroup(accessToken, testIModel.id, mappingIds[0], group.id);
    expect(response.status).to.be.equals(204);
  });

  it("Groups - Update", async function () {
    const groupUpdate: GroupUpdate = {
      description: "Updated description"
    }
    let group = await mappingsClient.updateGroup(accessToken, testIModel.id, mappingIds[0], groupId, groupUpdate);
    expect(group).to.not.be.undefined;
  });

  it("Groups - Get", async function () {
    let group = await mappingsClient.getGroup(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(group).to.not.be.undefined;
  });

  it("Groups - Get all", async function () {
    let groups = await mappingsClient.getGroups(accessToken, testIModel.id, mappingIds[0]);
    expect(groups).to.not.be.undefined;
    expect(groups.length).to.be.above(2);
  });

  it("Groups - Get all with top", async function () {
    let groups = await mappingsClient.getGroups(accessToken, testIModel.id, mappingIds[0], 2);
    expect(groups).to.not.be.undefined;
    expect(groups.length).to.be.above(2);
  });

  it("Groups - Get 3 with iterator", async function () {
    let groupsIt = mappingsClient.getGroupsIterator(accessToken, testIModel.id, mappingIds[0], 2);
    let group = (await groupsIt.next()).value;
    expect(group).to.not.be.undefined;
    group = (await groupsIt.next()).value;
    expect(group).to.not.be.undefined;
    group = (await groupsIt.next()).value;
    expect(group).to.not.be.undefined;
  });

  it("Groups - Get 2 pages with iterator", async function () {
    let groupsIt = mappingsClient.getGroupsIterator(accessToken, testIModel.id, mappingIds[0], 2);
    let groups = (await groupsIt.byPage().next()).value;
    expect(groups).to.not.be.undefined;
    expect(groups.length).to.be.equals(2);
    groups = (await groupsIt.byPage().next()).value;
    expect(groups).to.not.be.undefined;
    expect(groups.length).to.be.above(0);
  });

  //group properties tests
  it("Group properties - Create and delete", async function () {
    let ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    let newProperty: GroupPropertyCreate = {
      propertyName: "Test",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: new Array(ecProperty),
    };
    let property = await mappingsClient.createGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;

    let response = await mappingsClient.deleteGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, property.id);
    expect(response.status).to.be.equals(204);
  });

  it("Group properties - Update", async function () {
    let ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    const groupPropertyUpdate: GroupPropertyUpdate = {
      propertyName: "UpdatedGP",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: new Array(ecProperty),
    };
    let property = await mappingsClient.updateGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, groupPropertyId, groupPropertyUpdate);
    expect(property).to.not.be.undefined;
  });

  it("Group properties - Get", async function () {
    let property = await mappingsClient.getGroupProperty(accessToken, testIModel.id, mappingIds[0], groupId, groupPropertyId);
    expect(property).to.not.be.undefined;
  });

  it("Group properties - Get all", async function () {
    let properties = await mappingsClient.getGroupProperties(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
  });

  it("Group properties - Get all with top", async function () {
    let properties = await mappingsClient.getGroupProperties(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
  });

  it("Group properties - Get 3 with iterator", async function () {
    let propertiesIt = mappingsClient.getGroupPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let property = (await propertiesIt.next()).value;
    expect(property).to.not.be.undefined;
    property = (await propertiesIt.next()).value;
    expect(property).to.not.be.undefined;
    property = (await propertiesIt.next()).value;
    expect(property).to.not.be.undefined;
  });

  it("Group properties - Get 2 pages with iterator", async function () {
    let propertiesIt = mappingsClient.getGroupPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let properties = (await propertiesIt.byPage().next()).value;
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.equals(2);
    properties = (await propertiesIt.byPage().next()).value;
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(0);
  });

  //calculated properties tests
  it("Calculated properties - Create and delete", async function () {
    let newProperty: CalculatedPropertyCreate = {
      propertyName: "Test",
      type: CalculatedPropertyType.Length,
    }
    let property = await mappingsClient.createCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, newProperty);
    expect(property).to.not.be.undefined;

    let response = await mappingsClient.deleteCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, property.id);
    expect(response.status).to.be.equals(204);
  });

  it("Calculated properties - Update", async function () {
    const calcPropertyUpdate: CalculatedPropertyUpdate = {
      propertyName: "UpdatedCP",
    };
    let property = await mappingsClient.updateCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, calculatedPropertyId, calcPropertyUpdate);
    expect(property).to.not.be.undefined;
  });

  it("Calculated properties - Get", async function () {
    let property = await mappingsClient.getCalculatedProperty(accessToken, testIModel.id, mappingIds[0], groupId, calculatedPropertyId);
    expect(property).to.not.be.undefined;
  });

  it("Calculated properties - Get all", async function () {
    let properties = await mappingsClient.getCalculatedProperties(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
  });

  it("Calculated properties - Get all with top", async function () {
    let properties = await mappingsClient.getCalculatedProperties(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(2);
  });

  it("Calculated properties - Get 3 with iterator", async function () {
    let propertiesIt = mappingsClient.getCalculatedPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let property = (await propertiesIt.next()).value;
    expect(property).to.not.be.undefined;
    property = (await propertiesIt.next()).value;
    expect(property).to.not.be.undefined;
    property = (await propertiesIt.next()).value;
    expect(property).to.not.be.undefined;
  });

  it("Calculated properties - Get 2 pages with iterator", async function () {
    let propertiesIt = mappingsClient.getCalculatedPropertiesIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let properties = (await propertiesIt.byPage().next()).value;
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.equals(2);
    properties = (await propertiesIt.byPage().next()).value;
    expect(properties).to.not.be.undefined;
    expect(properties.length).to.be.above(0);
  });

  //custom calculations tests
  it("Custom calculations - Create and delete", async function () {
    let newCalculation: CustomCalculationCreate = {
      propertyName: "Test",
      formula: "1+1",
      quantityType: QuantityType.Distance
    }
    let calculation = await mappingsClient.createCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, newCalculation);
    expect(calculation).to.not.be.undefined;

    let response = await mappingsClient.deleteCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, calculation.id);
    expect(response.status).to.be.equals(204);
  });

  it("Custom calculations - Update", async function () {
    const custCalculationUpdate: CustomCalculationUpdate = {
      propertyName: "UpdatedCC",
    };
    let calculation = await mappingsClient.updateCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, customCalculationId, custCalculationUpdate);
    expect(calculation).to.not.be.undefined;
  });

  it("Custom calculations - Get", async function () {
    let calculation = await mappingsClient.getCustomCalculation(accessToken, testIModel.id, mappingIds[0], groupId, customCalculationId);
    expect(calculation).to.not.be.undefined;
  });

  it("Custom calculations - Get all with top", async function () {
    let calculations = await mappingsClient.getCustomCalculations(accessToken, testIModel.id, mappingIds[0], groupId);
    expect(calculations).to.not.be.undefined;
    expect(calculations.length).to.be.above(2);
  });

  it("Custom calculations - Get all", async function () {
    let calculations = await mappingsClient.getCustomCalculations(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    expect(calculations).to.not.be.undefined;
    expect(calculations.length).to.be.above(2);
  });

  it("Custom calculations - Get 3 with iterator", async function () {
    let calculationsIt = mappingsClient.getCustomCalculationsIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let calculation = (await calculationsIt.next()).value;
    expect(calculation).to.not.be.undefined;
    calculation = (await calculationsIt.next()).value;
    expect(calculation).to.not.be.undefined;
    calculation = (await calculationsIt.next()).value;
    expect(calculation).to.not.be.undefined;
  });

  it("Custom calculations - Get 2 pages with iterator", async function () {
    let calculationsIt = mappingsClient.getCustomCalculationsIterator(accessToken, testIModel.id, mappingIds[0], groupId, 2);
    let calculations = (await calculationsIt.byPage().next()).value;
    expect(calculations).to.not.be.undefined;
    expect(calculations.length).to.be.equals(2);
    calculations = (await calculationsIt.byPage().next()).value;
    expect(calculations).to.not.be.undefined;
    expect(calculations.length).to.be.above(0);
  });
});