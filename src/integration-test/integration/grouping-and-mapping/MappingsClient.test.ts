/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { MappingCreate, MappingUpdate } from "../../../grouping-and-mapping/interfaces/Mappings";
import { accessToken, mappingsClient, testIModel } from "../../utils/GlobalSetup";

describe("Mappings Client", ()=> {
  let mappingIds: Array<string> = [];

  before(async () => {
    // Create mappings for testing
    const mappingZero = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "mappingZero",
      description: "Mapping created for testing",
      extractionEnabled: true,
    });
    mappingIds.push(mappingZero.id);

    const mappingOne = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "mappingOne",
    });
    mappingIds.push(mappingOne.id);

    const mappingTwo = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "mappingTwo",
    });
    mappingIds.push(mappingTwo.id);
  });

  after(async () => {
    for(const id of mappingIds){
      await mappingsClient.deleteMapping(accessToken, id);
    }
    mappingIds = [];
  });

  it("Mappings - Get mappings with iterator", async ()=> {
    const mappingsIt = mappingsClient.getMappingsIterator(accessToken, testIModel.id, 2);
    let flag = false;
    for await(const mapping of mappingsIt) {
      flag = true;
      expect(mapping).to.not.be.undefined;
      expect(["mappingZero", "mappingOne", "mappingTwo"]).to.include(mapping.mappingName);
    }
    expect(flag).to.be.true;
  });

  it("Mappings - Get all mappings", async ()=> {
    const mappings = (await mappingsClient.getMappings(accessToken, testIModel.id));
    expect(mappings).to.not.be.undefined;

    for(const mapping of mappings.mappings) {
      expect(["mappingZero", "mappingOne", "mappingTwo"]).to.include(mapping.mappingName);
    }
  });

  it("Mappings - Get top mappings", async ()=> {
    const mappings = (await mappingsClient.getMappings(accessToken, testIModel.id, 2));
    expect(mappings.mappings.length).to.be.equal(2);
  });

  it("Mappings - Get mapping", async ()=> {
    const retrievedMapping = await mappingsClient.getMapping(accessToken, mappingIds[1]);

    expect(retrievedMapping.id).to.deep.equal(mappingIds[1]);
    expect(retrievedMapping.mappingName).to.deep.equal("mappingOne");
  });

  it("Mappings - Create and Delete", async ()=> {
    const newMapping: MappingCreate = {
      iModelId: testIModel.id,
      mappingName: "MappingToDelete",
    };
    const mapping = await mappingsClient.createMapping(accessToken, newMapping);

    expect(mapping).not.be.undefined;
    expect(mapping.mappingName).to.deep.equal("MappingToDelete");

    const response = await mappingsClient.deleteMapping(accessToken, mapping.id);
    expect(response.status).to.be.eq(204);
  });

  it("Mappings - Create from a source mapping", async () => {
    const mappingCopy = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "MappingCopy",
      sourceMappingId: mappingIds[0],
    });
    mappingIds.push(mappingCopy.id);

    expect(mappingCopy.mappingName).to.deep.equal("MappingCopy");
    expect(mappingCopy.description).to.deep.equal("Mapping created for testing");
  });

  it("Mappings - Update mapping", async ()=> {
    const mappingUpdate: MappingUpdate = {
      mappingName: "UpdatedMapping",
      description: "Updated mapping test",
      extractionEnabled: true,
    };

    const updatedMapping = await mappingsClient.updateMapping(accessToken, mappingIds[2], mappingUpdate);

    expect(updatedMapping.id).to.deep.equal(mappingIds[2]);
    expect(updatedMapping.mappingName).to.deep.equal("UpdatedMapping");
    expect(updatedMapping.description).to.deep.equal("Updated mapping test");
  });

  it("Mappings - Get mapping extractions", async ()=> {
    const extractions = await mappingsClient.getMappingExtractions(accessToken, mappingIds[0], 2);
    expect(extractions).not.be.undefined;
  });

});
