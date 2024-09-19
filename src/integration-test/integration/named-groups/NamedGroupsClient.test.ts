/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { accessToken, iTwinId, namedGroupsClient } from "../../utils/GlobalSetup";
import { PreferReturn } from "../../../common/Common";
import { NamedGroup, NamedGroupUpdate } from "../../../named-groups/interfaces/NamedGroups";

describe("NamedGroups Client", () => {
  let groupOne: NamedGroup;
  let groupTwo: NamedGroup;
  let groupThree: NamedGroup;

  before(async () => {
    groupOne = await namedGroupsClient.createNamedGroup(accessToken, {
      iTwinId,
      displayName: "GroupOne 🚀",
      description: "Group number one",
      query: "SELECT * FROM bis.Element limit 1",
      metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
    });

    groupTwo = await namedGroupsClient.createNamedGroup(accessToken, {
      iTwinId,
      displayName: "GroupTwo 👻",
      description: "Group number two",
      query: "SELECT * FROM bis.Element limit 2",
      metadata: [{ key: "key1", value: "value1" }, { key: "noValue" }],
    });

    groupThree = await namedGroupsClient.createNamedGroup(accessToken, {
      iTwinId,
      displayName: "GroupThree",
      description: "Group number three",
      query: "SELECT * FROM bis.Element limit 3",
      metadata: [{ key: "key1", value: "value1" }, { key: "nullValue", value: null }],
    });
  });

  after(async () => {
    const groups = await namedGroupsClient.getNamedGroups(accessToken, iTwinId, PreferReturn.Minimal);
    for (const group of groups.groups) {
      await namedGroupsClient.deleteNamedGroup(accessToken, group.id);
    }
  });

  it("NamedGroups - Get group", async () => {
    const getGroupTwo = await namedGroupsClient.getNamedGroup(accessToken, groupTwo.id);
    const getGroupThree = await namedGroupsClient.getNamedGroup(accessToken, groupThree.id);

    expect(getGroupTwo.displayName).to.deep.equal(groupTwo.displayName);
    expect(getGroupThree.displayName).to.deep.equal(groupThree.displayName);
  });

  it("NamedGroups - Get all groups", async () => {
    const groups = await namedGroupsClient.getNamedGroups(accessToken, iTwinId);
    for (const group of groups.groups) {
      expect(["GroupOne", "GroupTwo", "GroupThree"]).to.include(group.displayName);
    }
  });

  it("NamedGroups - Get top minimal groups", async () => {
    const topGroups = await namedGroupsClient.getNamedGroups(accessToken, iTwinId, PreferReturn.Minimal, 2);
    expect(topGroups.groups.length).to.equal(2);
    topGroups.groups.forEach((group) => {
      expect("metadata" in group).to.be.false;
    });
  });

  it("NamedGroups - Get top representation groups", async () => {
    const topGroups = await namedGroupsClient.getNamedGroups(accessToken, iTwinId, PreferReturn.Representation, 2);
    expect(topGroups.groups.length).to.equal(2);
    topGroups.groups.forEach((group) => {
      expect(group).to.have.property("metadata");
    });
  });

  it("NamedGroups - Get pages of minimal groups", async () => {
    const groupsIterator = namedGroupsClient.getNamedGroupsIterator(accessToken, iTwinId, PreferReturn.Minimal, 2);
    let flag = false;
    for await (const groupsPage of groupsIterator.byPage()) {
      flag = true;
      for (const group of groupsPage) {
        expect(["GroupOne", "GroupTwo", "GroupThree"]).to.include(group.displayName);
        expect("metadata" in group).to.be.false;
      }
    }
    expect(flag).to.be.true;
  });

  it("NamedGroups - Get pages of representation groups", async () => {
    const groupsIterator = namedGroupsClient.getNamedGroupsIterator(accessToken, iTwinId, PreferReturn.Representation, 2);
    let flag = false;
    for await (const groupsPage of groupsIterator.byPage()) {
      flag = true;
      for (const group of groupsPage) {
        expect(["GroupOne", "GroupTwo", "GroupThree"]).to.include(group.displayName);
        expect(group).to.have.property("metadata");
      }
    }
    expect(flag).to.be.true;
  });

  it("NamedGroups - Create and Delete", async () => {
    const group = await namedGroupsClient.createNamedGroup(accessToken, {
      iTwinId,
      displayName: "GroupToDelete",
      query: "select * from biscore.element limit 10",
    });

    expect(group).not.be.undefined;
    expect(group.displayName).to.deep.equal("GroupToDelete");

    const response = await namedGroupsClient.deleteNamedGroup(accessToken, group.id);
    expect(response).not.be.undefined;
    expect(response.status).to.be.equal(204);
  });

  it("NamedGroups - Update", async () => {
    const updatedGroupOne: NamedGroupUpdate = {
      displayName: "UpdatedGroupOne",
      description: "Updated description for group one",
    };

    const updatedGroup = await namedGroupsClient.updateNamedGroup(accessToken, groupOne.id, updatedGroupOne);

    expect(updatedGroup.displayName).not.be.undefined;
    expect(updatedGroup.displayName).to.deep.equal(updatedGroupOne.displayName);
    expect(updatedGroup.description).to.deep.equal(updatedGroupOne.description);
  });

});
