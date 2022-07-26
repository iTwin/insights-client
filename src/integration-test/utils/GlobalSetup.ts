/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { TestIModelGroupFactory, cleanupDirectory, createDirectory, createGuidValue, TestAuthorizationProvider, TestIModelCreator, ReusableTestIModelProvider, IModelMetadata, TestProjectProvider, TestIModelGroup } from "./imodels-client-test-utils/iModelsClientTestUtilsExports";
import { TestConstants } from "./Constants";
import { getTestDIContainer } from "./TestDiContainerProvider";

let testRunId: string;
export function getTestRunId(): string {
  if (!testRunId)
    {testRunId = createGuidValue();}
  return testRunId;
}

export let accessToken: string;
export let testIModel: IModelMetadata;
export let testIModelGroup: TestIModelGroup;
export let projectId: string;

export async function mochaGlobalSetup() {
  await cleanupIModelsInTestProject();
  createDirectory(TestConstants.TestDownloadDirectoryPath);
  cleanupDirectory(TestConstants.TestDownloadDirectoryPath);

  const container = getTestDIContainer();

  const authorizationProvider = container.get(TestAuthorizationProvider);
  const authorization = authorizationProvider.getAdmin1Authorization();
  accessToken = "Bearer " + (await authorization()).token;

  const testIModelGroupFactory = container.get(TestIModelGroupFactory);
  testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: TestConstants.PackagePrefix, testSuiteName: "ManagementNamedVersionOperations" });

  const testProjectProvider = container.get(TestProjectProvider);
  projectId = await testProjectProvider.getOrCreate();

  const testIModelCreator = container.get(TestIModelCreator);
  testIModel = await testIModelCreator.createEmptyAndUploadChangesets(testIModelGroup.getPrefixedUniqueIModelName("Test iModel for write"));

  const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
  testIModel = await reusableTestIModelProvider.getOrCreate();
}

export async function mochaGlobalTeardown() {
  await cleanupIModelsInTestProject();
  cleanupDirectory(TestConstants.TestDownloadDirectoryPath);
}

async function cleanupIModelsInTestProject(): Promise<void> {
  const container = getTestDIContainer();
  const testIModelGroupFactory = container.get(TestIModelGroupFactory);
  const testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: TestConstants.PackagePrefix });
  await testIModelGroup.cleanupIModels();
}