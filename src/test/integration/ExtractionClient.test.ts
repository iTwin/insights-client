/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import { expect } from "chai";
import { ExtractionClient, ExtractionLog, ExtractionRun, ExtractionStatus, ExtractionStatusSingle, GroupCollection, GroupCreate, MappingCreate, MappingsClient } from "./../../reporting";
import "reflect-metadata";
import { getTestRunId, Constants, getTestDIContainer } from "../utils/index";
import { IModelsClient, IModelsClientOptions } from "../imodels-client-authoring/src/IModelsClient";
import { AuthorizationCallback } from "../imodels-client-management/src/IModelsClientExports";
import { TestUtilTypes, TestIModelGroup, TestIModelGroupFactory, BaseIntegrationTestsConfig, IModelMetadata, TestIModelFileProvider, TestAuthorizationProvider, TestIModelCreator, ReusableTestIModelProvider } from "../imodels-client-test-utils/src/iModelsClientTestUtilsExports";

chai.should();
describe("Extraction Client", () => {
  const extractionClient: ExtractionClient = new ExtractionClient();
  const mappingsClient: MappingsClient = new MappingsClient();
  let accessToken: string;

  let iModelsClient: IModelsClient;
  let authorization: AuthorizationCallback;
  let testIModelGroup: TestIModelGroup;
  let testIModel: IModelMetadata;
  let testIModelFileProvider: TestIModelFileProvider;

  let extractionId: string;
  let mappingId: string;

  before( async function () {
    this.timeout(0);

    const container = getTestDIContainer();

    const iModelsClientOptions = container.get<IModelsClientOptions>(TestUtilTypes.IModelsClientOptions);
    iModelsClient = new IModelsClient(iModelsClientOptions);
    
    const authorizationProvider = container.get(TestAuthorizationProvider);
    authorization = authorizationProvider.getAdmin1Authorization();
    accessToken = "Bearer " + (await authorization()).token;

    testIModelFileProvider = container.get(TestIModelFileProvider);

    const testIModelGroupFactory = container.get(TestIModelGroupFactory);
    testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: Constants.PackagePrefix, testSuiteName: "ManagementNamedVersionOperations" });

    const testIModelCreator = container.get(TestIModelCreator);
    testIModel = await testIModelCreator.createEmptyAndUploadChangesets(testIModelGroup.getPrefixedUniqueIModelName("Test iModel for write"));

    const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
    testIModel = await reusableTestIModelProvider.getOrCreate();

    const extraction: ExtractionRun = await extractionClient.runExtraction(accessToken, testIModel.id);
    expect(extraction).to.not.be.undefined;
    extractionId = extraction.id;
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

  it("Get Logs Async", async function () {
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
    expect(extraction.state).to.not.be.equals("Failed");
  });
});