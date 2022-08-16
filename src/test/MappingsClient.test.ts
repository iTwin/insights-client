/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { CalculatedProperty, CalculatedPropertyCreate, CalculatedPropertyType, CustomCalculation, CustomCalculationCreate, DataType, ECProperty, Group, GroupCreate, GroupProperty, GroupPropertyCreate, GroupUpdate, Mapping, MappingCopy, MappingCreate, MappingsClient, MappingUpdate, QuantityType } from "../reporting";
use(chaiAsPromised);

describe("mappings Client", () => {
  const mappingsClient: MappingsClient = new MappingsClient();
  const mappingsClientNewBase: MappingsClient = new MappingsClient("BASE");
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(MappingsClient.prototype, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(MappingsClient.prototype, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Mappings - Get", async () => {
    const returns = {
      mapping: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.getMapping("-", "-", "--");
    expect(mapping.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.true;

    mapping = await mappingsClientNewBase.getMapping("-", "-", "--");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.true;
  });

  it("Mappings - Get all", async () => {
    const returns1 = {
      mappings: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      mappings: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings", "pass").resolves(returns2);

    let mappings: Array<Mapping> = await mappingsClient.getMappings("-", "-");
    expect(mappings.length).to.be.eq(4);
    expect(mappings[0]).to.be.eq(1);
    expect(mappings[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings",
      "pass",
    )).to.be.true;

    mappings = await mappingsClientNewBase.getMappings("-", "-");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings",
      "pass",
    )).to.be.true;
  });

  it("Mappings - Get all by page", async () => {
    const returns1 = {
      mappings: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      mappings: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings", "pass").resolves(returns2);

    let mappingIt = mappingsClient.getMappingsIterator("-", "-").byPage();
    for await(const i of mappingIt) {
      expect(i.length).to.be.eq(2);
    }
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings",
      "pass",
    )).to.be.true;

    mappingIt = mappingsClientNewBase.getMappingsIterator("-", "-").byPage();
    for await(const i of mappingIt) {
      expect(i.length).to.be.eq(2);
    }
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings",
      "pass",
    )).to.be.true;
  });

  it("Mappings - get all with top", async () => {
    const returns1 = {
      mappings: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      mappings: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/?%24top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/?%24top=2", "pass").resolves(returns2);

    let mappings: Array<Mapping> = await mappingsClient.getMappings("-", "-", 2);
    expect(mappings.length).to.be.eq(4);
    expect(mappings[0]).to.be.eq(1);
    expect(mappings[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/?%24top=2",
      "pass",
    )).to.be.true;

    mappings = await mappingsClientNewBase.getMappings("-", "-", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/?%24top=2",
      "pass",
    )).to.be.true;
  });

  it("Mappings - Create", async () => {
    const newMapping: MappingCreate = {
      mappingName: "Test",
    };
    const returns = {
      mapping: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.createMapping("-", "-", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newMapping)
    )).to.be.true;

    mapping = await mappingsClientNewBase.createMapping("-", "-", newMapping);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings",
      "pass",
    )).to.be.true;
  });

  it("Mappings - Update", async () => {
    const newMapping: MappingUpdate = {
      mappingName: "Test",
    };
    const returns = {
      mapping: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.updateMapping("-", "-", "--", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newMapping)
    )).to.be.true;

    mapping = await mappingsClientNewBase.updateMapping("-", "-", "--", newMapping);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.true;
  });

  it("Mappings - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.deleteMapping("-", "-", "--");
    expect(mapping.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.true;

    mapping = await mappingsClientNewBase.deleteMapping("-", "-", "--");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--",
      "pass",
    )).to.be.true;
  });

  it("Mappings - Copy", async () => {
    const newMapping: MappingCopy = {
      mappingName: "Test",
      targetIModelId: "-",
    };
    const returns = {
      mapping: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.copyMapping("-", "-", "--", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/copy",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newMapping)
    )).to.be.true;

    mapping = await mappingsClientNewBase.copyMapping("-", "-", "--", newMapping);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/copy",
      "pass",
    )).to.be.true;
  });

  it("Groups - Get", async () => {
    const returns = {
      group: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    let group = await mappingsClient.getGroup("-", "-", "--", "---");
    expect(group.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.true;

    group = await mappingsClientNewBase.getGroup("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.true;
  });

  it("Groups - Get all", async () => {
    const returns1 = {
      groups: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      groups: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/--/groups", "pass").resolves(returns2);

    let groups: Array<Group> = await mappingsClient.getGroups("-", "-", "--");
    expect(groups.length).to.be.eq(4);
    expect(groups[0]).to.be.eq(1);
    expect(groups[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups",
      "pass",
    )).to.be.true;

    groups = await mappingsClientNewBase.getGroups("-", "-", "--");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups",
      "pass",
    )).to.be.true;
  });

  it("Groups - get all with top", async () => {
    const returns1 = {
      groups: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      groups: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/?%24top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/--/groups/?%24top=2", "pass").resolves(returns2);

    let groups: Array<Group> = await mappingsClient.getGroups("-", "-", "--", 2);
    expect(groups.length).to.be.eq(4);
    expect(groups[0]).to.be.eq(1);
    expect(groups[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/?%24top=2",
      "pass",
    )).to.be.true;

    groups = await mappingsClientNewBase.getGroups("-", "-", "--", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/?%24top=2",
      "pass",
    )).to.be.true;
  });

  it("Groups - Create", async () => {
    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "-",
    };
    const returns = {
      group: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let group = await mappingsClient.createGroup("-", "-", "--", newGroup);
    expect(group.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newGroup)
    )).to.be.true;

    group = await mappingsClientNewBase.createGroup("-", "-", "--", newGroup);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups",
      "pass",
    )).to.be.true;
  });

  it("Groups - Update", async () => {
    const newGroup: GroupUpdate = {
      groupName: "Test",
    };
    const returns = {
      group: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let group = await mappingsClient.updateGroup("-", "-", "--", "---", newGroup);
    expect(group.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newGroup)
    )).to.be.true;

    group = await mappingsClientNewBase.updateGroup("-", "-", "--", "---", newGroup);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.true;
  });

  it("Groups - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let group = await mappingsClient.deleteGroup("-", "-", "--", "---");
    expect(group.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.true;

    group = await mappingsClientNewBase.deleteGroup("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---",
      "pass",
    )).to.be.true;
  });

  it("Group properties - Get", async () => {
    const returns = {
      property: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.getGroupProperty("-", "-", "--", "---", "----");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.getGroupProperty("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.true;
  });

  it("Group properties - Get all", async () => {
    const returns1 = {
      properties: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      properties: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/--/groups/---/properties", "pass").resolves(returns2);

    let properties: Array<GroupProperty> = await mappingsClient.getGroupProperties("-", "-", "--", "---");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getGroupProperties("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties",
      "pass",
    )).to.be.true;
  });

  it("Group properties - get all with top", async () => {
    const returns1 = {
      properties: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      properties: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/?%24top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/--/groups/---/properties/?%24top=2", "pass").resolves(returns2);

    let properties: Array<GroupProperty> = await mappingsClient.getGroupProperties("-", "-", "--", "---", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/?%24top=2",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getGroupProperties("-", "-", "--", "---", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties/?%24top=2",
      "pass",
    )).to.be.true;
  });

  it("Group properties - Create", async () => {
    const ecProperty: ECProperty = {
      ecClassName: "Name",
      ecPropertyName: "Property",
      ecPropertyType: DataType.Integer,
      ecSchemaName: "Schema",
    };
    const newGroupProperty: GroupPropertyCreate = {
      propertyName: "Test",
      dataType: DataType.Integer,
      ecProperties: [ecProperty],
      quantityType: QuantityType.Area,
    };
    const returns = {
      property: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.createGroupProperty("-", "-", "--", "---", newGroupProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newGroupProperty)
    )).to.be.true;

    property = await mappingsClientNewBase.createGroupProperty("-", "-", "--", "---", newGroupProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties",
      "pass",
    )).to.be.true;
  });

  it("Group properties - Update", async () => {
    const ecProperty: ECProperty = {
      ecClassName: "Name",
      ecPropertyName: "Property",
      ecPropertyType: DataType.Integer,
      ecSchemaName: "Schema",
    };
    const newGroupProperty: GroupPropertyCreate = {
      propertyName: "Test",
      dataType: DataType.Integer,
      ecProperties: [ecProperty],
      quantityType: QuantityType.Area,
    };
    const returns = {
      property: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.updateGroupProperty("-", "-", "--", "---", "----", newGroupProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PUT",
      "-",
      JSON.stringify(newGroupProperty)
    )).to.be.true;

    property = await mappingsClientNewBase.updateGroupProperty("-", "-", "--", "---", "----", newGroupProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.true;
  });

  it("Group properties - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteGroupProperty("-", "-", "--", "---", "----");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.deleteGroupProperty("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/properties/----",
      "pass",
    )).to.be.true;
  });

  it("Calculated properties - Get", async () => {
    const returns = {
      property: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.getCalculatedProperty("-", "-", "--", "---", "----");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.getCalculatedProperty("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.true;
  });

  it("Calculated properties - Get all", async () => {
    const returns1 = {
      properties: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      properties: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties", "pass").resolves(returns2);

    let properties: Array<CalculatedProperty> = await mappingsClient.getCalculatedProperties("-", "-", "--", "---");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getCalculatedProperties("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties",
      "pass",
    )).to.be.true;
  });

  it("Calculated properties - get all with top", async () => {
    const returns1 = {
      properties: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      properties: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/?%24top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/?%24top=2", "pass").resolves(returns2);

    let properties: Array<CalculatedProperty> = await mappingsClient.getCalculatedProperties("-", "-", "--", "---", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/?%24top=2",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getCalculatedProperties("-", "-", "--", "---", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/?%24top=2",
      "pass",
    )).to.be.true;
  });

  it("Calculated properties - Create", async () => {
    const newCalculatedProperty: CalculatedPropertyCreate = {
      propertyName: "Test",
      type: CalculatedPropertyType.Area,
    };
    const returns = {
      property: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.createCalculatedProperty("-", "-", "--", "---", newCalculatedProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newCalculatedProperty)
    )).to.be.true;

    property = await mappingsClientNewBase.createCalculatedProperty("-", "-", "--", "---", newCalculatedProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties",
      "pass",
    )).to.be.true;
  });

  it("Calculated properties - Update", async () => {
    const newCalculatedProperty: CalculatedPropertyCreate = {
      propertyName: "Test",
      type: CalculatedPropertyType.Area,
    };
    const returns = {
      property: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.updateCalculatedProperty("-", "-", "--", "---", "----", newCalculatedProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newCalculatedProperty)
    )).to.be.true;

    property = await mappingsClientNewBase.updateCalculatedProperty("-", "-", "--", "---", "----", newCalculatedProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.true;
  });

  it("Calculated properties - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteCalculatedProperty("-", "-", "--", "---", "----");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.deleteCalculatedProperty("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/calculatedProperties/----",
      "pass",
    )).to.be.true;
  });

  it("Custom calculations - Get", async () => {
    const returns = {
      customCalculation: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.getCustomCalculation("-", "-", "--", "---", "----");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.getCustomCalculation("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.true;
  });

  it("Custom calculations - Get all", async () => {
    const returns1 = {
      customCalculations: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      customCalculations: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations", "pass").resolves(returns2);

    let properties: Array<CustomCalculation> = await mappingsClient.getCustomCalculations("-", "-", "--", "---");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getCustomCalculations("-", "-", "--", "---");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations",
      "pass",
    )).to.be.true;
  });

  it("Custom calculations - get all with top", async () => {
    const returns1 = {
      customCalculations: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      customCalculations: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/?%24top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/?%24top=2", "pass").resolves(returns2);

    let properties: Array<CustomCalculation> = await mappingsClient.getCustomCalculations("-", "-", "--", "---", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/?%24top=2",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getCustomCalculations("-", "-", "--", "---", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/?%24top=2",
      "pass",
    )).to.be.true;
  });

  it("Custom calculations - Create", async () => {
    const newCustomCalculation: CustomCalculationCreate = {
      propertyName: "Test",
      formula: "1+1",
      quantityType: QuantityType.Area,
    };
    const returns = {
      customCalculation: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.createCustomCalculation("-", "-", "--", "---", newCustomCalculation);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "-",
      JSON.stringify(newCustomCalculation)
    )).to.be.true;

    property = await mappingsClientNewBase.createCustomCalculation("-", "-", "--", "---", newCustomCalculation);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations",
      "pass",
    )).to.be.true;
  });

  it("Custom calculations - Update", async () => {
    const newCustomCalculation: CustomCalculationCreate = {
      propertyName: "Test",
      formula: "1+1",
      quantityType: QuantityType.Area,
    };
    const returns = {
      customCalculation: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.updateCustomCalculation("-", "-", "--", "---", "----", newCustomCalculation);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "-",
      JSON.stringify(newCustomCalculation)
    )).to.be.true;

    property = await mappingsClientNewBase.updateCustomCalculation("-", "-", "--", "---", "----", newCustomCalculation);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.true;
  });

  it("Custom calculations - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteCustomCalculation("-", "-", "--", "---", "----");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.deleteCustomCalculation("-", "-", "--", "---", "----");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/-/mappings/--/groups/---/customCalculations/----",
      "pass",
    )).to.be.true;
  });
});
