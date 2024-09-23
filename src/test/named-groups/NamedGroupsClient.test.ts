/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import { expect } from "chai";
import * as sinon from "sinon";
import { PreferReturn } from "@itwin/imodels-client-authoring";
import { NamedGroupsClient } from "../../named-groups/clients/NamedGroupsClient";
import { NamedGroupContainer, NamedGroupCreate, NamedGroupUpdate } from "../../named-groups/interfaces/NamedGroups";

describe("NamedGroups Client Unit tests", () => {
  const groupsClient: NamedGroupsClient = new NamedGroupsClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(groupsClient, "fetchJSON" as any);
    requestStub = sinon.stub(groupsClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Groups client - Create group", async () => {
    const newGroup: NamedGroupCreate = {
      iTwinId: "iTwinId",
      displayName: "AllElements 🚀",
      description: "Group description",
      query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
      metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
    };

    const returns: NamedGroupContainer = {
      group: {
        id: "1",
        displayName: "AllElements",
        description: "Group description",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const group = await groupsClient.createNamedGroup("authToken", newGroup);
    expect(group.id).to.be.eq("1");
    expect(group.displayName).to.equal(returns.group.displayName);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "authToken",
      JSON.stringify(newGroup),
    )).to.be.true;
  });

  it("Groups client - Delete group", async () => {
    const returns = {
      status: 204,
    };
    fetchStub.resolves(returns);

    const response = await groupsClient.deleteNamedGroup("authToken", "groupId");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/groupId",
      "pass",
    )).to.be.true;

    expect(response.status).to.be.eq(204);
  });

  it("Groups client - Get group", async () => {
    const returns: NamedGroupContainer = {
      group: {
        id: "1",
        displayName: "AllElements",
        description: "Group description",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const group = await groupsClient.getNamedGroup("authToken", "1");
    expect(group.id).to.deep.equal("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/1",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;
  });

  it("Groups client - Get groups minimal", async () => {
    const minimalReturns = {
      groups: [
        {
          id: "1",
          displayName: "PhysicalElements",
          description: "A group of physical elements",
          query: "SELECT ECInstanceId, ECClassId FROM BisCore.PhysicalElement",
        },
        {
          id: "2",
          displayName: "AllElements",
          description: "A group of all elements",
          query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        },
      ],
    };

    fetchStub.resolves(minimalReturns);
    const groupsList = await groupsClient.getNamedGroups("authToken", "iTwinId", PreferReturn.Minimal);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/?iTwinId=iTwinId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
      undefined,
      "minimal",
    )).to.be.true;
    expect(groupsList.groups.length).to.equal(2);
  });

  it("Groups client - Get groups representation", async () => {
    const fullReturns = {
      groups: [{
        id: "1",
        displayName: "PhysicalElements",
        description: "A group of physical elements",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.PhysicalElement",
        metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      },
      {
        id: "2",
        displayName: "AllElements",
        description: "A group of all elements",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        metadata: [{ key: "key1", value: "value1" }],
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      }],
      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/named-groups/?iTwinId=iTwinId",
        },
      },
    };

    fetchStub.resolves(fullReturns);
    const groupsList = await groupsClient.getNamedGroups("authToken", "iTwinId", PreferReturn.Representation);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/?iTwinId=iTwinId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
      undefined,
      "representation",
    )).to.be.true;
    expect(groupsList.groups.length).to.equal(2);
    expect(groupsList.groups.every((group) => Array.isArray(group.metadata))).to.be.true;
  });

  it("Groups client - Update a group", async () => {
    const updateGroup: NamedGroupUpdate = {
      displayName: "AllElements",
      description: "Updated description",
      query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
      metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
    };

    const returns: NamedGroupContainer = {
      group: {
        id: "1",
        displayName: "AllElements",
        description: "Updated description",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const group = await groupsClient.updateNamedGroup("authToken", "1", updateGroup);
    expect(group.id).to.be.eq("1");
    expect(group.description).to.equal(updateGroup.description);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/1",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "authToken",
      JSON.stringify(updateGroup),
    )).to.be.true;
  });
});
