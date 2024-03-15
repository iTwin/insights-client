/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { Mapping } from "../../../grouping-and-mapping";
import { ExtractionRequestDetails, ExtractionState, ExtractionStatus } from "../../../grouping-and-mapping/interfaces/Extraction";
import { accessToken, extractionClient, mappingsClient, testIModel } from "../../utils";

describe("Extraction Client", ()=> {
  let mappingIds: Array<string> = [];
  let mappingOne: Mapping;
  let mappingTwo: Mapping;
  let mappingThree: Mapping;
  let extraction: ExtractionStatus;

  const validExtractionStates = Object.values(ExtractionState);

  before(async () => {
    mappingOne = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "mappingOne",
    });
    mappingIds.push(mappingOne.id);

    mappingTwo = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "mappingTwo",
    });
    mappingIds.push(mappingTwo.id);

    mappingThree = await mappingsClient.createMapping(accessToken, {
      iModelId: testIModel.id,
      mappingName: "mappingThree",
    });
    mappingIds.push(mappingThree.id);

    extraction = await extractionClient.runExtraction(accessToken, {
      iModelId: testIModel.id,
      mappings: [
        { id: mappingOne.id },
        { id: mappingTwo.id },
        { id: mappingThree.id },
      ],
    });
  });

  after(async () => {
    for(const id of mappingIds){
      await mappingsClient.deleteMapping(accessToken, id);
    }
    mappingIds = [];
  });

  it("Extraction Client - Run extraction", async ()=> {
    const extractionRequestDetails: ExtractionRequestDetails = {
      iModelId: testIModel.id,
      mappings: [
        { id: mappingThree.id },
      ],
    };

    const anotherExtraction = await extractionClient.runExtraction(accessToken, extractionRequestDetails);
    expect(anotherExtraction).to.not.be.undefined;
    expect(anotherExtraction.state).to.be.equal(ExtractionState.Queued);
  });

  it("Extraction Client - Get extraction status", async ()=> {
    const getStatus = await extractionClient.getExtractionStatus(accessToken, extraction.id);

    expect(getStatus).not.be.undefined;
    expect(getStatus.id).to.deep.equal(extraction.id);
    expect(validExtractionStates).includes(getStatus.state);
  });

  it("Extraction Client - Get iModel extractions", async ()=> {
    const iModelExtractions = await extractionClient.getIModelExtractions(accessToken, testIModel.id);

    expect(iModelExtractions).to.not.be.undefined;
    expect(iModelExtractions.extractions.length).to.be.greaterThan(0);
    expect(validExtractionStates).includes(iModelExtractions.extractions[0].state);
  });

  it("Extraction Client - Get iModel extractions iterator", async ()=> {
    const iModelExtractionsIt = extractionClient.getIModelExtractionsIterator(accessToken, testIModel.id, 2);

    const pages = iModelExtractionsIt.byPage();
    for await (const page of pages){
      expect(page).to.not.be.empty;
    }
    expect(iModelExtractionsIt).not.be.undefined;
  });

  it("Extraction Client - Get max iModel extractions using top parameter", async ()=> {
    const iModelExtractions = await extractionClient.getIModelExtractions(accessToken, testIModel.id, 2);

    expect(iModelExtractions).to.not.be.undefined;
    expect(iModelExtractions.extractions.length).to.be.equal(2);
    expect(validExtractionStates).includes(iModelExtractions.extractions[0].state);
  });

  it("Extraction Client - Get extraction logs", async ()=> {
    const extractionLogs = await extractionClient.getExtractionLogs(accessToken, extraction.id);
    expect(extractionLogs).not.be.undefined;
    expect(extractionLogs.logs.length).to.be.greaterThan(0);
  });

  it("Extraction Client - Get extraction logs iterator", async ()=> {
    const extractionLogsIt = extractionClient.getExtractionLogsIterator(accessToken, extraction.id, 1);
    const pages = extractionLogsIt.byPage();
    for await(const page of pages){
      expect(page).not.be.empty;
    }
    expect(extractionLogsIt).not.be.undefined;
  });
});
