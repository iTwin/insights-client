/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelMetadata, testUtilTypes } from "./imodels-client-test-utils/iModelsClientTestUtilsExports";
import { cleanupDirectory, createDirectory, createGuidValue } from "./imodels-client-test-utils/CommonTestUtils";
import { TestAuthorizationProvider } from "./imodels-client-test-utils/test-context-providers/auth/TestAuthorizationProvider";
import { ReusableTestIModelProvider } from "./imodels-client-test-utils/test-context-providers/imodel/ReusableTestIModelProvider";
import { TestITwinProvider } from "./imodels-client-test-utils/test-context-providers/itwin/TestITwinProvider";
import { TestConstants } from "./Constants";
import { getTestDIContainer } from "./TestDiContainerProvider";
import { ExtractionClient, MappingsClient, ODataClient, ReportsClient } from "../../reporting";
import { BaseIntegrationTestsConfig } from "../utils/imodels-client-test-utils/BaseIntegrationTestsConfig";
import { EC3ConfigurationsClient, EC3JobsClient } from "../../carbon-calculation";

let testRunId: string;
export function getTestRunId(): string {
  if (!testRunId) {
    testRunId = createGuidValue();
  }
  return testRunId;
}

export let accessToken: string;
export let testIModel: IModelMetadata;
export let iTwinId: string;
export let reportsClient: ReportsClient;
export let configurationsClient: EC3ConfigurationsClient;
export let jobsClient: EC3JobsClient;
export let extractionClient: ExtractionClient;
export let mappingsClient: MappingsClient;
export let oDataClient: ODataClient;

export async function mochaGlobalSetup() {
  createDirectory(TestConstants.testDownloadDirectoryPath);
  cleanupDirectory(TestConstants.testDownloadDirectoryPath);

  const container = getTestDIContainer();

  const authorizationProvider = container.get(TestAuthorizationProvider);
  const authorization = authorizationProvider.getAdmin1Authorization();
  accessToken = `Bearer ${ (await authorization()).token}`;

  const testITwinProvider = container.get(TestITwinProvider);
  iTwinId = await testITwinProvider.getOrCreate();

  const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
  testIModel = await reusableTestIModelProvider.getOrCreate();

  const config: BaseIntegrationTestsConfig = container.get(testUtilTypes.baseIntegrationTestsConfig);
  reportsClient = new ReportsClient(config.apis.reporting.baseUrl);
  configurationsClient = new EC3ConfigurationsClient(config.apis.carbonCalculation.baseUrl);
  jobsClient = new EC3JobsClient(config.apis.carbonCalculation.baseUrl);
  extractionClient = new ExtractionClient(config.apis.reporting.baseUrl);
  mappingsClient = new MappingsClient(config.apis.reporting.baseUrl);
  oDataClient = new ODataClient(config.apis.reporting.baseUrl);
}

export async function mochaGlobalTeardown() {
  cleanupDirectory(TestConstants.testDownloadDirectoryPath);
}
