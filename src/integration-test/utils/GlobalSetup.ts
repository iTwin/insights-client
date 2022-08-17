/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { IModelMetadata, TestIModelGroup } from "./imodels-client-test-utils/iModelsClientTestUtilsExports";
import { cleanupDirectory, createDirectory, createGuidValue } from "./imodels-client-test-utils/CommonTestUtils";
import { TestAuthorizationProvider } from "./imodels-client-test-utils/test-context-providers/auth/TestAuthorizationProvider";
import { ReusableTestIModelProvider } from "./imodels-client-test-utils/test-context-providers/imodel/ReusableTestIModelProvider";
import { TestIModelCreator } from "./imodels-client-test-utils/test-context-providers/imodel/TestIModelCreator";
import { TestProjectProvider } from "./imodels-client-test-utils/test-context-providers/project/TestProjectProvider";
import { TestIModelGroupFactory } from "./imodels-client-test-utils/test-imodel-group/TestIModelGroupFactory";
import { TestConstants } from "./Constants";
import { getTestDIContainer } from "./TestDiContainerProvider";

let testRunId: string;
export function getTestRunId(): string {
  if (!testRunId) {
    testRunId = createGuidValue();
  }
  return testRunId;
}

export let accessToken: string;
export let testIModel: IModelMetadata;
export let testIModelGroup: TestIModelGroup;
export let iTwinId: string;

export async function mochaGlobalSetup() {
  await cleanupIModelsInTestProject();
  createDirectory(TestConstants.testDownloadDirectoryPath);
  cleanupDirectory(TestConstants.testDownloadDirectoryPath);

  const container = getTestDIContainer();

  const authorizationProvider = container.get(TestAuthorizationProvider);
  const authorization = authorizationProvider.getAdmin1Authorization();
  accessToken = `Bearer ${  (await authorization()).token}`;

  const testIModelGroupFactory = container.get(TestIModelGroupFactory);
  testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: TestConstants.packagePrefix, testSuiteName: "ManagementNamedVersionOperations" });

  const testProjectProvider = container.get(TestProjectProvider);
  iTwinId = await testProjectProvider.getOrCreate();

  const testIModelCreator = container.get(TestIModelCreator);
  testIModel = await testIModelCreator.createEmptyAndUploadChangesets(testIModelGroup.getPrefixedUniqueIModelName("Test iModel for write"));

  const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
  testIModel = await reusableTestIModelProvider.getOrCreate();
}

export async function mochaGlobalTeardown() {
  await cleanupIModelsInTestProject();
  cleanupDirectory(TestConstants.testDownloadDirectoryPath);
}

async function cleanupIModelsInTestProject(): Promise<void> {
  const container = getTestDIContainer();
  const testIModelGroupFactory = container.get(TestIModelGroupFactory);
  testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: TestConstants.packagePrefix });
  await testIModelGroup.cleanupIModels();
}
