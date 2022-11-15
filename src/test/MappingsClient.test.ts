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
    let mapping = await mappingsClient.getMapping("auth", "iModelId", "mappingId");
    expect(mapping.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId",
      "pass",
    )).to.be.true;

    mapping = await mappingsClientNewBase.getMapping("auth", "iModelId", "mappingId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings", "pass").resolves(returns2);

    let mappings: Array<Mapping> = await mappingsClient.getMappings("auth", "iModelId");
    expect(mappings.length).to.be.eq(4);
    expect(mappings[0]).to.be.eq(1);
    expect(mappings[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings",
      "pass",
    )).to.be.true;

    mappings = await mappingsClientNewBase.getMappings("auth", "iModelId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings", "pass").resolves(returns2);

    let mappingIt = mappingsClient.getMappingsIterator("auth", "iModelId").byPage();
    for await(const i of mappingIt) {
      expect(i.length).to.be.eq(2);
    }
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings",
      "pass",
    )).to.be.true;

    mappingIt = mappingsClientNewBase.getMappingsIterator("auth", "iModelId").byPage();
    for await(const i of mappingIt) {
      expect(i.length).to.be.eq(2);
    }
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/?$top=2", "pass").resolves(returns2);

    let mappings: Array<Mapping> = await mappingsClient.getMappings("auth", "iModelId", 2);
    expect(mappings.length).to.be.eq(4);
    expect(mappings[0]).to.be.eq(1);
    expect(mappings[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/?$top=2",
      "pass",
    )).to.be.true;

    mappings = await mappingsClientNewBase.getMappings("auth", "iModelId", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/?$top=2",
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
    let mapping = await mappingsClient.createMapping("auth", "iModelId", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newMapping)
    )).to.be.true;

    mapping = await mappingsClientNewBase.createMapping("auth", "iModelId", newMapping);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings",
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
    let mapping = await mappingsClient.updateMapping("auth", "iModelId", "mappingId", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "auth",
      JSON.stringify(newMapping)
    )).to.be.true;

    mapping = await mappingsClientNewBase.updateMapping("auth", "iModelId", "mappingId", newMapping);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId",
      "pass",
    )).to.be.true;
  });

  it("Mappings - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.deleteMapping("auth", "iModelId", "mappingId");
    expect(mapping.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId",
      "pass",
    )).to.be.true;

    mapping = await mappingsClientNewBase.deleteMapping("auth", "iModelId", "mappingId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId",
      "pass",
    )).to.be.true;
  });

  it("Mappings - Copy", async () => {
    const newMapping: MappingCopy = {
      mappingName: "Test",
      targetIModelId: "auth",
    };
    const returns = {
      mapping: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let mapping = await mappingsClient.copyMapping("auth", "iModelId", "mappingId", newMapping);
    expect(mapping.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/copy",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newMapping)
    )).to.be.true;

    mapping = await mappingsClientNewBase.copyMapping("auth", "iModelId", "mappingId", newMapping);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/copy",
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
    let group = await mappingsClient.getGroup("auth", "iModelId", "mappingId", "groupId");
    expect(group.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId",
      "pass",
    )).to.be.true;

    group = await mappingsClientNewBase.getGroup("auth", "iModelId", "mappingId", "groupId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/mappingId/groups", "pass").resolves(returns2);

    let groups: Array<Group> = await mappingsClient.getGroups("auth", "iModelId", "mappingId");
    expect(groups.length).to.be.eq(4);
    expect(groups[0]).to.be.eq(1);
    expect(groups[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups",
      "pass",
    )).to.be.true;

    groups = await mappingsClientNewBase.getGroups("auth", "iModelId", "mappingId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/mappingId/groups/?$top=2", "pass").resolves(returns2);

    let groups: Array<Group> = await mappingsClient.getGroups("auth", "iModelId", "mappingId", 2);
    expect(groups.length).to.be.eq(4);
    expect(groups[0]).to.be.eq(1);
    expect(groups[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/?$top=2",
      "pass",
    )).to.be.true;

    groups = await mappingsClientNewBase.getGroups("auth", "iModelId", "mappingId", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/?$top=2",
      "pass",
    )).to.be.true;
  });

  it("Groups - Create", async () => {
    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "auth",
    };
    const returns = {
      group: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    let group = await mappingsClient.createGroup("auth", "iModelId", "mappingId", newGroup);
    expect(group.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newGroup)
    )).to.be.true;

    group = await mappingsClientNewBase.createGroup("auth", "iModelId", "mappingId", newGroup);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups",
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
    let group = await mappingsClient.updateGroup("auth", "iModelId", "mappingId", "groupId", newGroup);
    expect(group.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "auth",
      JSON.stringify(newGroup)
    )).to.be.true;

    group = await mappingsClientNewBase.updateGroup("auth", "iModelId", "mappingId", "groupId", newGroup);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId",
      "pass",
    )).to.be.true;
  });

  it("Groups - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let group = await mappingsClient.deleteGroup("auth", "iModelId", "mappingId", "groupId");
    expect(group.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId",
      "pass",
    )).to.be.true;

    group = await mappingsClientNewBase.deleteGroup("auth", "iModelId", "mappingId", "groupId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId",
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
    let property = await mappingsClient.getGroupProperty("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/propertyId",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.getGroupProperty("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/propertyId",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties", "pass").resolves(returns2);

    let properties: Array<GroupProperty> = await mappingsClient.getGroupProperties("auth", "iModelId", "mappingId", "groupId");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getGroupProperties("auth", "iModelId", "mappingId", "groupId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/?$top=2", "pass").resolves(returns2);

    let properties: Array<GroupProperty> = await mappingsClient.getGroupProperties("auth", "iModelId", "mappingId", "groupId", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/?$top=2",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getGroupProperties("auth", "iModelId", "mappingId", "groupId", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/?$top=2",
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
    let property = await mappingsClient.createGroupProperty("auth", "iModelId", "mappingId", "groupId", newGroupProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newGroupProperty)
    )).to.be.true;

    property = await mappingsClientNewBase.createGroupProperty("auth", "iModelId", "mappingId", "groupId", newGroupProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties",
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
    let property = await mappingsClient.updateGroupProperty("auth", "iModelId", "mappingId", "groupId", "propertyId", newGroupProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/propertyId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PUT",
      "auth",
      JSON.stringify(newGroupProperty)
    )).to.be.true;

    property = await mappingsClientNewBase.updateGroupProperty("auth", "iModelId", "mappingId", "groupId", "propertyId", newGroupProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/propertyId",
      "pass",
    )).to.be.true;
  });

  it("Group properties - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteGroupProperty("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/propertyId",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.deleteGroupProperty("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/properties/propertyId",
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
    let property = await mappingsClient.getCalculatedProperty("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/propertyId",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.getCalculatedProperty("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/propertyId",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties", "pass").resolves(returns2);

    let properties: Array<CalculatedProperty> = await mappingsClient.getCalculatedProperties("auth", "iModelId", "mappingId", "groupId");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getCalculatedProperties("auth", "iModelId", "mappingId", "groupId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/?$top=2", "pass").resolves(returns2);

    let properties: Array<CalculatedProperty> = await mappingsClient.getCalculatedProperties("auth", "iModelId", "mappingId", "groupId", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/?$top=2",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getCalculatedProperties("auth", "iModelId", "mappingId", "groupId", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/?$top=2",
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
    let property = await mappingsClient.createCalculatedProperty("auth", "iModelId", "mappingId", "groupId", newCalculatedProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newCalculatedProperty)
    )).to.be.true;

    property = await mappingsClientNewBase.createCalculatedProperty("auth", "iModelId", "mappingId", "groupId", newCalculatedProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties",
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
    let property = await mappingsClient.updateCalculatedProperty("auth", "iModelId", "mappingId", "groupId", "propertyId", newCalculatedProperty);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/propertyId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "auth",
      JSON.stringify(newCalculatedProperty)
    )).to.be.true;

    property = await mappingsClientNewBase.updateCalculatedProperty("auth", "iModelId", "mappingId", "groupId", "propertyId", newCalculatedProperty);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/propertyId",
      "pass",
    )).to.be.true;
  });

  it("Calculated properties - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteCalculatedProperty("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/propertyId",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.deleteCalculatedProperty("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/calculatedProperties/propertyId",
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
    let property = await mappingsClient.getCustomCalculation("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(property.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/propertyId",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.getCustomCalculation("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/propertyId",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations", "pass").resolves(returns2);

    let properties: Array<CustomCalculation> = await mappingsClient.getCustomCalculations("auth", "iModelId", "mappingId", "groupId");
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getCustomCalculations("auth", "iModelId", "mappingId", "groupId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations",
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
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2)
      .withArgs("BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/?$top=2", "pass").resolves(returns2);

    let properties: Array<CustomCalculation> = await mappingsClient.getCustomCalculations("auth", "iModelId", "mappingId", "groupId", 2);
    expect(properties.length).to.be.eq(4);
    expect(properties[0]).to.be.eq(1);
    expect(properties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/?$top=2",
      "pass",
    )).to.be.true;

    properties = await mappingsClientNewBase.getCustomCalculations("auth", "iModelId", "mappingId", "groupId", 2);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/?$top=2",
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
    let property = await mappingsClient.createCustomCalculation("auth", "iModelId", "mappingId", "groupId", newCustomCalculation);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newCustomCalculation)
    )).to.be.true;

    property = await mappingsClientNewBase.createCustomCalculation("auth", "iModelId", "mappingId", "groupId", newCustomCalculation);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations",
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
    let property = await mappingsClient.updateCustomCalculation("auth", "iModelId", "mappingId", "groupId", "propertyId", newCustomCalculation);
    expect(property.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/propertyId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "auth",
      JSON.stringify(newCustomCalculation)
    )).to.be.true;

    property = await mappingsClientNewBase.updateCustomCalculation("auth", "iModelId", "mappingId", "groupId", "propertyId", newCustomCalculation);
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/propertyId",
      "pass",
    )).to.be.true;
  });

  it("Custom calculations - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    let property = await mappingsClient.deleteCustomCalculation("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(property.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/propertyId",
      "pass",
    )).to.be.true;

    property = await mappingsClientNewBase.deleteCustomCalculation("auth", "iModelId", "mappingId", "groupId", "propertyId");
    expect(fetchStub.calledWith(
      "BASE/datasources/imodels/iModelId/mappings/mappingId/groups/groupId/customCalculations/propertyId",
      "pass",
    )).to.be.true;
  });
});
