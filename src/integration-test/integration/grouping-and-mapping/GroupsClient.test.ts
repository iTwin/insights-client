/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { Mapping } from "../../../grouping-and-mapping/interfaces/Mappings";
import { accessToken, groupsClient, mappingsClientV2, testIModel } from "../../utils";
import { Group, GroupUpdate } from "../../../grouping-and-mapping/interfaces/Groups";

describe.only("Groups Client Tests", async ()=>{
  let mappingForGroups: Mapping;
  let groupOne: Group;
  let groupTwo: Group;
  let groupThree: Group;

  beforeEach(async ()=> {
    // Create mappings for testing
    mappingForGroups = await mappingsClientV2.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "MappingForGroups",
      description: "Mapping created for groups testing",
      extractionEnabled: true,
    });

    groupOne = await groupsClient.createGroup(accessToken, mappingForGroups.id, {
      groupName: "GroupOne",
      description: "Group number one",
      query: "SELECT * FROM bis.Element limit 1",
    });

    groupTwo = await groupsClient.createGroup(accessToken, mappingForGroups.id, {
      groupName: "GroupTwo",
      description: "Group number two",
      query: "SELECT * FROM bis.Element limit 2",
    });

    groupThree = await groupsClient.createGroup(accessToken, mappingForGroups.id, {
      groupName: "GroupThree",
      description: "Group number three",
      query: "SELECT * FROM bis.Element limit 3",
    });
  });

  // Create test groups
  after(async () => {
    await mappingsClientV2.deleteMapping(accessToken, mappingForGroups.id);
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

  it("Groups - Get group", async ()=> {
    const getGroupTwo = await groupsClient.getGroup(accessToken, mappingForGroups.id, groupTwo.id);
    const getGroupThree = await groupsClient.getGroup(accessToken, mappingForGroups.id, groupThree.id);

    expect(getGroupTwo.groupName).to.deep.equal(groupTwo.groupName);
    expect(getGroupThree.groupName).to.deep.equal(groupThree.groupName);
  });

  it("Groups - Get all groups", async ()=> {
    const groups = await groupsClient.getGroups(accessToken, mappingForGroups.id);
    for(const group of groups){
      expect(["GroupOne", "GroupTwo", "GroupThree"]).to.include(group.groupName);
    }
  });

  it("Groups - Get top groups", async ()=> {
    const topGroups = await groupsClient.getGroups(accessToken, mappingForGroups.id, 2);
    expect(topGroups.length).to.equal(2);
  });

  it("Groups - Get pages of groups", async ()=> {
    const groupsIterator = groupsClient.getGroupsIterator(accessToken, mappingForGroups.id, 2);
    let flag = false;
    for await (const groupsPage of groupsIterator.byPage()) {
      flag = true;
      for(const group of groupsPage){
        expect(["GroupOne", "GroupTwo", "GroupThree"]).to.include(group.groupName);
      }
    }

    expect(flag).to.be.true;
  });

});
