/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { Mapping } from "../../../grouping-and-mapping/interfaces/Mappings";
import { accessToken, groupsClient, mappingsClient, testIModel } from "../../utils";
import { Group, GroupUpdate } from "../../../grouping-and-mapping/interfaces/Groups";
import { PreferReturn } from "../../../common/CommonInterfaces";

describe("Groups Client", ()=> {
  let mappingForGroups: Mapping;
  let groupOne: Group;
  let groupTwo: Group;
  let groupThree: Group;

  before(async ()=> {
    // Create mappings for testing
    mappingForGroups = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "MappingForGroups",
      description: "Mapping created for groups testing",
      extractionEnabled: true,
    });

    groupOne = await groupsClient.createGroup(accessToken, mappingForGroups.id, {
      groupName: "GroupOne",
      description: "Group number one",
      query: "SELECT * FROM bis.Element limit 1",
      metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
    });

    groupTwo = await groupsClient.createGroup(accessToken, mappingForGroups.id, {
      groupName: "GroupTwo",
      description: "Group number two",
      query: "SELECT * FROM bis.Element limit 2",
      metadata: [{ key: "key1", value: "value1" }, { key: "noValue" }],
    });

    groupThree = await groupsClient.createGroup(accessToken, mappingForGroups.id, {
      groupName: "GroupThree",
      description: "Group number three",
      query: "SELECT * FROM bis.Element limit 3",
      metadata: [{ key: "key1", value: "value1" }, { key: "nullValue", value: null }],
    });
  });

  after(async () => {
    await mappingsClient.deleteMapping(accessToken, mappingForGroups.id);
  });

  it("Groups - Get group", async ()=> {
    const getGroupTwo = await groupsClient.getGroup(accessToken, mappingForGroups.id, groupTwo.id);
    const getGroupThree = await groupsClient.getGroup(accessToken, mappingForGroups.id, groupThree.id);

    expect(getGroupTwo.groupName).to.deep.equal(groupTwo.groupName);
    expect(getGroupThree.groupName).to.deep.equal(groupThree.groupName);
  });

  it("Groups - Get all groups", async ()=> {
    const groups = await groupsClient.getGroups(accessToken, mappingForGroups.id);
    for(const group of groups.groups){
      expect(["GroupOne", "GroupTwo", "GroupThree"]).to.include(group.groupName);
    }
  });

  it("Groups - Get top minimal groups", async () => {
    const topGroups = await groupsClient.getGroups(accessToken, mappingForGroups.id, PreferReturn.Minimal, 2);
    expect(topGroups.groups.length).to.equal(2);
    topGroups.groups.forEach((group) => {
      expect("metadata" in group).to.be.false;
    });
  });

  it("Groups - Get top representation groups", async () => {
    const topGroups = await groupsClient.getGroups(accessToken, mappingForGroups.id, PreferReturn.Representation, 2);
    expect(topGroups.groups.length).to.equal(2);
    topGroups.groups.forEach((group) => {
      expect(group).to.have.property("metadata");
    });
  });

  it("Groups - Get pages of minimal groups", async () => {
    const groupsIterator = groupsClient.getGroupsIterator(accessToken, mappingForGroups.id, PreferReturn.Minimal, 2);
    let flag = false;
    for await (const groupsPage of groupsIterator.byPage()) {
      flag = true;
      for (const group of groupsPage) {
        expect(["GroupOne", "GroupTwo", "GroupThree"]).to.include(group.groupName);
        expect("metadata" in group).to.be.false;
      }
    }
    expect(flag).to.be.true;
  });

  it("Groups - Get pages of representation groups", async () => {
    const groupsIterator = groupsClient.getGroupsIterator(accessToken, mappingForGroups.id, PreferReturn.Representation, 2);
    let flag = false;
    for await (const groupsPage of groupsIterator.byPage()) {
      flag = true;
      for (const group of groupsPage) {
        expect(["GroupOne", "GroupTwo", "GroupThree"]).to.include(group.groupName);
        expect(group).to.have.property("metadata");
      }
    }
    expect(flag).to.be.true;
  });

  it("Groups - Create and Delete", async ()=> {
    const group = await groupsClient.createGroup(accessToken, mappingForGroups.id, {
      groupName: "GroupToDelete",
      query: "select * from biscore.element limit 10",
    });

    expect(group).not.be.undefined;
    expect(group.groupName).to.deep.equal("GroupToDelete");

    const response = await groupsClient.deleteGroup(accessToken, mappingForGroups.id, group.id);
    expect(response).not.be.undefined;
    expect(response.status).to.be.equal(204);
  });

  it("Groups - Update", async ()=> {
    const updatedGroupOne: GroupUpdate = {
      groupName: "UpdatedGroupOne",
      description: "Updated description for group one",
    };

    const updatedGroup = await groupsClient.updateGroup(accessToken, mappingForGroups.id, groupOne.id, updatedGroupOne);

    expect(updatedGroup.groupName).not.be.undefined;
    expect(updatedGroup.groupName).to.deep.equal(updatedGroupOne.groupName);
    expect(updatedGroup.description).to.deep.equal(updatedGroupOne.description);
  });

});
