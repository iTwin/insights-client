/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import { Group } from "../../../grouping-and-mapping/interfaces/Groups";
import { Mapping } from "../../../grouping-and-mapping/interfaces/Mappings";
import { accessToken, groupsClient, mappingsClientV2, propertiesClient, testIModel } from "../../utils";
import { DataType, PropertyModify } from "../../../grouping-and-mapping/interfaces/Properties";

describe.only("Properties Client Tests", ()=> {
  let mappingOne: Mapping;
  let groupOne: Group;

  let propertyOne: PropertyModify;
  let propertyTwo: PropertyModify;
  let propertyThree: PropertyModify;
  let propertyFour: PropertyModify;

  before(async ()=>{
    mappingOne = await mappingsClientV2.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "MappingForGroups",
      description: "Mapping created for groups testing",
      extractionEnabled: true,
    });

    groupOne = await groupsClient.createGroup(accessToken, mappingOne.id, {
      groupName: "GroupOne",
      description: "Group number one",
      query: "SELECT * FROM bis.Element limit 10",
    });

    propertyOne = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyOne",
      dataType: DataType.Integer,
    });

    propertyTwo = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyTwo",
      dataType: DataType.String,
    });

    propertyThree = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyThree",
      dataType: DataType.Boolean,
    });

    propertyFour = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyFour",
      dataType: DataType.Double,
    });

  });

  after(async ()=> {
    await mappingsClientV2.deleteMapping(accessToken, mappingOne.id);
  });

  it("Properties - Get property", async ()=> {
    // TODO: Test get property
  });

  it("Properties - Get all property", async ()=> {
    // TODO: Test get all property
  });

  it("Properties - Create and Delete", async ()=> {
    const newProperty = await propertiesClient.createProperty(accessToken, mappingOne.id, groupOne.id, {
      propertyName: "propertyOne",
      dataType: DataType.String,
    });

    expect(newProperty).not.be.undefined;
    expect(newProperty.propertyName).to.deep.equal("propertyOne");

    const response = await propertiesClient.deleteProperty(accessToken, mappingOne.id, groupOne.id, newProperty.id);
    expect(response.status).to.be.deep.equal(204);
  });

});
