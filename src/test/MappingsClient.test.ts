/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised"
import { expect, use } from "chai";
import * as sinon from "sinon";
import { MappingsClient, Mapping, MappingCreate, MappingUpdate, Group, GroupCreate, GroupUpdate, GroupProperty, GroupPropertyCreate, DataType, QuantityType, ECProperty, CalculatedProperty, CalculatedPropertyCreate, CalculatedPropertyType, CustomCalculation, CustomCalculationCreate, MappingCopy } from "../reporting";
use(chaiAsPromised);

describe("mappings Client", () => {

  const mappingsClient: MappingsClient = new MappingsClient();
  const mappingsClientNewBase: MappingsClient = new MappingsClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;
  
  beforeEach(() => {
    fetchStub = sinon.stub(MappingsClient.prototype, "fetchJSON");
    requestStub = sinon.stub(MappingsClient.prototype, "createRequest");
    requestStub.returns("pass");
  })

  afterEach(() => {
    sinon.restore();
  })

  //run tests

  it("Mappings - Get", async function () {
    const returns = {
      mapping: {
        id: 1,
      }
    }
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.getMapping("-", "-", "--");
    expect(mapping.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.eq(true);

    mapping = await mappingsClientNewBase.getMapping("-", "-", "--");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.eq(true);
  });

  it("Mappings - Get all", async function () {
    const returns1 = {
      mappings: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      mappings: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let mappings: Array<Mapping> = await mappingsClient.getMappings("-", "-");
    expect(mappings.length).to.be.eq(4);
    expect(mappings[0]).to.be.eq(1);
    expect(mappings[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings",
      "pass",
    )).to.be.eq(true);

    mappings = await mappingsClientNewBase.getMappings("-", "-");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings",
      "pass",
    )).to.be.eq(true);
  });

  it("Mappings - Get all by page", async function () {
    const returns1 = {
      mappings: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      mappings: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let mappingIt = mappingsClient.getMappingsIterator("-", "-").byPage();
    for await(const i of mappingIt) {
      expect(i.length).to.be.eq(2);
    }
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings",
      "pass",
    )).to.be.eq(true);

    mappingIt = mappingsClientNewBase.getMappingsIterator("-", "-").byPage();
    for await(const i of mappingIt) {
      expect(i.length).to.be.eq(2);
    }
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings",
      "pass",
    )).to.be.eq(true);
  });

  it("Mappings - get all with top", async function () {
    const returns1 = {
      mappings: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      mappings: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let mappings: Array<Mapping> = await mappingsClient.getMappings("-", "-", 2);
    expect(mappings.length).to.be.eq(4);
    expect(mappings[0]).to.be.eq(1);
    expect(mappings[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/?%24top=2",
      "pass",
    )).to.be.eq(true);

    mappings = await mappingsClientNewBase.getMappings("-", "-", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/?%24top=2",
      "pass",
    )).to.be.eq(true);
  });

  it("Mappings - Create", async function () {
    const newMapping: MappingCreate = {
      mappingName: "Test",
    }
    const returns = {
      mapping: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.createMapping("-", "-", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newMapping)
    )).to.be.eq(true);

    mapping = await mappingsClientNewBase.createMapping("-", "-", newMapping);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings",
      "pass",
    )).to.be.eq(true);
  });

  it("Mappings - Update", async function () {
    const newMapping: MappingUpdate = {
      mappingName: "Test"
    }
    const returns = {
      mapping: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.updateMapping("-", "-", "--", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newMapping)
    )).to.be.eq(true);

    mapping = await mappingsClientNewBase.updateMapping("-", "-", "--", newMapping);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.eq(true);
  });

  it("Mappings - Delete", async function () {
    const returns = {
      status: 200
    }
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.deleteMapping("-", "-", "--");
    expect(mapping.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.eq(true);

    mapping = await mappingsClientNewBase.deleteMapping("-", "-", "--");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.eq(true);
  });

  it("Mappings - Copy", async function () {
    const newMapping: MappingCopy = {
      mappingName: "Test",
      targetIModelId: "-"
    }
    const returns = {
      mapping: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.copyMapping("-", "-", "--", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/copy",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newMapping)
    )).to.be.eq(true);

    mapping = await mappingsClientNewBase.copyMapping("-", "-", "--", newMapping);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/copy",
      "pass",
    )).to.be.eq(true);
  });

  it("Groups - Get", async function () {
    const returns = {
      group: {
        id: 1,
      }
    }
    fetchStub.resolves(returns);
    let group = await mappingsClient.getGroup("-", "-", "--", "---");
    expect(group.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.eq(true);

    group = await mappingsClientNewBase.getGroup("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.eq(true);
  });

  it("Groups - Get all", async function () {
    const returns1 = {
      groups: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      groups: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let groups: Array<Group> = await mappingsClient.getGroups("-", "-", "--");
    expect(groups.length).to.be.eq(4);
    expect(groups[0]).to.be.eq(1);
    expect(groups[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups",
      "pass",
    )).to.be.eq(true);

    groups = await mappingsClientNewBase.getGroups("-", "-", "--");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups",
      "pass",
    )).to.be.eq(true);
  });

  it("Groups - get all with top", async function () {
    const returns1 = {
      groups: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      groups: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let groups: Array<Group> = await mappingsClient.getGroups("-", "-", "--", 2);
    expect(groups.length).to.be.eq(4);
    expect(groups[0]).to.be.eq(1);
    expect(groups[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/?%24top=2",
      "pass",
    )).to.be.eq(true);

    groups = await mappingsClientNewBase.getGroups("-", "-", "--", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/?%24top=2",
      "pass",
    )).to.be.eq(true);
  });

  it("Groups - Create", async function () {
    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "-"
    }
    const returns = {
      group: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let group = await mappingsClient.createGroup("-", "-", "--", newGroup);
    expect(group.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newGroup)
    )).to.be.eq(true);

    group = await mappingsClientNewBase.createGroup("-", "-", "--", newGroup);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups",
      "pass",
    )).to.be.eq(true);
  });

  it("Groups - Update", async function () {
    const newGroup: GroupUpdate = {
      groupName: "Test"
    }
    const returns = {
      group: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let group = await mappingsClient.updateGroup("-", "-", "--", "---", newGroup);
    expect(group.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newGroup)
    )).to.be.eq(true);

    group = await mappingsClientNewBase.updateGroup("-", "-", "--", "---", newGroup);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.eq(true);
  });

  it("Groups - Delete", async function () {
    const returns = {
      status: 200
    }
    fetchStub.resolves(returns);
    let group = await mappingsClient.deleteGroup("-", "-", "--", "---");
    expect(group.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.eq(true);

    group = await mappingsClientNewBase.deleteGroup("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.eq(true);
  });

  it("Group properties - Get", async function () {
    const returns = {
      property: {
        id: 1,
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.getGroupProperty("-", "-", "--", "---", "----");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.eq(true);

    property = await mappingsClientNewBase.getGroupProperty("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.eq(true);
  });

  it("Group properties - Get all", async function () {
    const returns1 = {
      properties: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      properties: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let properties: Array<GroupProperty> = await mappingsClient.getGroupProperties("-", "-", "--", "---");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties",
      "pass",
    )).to.be.eq(true);

    properties = await mappingsClientNewBase.getGroupProperties("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties",
      "pass",
    )).to.be.eq(true);
  });

  it("Group properties - get all with top", async function () {
    const returns1 = {
      properties: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      properties: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let properties: Array<GroupProperty> = await mappingsClient.getGroupProperties("-", "-", "--", "---", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/?%24top=2",
      "pass",
    )).to.be.eq(true);

    properties = await mappingsClientNewBase.getGroupProperties("-", "-", "--", "---", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties/?%24top=2",
      "pass",
    )).to.be.eq(true);
  });

  it("Group properties - Create", async function () {
    const ecProperty: ECProperty = {
      ecClassName: "Name",
      ecPropertyName: "Property",
      ecPropertyType: DataType.Integer,
      ecSchemaName: "Schema"
    }
    const newGroupProperty: GroupPropertyCreate = {
      propertyName: "Test",
      dataType: DataType.Integer,
      ecProperties: [ecProperty],
      quantityType: QuantityType.Area
    }
    const returns = {
      property: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.createGroupProperty("-", "-", "--", "---", newGroupProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newGroupProperty)
    )).to.be.eq(true);

    property = await mappingsClientNewBase.createGroupProperty("-", "-", "--", "---", newGroupProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties",
      "pass",
    )).to.be.eq(true);
  });

  it("Group properties - Update", async function () {
    const ecProperty: ECProperty = {
      ecClassName: "Name",
      ecPropertyName: "Property",
      ecPropertyType: DataType.Integer,
      ecSchemaName: "Schema"
    }
    const newGroupProperty: GroupPropertyCreate = {
      propertyName: "Test",
      dataType: DataType.Integer,
      ecProperties: [ecProperty],
      quantityType: QuantityType.Area
    }
    const returns = {
      property: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.updateGroupProperty("-", "-", "--", "---", "----", newGroupProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "PUT",
      "-",
      JSON.stringify(newGroupProperty)
    )).to.be.eq(true);

    property = await mappingsClientNewBase.updateGroupProperty("-", "-", "--", "---", "----", newGroupProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.eq(true);
  });

  it("Group properties - Delete", async function () {
    const returns = {
      status: 200
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteGroupProperty("-", "-", "--", "---", "----");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.eq(true);

    property = await mappingsClientNewBase.deleteGroupProperty("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.eq(true);
  });

  it("Calculated properties - Get", async function () {
    const returns = {
      property: {
        id: 1,
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.getCalculatedProperty("-", "-", "--", "---", "----");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.eq(true);

    property = await mappingsClientNewBase.getCalculatedProperty("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.eq(true);
  });

  it("Calculated properties - Get all", async function () {
    const returns1 = {
      properties: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      properties: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let properties: Array<CalculatedProperty> = await mappingsClient.getCalculatedProperties("-", "-", "--", "---");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties",
      "pass",
    )).to.be.eq(true);

    properties = await mappingsClientNewBase.getCalculatedProperties("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties",
      "pass",
    )).to.be.eq(true);
  });

  it("Calculated properties - get all with top", async function () {
    const returns1 = {
      properties: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      properties: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let properties: Array<CalculatedProperty> = await mappingsClient.getCalculatedProperties("-", "-", "--", "---", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/?%24top=2",
      "pass",
    )).to.be.eq(true);

    properties = await mappingsClientNewBase.getCalculatedProperties("-", "-", "--", "---", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/?%24top=2",
      "pass",
    )).to.be.eq(true);
  });

  it("Calculated properties - Create", async function () {
    const newCalculatedProperty: CalculatedPropertyCreate = {
      propertyName: "Test",
      type: CalculatedPropertyType.Area
    }
    const returns = {
      property: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.createCalculatedProperty("-", "-", "--", "---", newCalculatedProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newCalculatedProperty)
    )).to.be.eq(true);

    property = await mappingsClientNewBase.createCalculatedProperty("-", "-", "--", "---", newCalculatedProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties",
      "pass",
    )).to.be.eq(true);
  });

  it("Calculated properties - Update", async function () {
    const newCalculatedProperty: CalculatedPropertyCreate = {
      propertyName: "Test",
      type: CalculatedPropertyType.Area
    }
    const returns = {
      property: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.updateCalculatedProperty("-", "-", "--", "---", "----", newCalculatedProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newCalculatedProperty)
    )).to.be.eq(true);

    property = await mappingsClientNewBase.updateCalculatedProperty("-", "-", "--", "---", "----", newCalculatedProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.eq(true);
  });

  it("Calculated properties - Delete", async function () {
    const returns = {
      status: 200
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteCalculatedProperty("-", "-", "--", "---", "----");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.eq(true);

    property = await mappingsClientNewBase.deleteCalculatedProperty("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.eq(true);
  });

  it("Custom calculations - Get", async function () {
    const returns = {
      customCalculation: {
        id: 1,
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.getCustomCalculation("-", "-", "--", "---", "----");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.eq(true);

    property = await mappingsClientNewBase.getCustomCalculation("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.eq(true);
  });

  it("Custom calculations - Get all", async function () {
    const returns1 = {
      customCalculations: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      customCalculations: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let properties: Array<CustomCalculation> = await mappingsClient.getCustomCalculations("-", "-", "--", "---");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations",
      "pass",
    )).to.be.eq(true);

    properties = await mappingsClientNewBase.getCustomCalculations("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations",
      "pass",
    )).to.be.eq(true);
  });

  it("Custom calculations - get all with top", async function () {
    const returns1 = {
      customCalculations: [1, 2],
      _links: {
        next: "url",
      }
    }
    const returns2 = {
      customCalculations: [3, 4],
      _links: {
        next: undefined,
      }
    }
    fetchStub.resolves(returns2);
    fetchStub.onCall(0).resolves(returns1);
    let properties: Array<CustomCalculation> = await mappingsClient.getCustomCalculations("-", "-", "--", "---", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/?%24top=2",
      "pass",
    )).to.be.eq(true);

    properties = await mappingsClientNewBase.getCustomCalculations("-", "-", "--", "---", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/?%24top=2",
      "pass",
    )).to.be.eq(true);
  });

  it("Custom calculations - Create", async function () {
    const newCustomCalculation: CustomCalculationCreate = {
      propertyName: "Test",
      formula: "1+1",
      quantityType: QuantityType.Area
    }
    const returns = {
      customCalculation: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.createCustomCalculation("-", "-", "--", "---", newCustomCalculation);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newCustomCalculation)
    )).to.be.eq(true);

    property = await mappingsClientNewBase.createCustomCalculation("-", "-", "--", "---", newCustomCalculation);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations",
      "pass",
    )).to.be.eq(true);
  });

  it("Custom calculations - Update", async function () {
    const newCustomCalculation: CustomCalculationCreate = {
      propertyName: "Test",
      formula: "1+1",
      quantityType: QuantityType.Area
    }
    const returns = {
      customCalculation: {
        id: "1"
      }
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.updateCustomCalculation("-", "-", "--", "---", "----", newCustomCalculation);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.eq(true);
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newCustomCalculation)
    )).to.be.eq(true);

    property = await mappingsClientNewBase.updateCustomCalculation("-", "-", "--", "---", "----", newCustomCalculation);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.eq(true);
  });

  it("Custom calculations - Delete", async function () {
    const returns = {
      status: 200
    }
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteCustomCalculation("-", "-", "--", "---", "----");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.eq(true);

    property = await mappingsClientNewBase.deleteCustomCalculation("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.eq(true);
  });
});
