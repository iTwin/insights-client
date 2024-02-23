/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { MappingCreate, MappingUpdate } from "../../../grouping-and-mapping/interfaces/Mappings";
import { accessToken, mappingsClientV2, testIModel } from "../../utils";

describe.only("Mappings Client Integration Tests", ()=> {
  it("Mappings - Create and Delete", async ()=> {
    const newMapping: MappingCreate = {
      iModelId: testIModel.id,
      mappingName: "Test",
    };

    const mapping = await mappingsClientV2.createMapping(accessToken, newMapping);
    expect(mapping).not.be.undefined;

    const response = await mappingsClientV2.deleteMapping(accessToken, mapping.id);
    expect(response.status).to.be.eq(204);
  });

  it("Mappings - Create from existing mapping and Delete", async () => {
    const existingMapping: MappingCreate = {
      iModelId: testIModel.id,
      mappingName: "existingMapping",
      description: "Existing Mapping",
    };

    const mapping = await mappingsClientV2.createMapping(accessToken, existingMapping);

    const newMapping: MappingCreate = {
      iModelId: testIModel.id,
      mappingName: "newMapping",
      description: "Copied from existing Mapping",
      sourceMappingId: mapping.id,
    };

    const mappingTwo = await mappingsClientV2.createMapping(accessToken, newMapping);

    expect(mapping).not.be.undefined;
    expect(mappingTwo).not.be.undefined;

    const responseOne = await mappingsClientV2.deleteMapping(accessToken, mapping.id);
    const responseTwo = await mappingsClientV2.deleteMapping(accessToken, mappingTwo.id);

    expect(responseOne.status).to.be.eq(204);
    expect(responseTwo.status).to.be.eq(204);

  });

  it("Mappings - Get mapping", async ()=> {
    const newMapping: MappingCreate = {
      iModelId: testIModel.id,
      mappingName: "Test",
    };

    const mapping = await mappingsClientV2.createMapping(accessToken, newMapping);
    const retrievedMapping = await mappingsClientV2.getMapping(accessToken, mapping.id);
    expect(retrievedMapping.id).to.deep.equal(mapping.id);
    expect(retrievedMapping.mappingName).to.deep.equal(mapping.mappingName);
  });

  it("Mappings - Update mapping", async ()=> {
    const newMapping: MappingCreate = {
      iModelId: testIModel.id,
      mappingName: "Test",
    };

    const mappingUpdate: MappingUpdate = {
      mappingName: "UpdatedTest",
      description: "Updated mapping name",
      extractionEnabled: true,
    };

    const mapping = await mappingsClientV2.createMapping(accessToken, newMapping);
    const updatedMapping = await mappingsClientV2.updateMapping(accessToken, mapping.id, mappingUpdate);

    expect(updatedMapping.id).to.deep.equal(mapping.id);
    expect(updatedMapping.mappingName).to.deep.equal("UpdatedTest");
    expect(updatedMapping.description).to.deep.equal("Updated mapping name");
  });

  it("Mappings - Get mappings collection", ()=> {
    // TODO: test get all mappings.
  });

});
