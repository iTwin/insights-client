/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import { expect } from "chai";
import { ExtractionClient, ExtractionLog, ExtractionSingleRun, ExtractionStatusSingle } from "./../../reporting";
import "reflect-metadata";
import { getTestRunId, Constants, getTestDIContainer } from "../utils/index";
import { IModelsClient, IModelsClientOptions } from "../imodels-client-authoring/src/IModelsClient";
import { AuthorizationCallback } from "../imodels-client-management/src/IModelsClientExports";
import { TestUtilTypes, TestIModelGroup, TestIModelGroupFactory, BaseIntegrationTestsConfig, IModelMetadata, TestIModelFileProvider, TestAuthorizationProvider, TestIModelCreator, ReusableTestIModelProvider } from "../imodels-client-test-utils/src/iModelsClientTestUtilsExports";

chai.should();
describe("Extraction Client", () => {
  const extractionClient: ExtractionClient = new ExtractionClient();
  let accessToken: string;

  let iModelsClient: IModelsClient;
  let authorization: AuthorizationCallback;
  let testIModelGroup: TestIModelGroup;
  let testIModel: IModelMetadata;
  let testIModelFileProvider: TestIModelFileProvider;

  let extractionId: string;

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

  });

  after(async () => {
    await testIModelGroup.cleanupIModels();
  });

  //run tests
  it("Run extraction", async function () {
    this.timeout(0);
    const extraction: ExtractionSingleRun = await extractionClient.runExtraction(accessToken, testIModel.id);
    expect(extraction).to.not.be.undefined;
    extractionId = extraction.run.id;
  });

  it("Get Logs Async", async function () {
    this.timeout(0);
    const extraction: Array<ExtractionLog> = await extractionClient.getExtractionLogs(accessToken, extractionId, 10);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
  });

  it("Get Status", async function () {
    this.timeout(0);
    const extraction: ExtractionStatusSingle = await extractionClient.getExtractionStatus(accessToken, extractionId);
    expect(extraction).to.not.be.undefined;
    expect(extraction).to.not.be.empty;
  });
});