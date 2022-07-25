/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { TestIModelGroupFactory, cleanupDirectory, createDirectory, createGuidValue } from "../utils/imodels-client-test-utils/iModelsClientTestUtilsExports";
import { TestConstants } from "./Constants";
import { getTestDIContainer } from "./TestDiContainerProvider";

let testRunId: string;
export function getTestRunId(): string {
  if (!testRunId)
    {testRunId = createGuidValue();}
  return testRunId;
}

before(async function () {
  this.timeout(0);
  await cleanupIModelsInTestProject();
  createDirectory(TestConstants.TestDownloadDirectoryPath);
  cleanupDirectory(TestConstants.TestDownloadDirectoryPath);
});

after(async function () {
  this.timeout(0);
  await cleanupIModelsInTestProject();
  cleanupDirectory(TestConstants.TestDownloadDirectoryPath);
});

async function cleanupIModelsInTestProject(): Promise<void> {
  const container = getTestDIContainer();
  const testIModelGroupFactory = container.get(TestIModelGroupFactory);
  const testIModelGroup = testIModelGroupFactory.create({ testRunId: getTestRunId(), packageName: TestConstants.PackagePrefix });
  await testIModelGroup.cleanupIModels();
}