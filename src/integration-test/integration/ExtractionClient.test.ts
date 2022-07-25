/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised"
import { expect, use } from "chai";
import { ExtractionClient, ExtractionLog, ExtractionRun, ExtractionStatus, MappingCreate, MappingsClient } from "../../reporting";
import "reflect-metadata";
import { getTestRunId, TestConstants, getTestDIContainer, AuthorizationCallback, TestIModelGroup, TestIModelGroupFactory, IModelMetadata, TestAuthorizationProvider, TestIModelCreator, ReusableTestIModelProvider } from "../utils";
use(chaiAsPromised);

describe("Extraction Client", () => {
  const extractionClient: ExtractionClient = new ExtractionClient();
  const mappingsClient: MappingsClient = new MappingsClient();
  let accessToken: string;

  let authorization: AuthorizationCallback;
  let testIModelGroup: TestIModelGroup;
  let testIModel: IModelMetadata;

  let extractionId: string;

  before( async function () {
    this.timeout(0);

    const container = getTestDIContainer();
    
    const authorizationProvider = container.get(TestAuthorizationProvider);
    authorization = authorizationProvider.getAdmin1Authorization();
    accessToken = "Bearer " + (await authorization()).token;

    const testIModelGroupFactory = container.get(TestIModelGroupFactory);
    testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: TestConstants.PackagePrefix, testSuiteName: "ManagementNamedVersionOperations" });

    const testIModelCreator = container.get(TestIModelCreator);
    testIModel = await testIModelCreator.createEmptyAndUploadChangesets(testIModelGroup.getPrefixedUniqueIModelName("Test iModel for write"));

    const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
    testIModel = await reusableTestIModelProvider.getOrCreate();

    const newMap: MappingCreate = {
      mappingName: "Test",
    }
    const map = await mappingsClient.createMapping(accessToken, testIModel.id, newMap);

    const extraction: ExtractionRun = await extractionClient.runExtraction(accessToken, testIModel.id);
    expect(extraction).to.not.be.undefined;
    extractionId = extraction.id;

    mappingsClient.deleteMapping(accessToken, testIModel.id, map.id);
  });

  after(async function () {
    this.timeout(0);
    await testIModelGroup.cleanupIModels();
  });

  //run tests

  it("run extraction", async function () {
    this.timeout(0);
    const extraction: ExtractionRun = await extractionClient.runExtraction(accessToken, testIModel.id);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
  });

  it("Get Logs", async function () {
    this.timeout(0);
    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs(accessToken, extractionId);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
  });

  it("Get Logs with top", async function () {
    this.timeout(0);
    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs(accessToken, extractionId, 1);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
  });

  it("Get Status", async function () {
    this.timeout(0);
    const extraction: ExtractionStatus = await extractionClient.getExtractionStatus(accessToken, extractionId);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
    expect(extraction.state).to.not.be.eq("Failed");
  });
});