/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { TestAuthorizationProvider } from "../test-context-providers/auth/TestAuthorizationProvider";
import type { TestIModelsClient } from "../test-context-providers/imodel/TestIModelsClient";
import type { TestITwinProvider } from "../test-context-providers/itwin/TestITwinProvider";

export interface TestRunContext {
  testRunId: string;
  packageName: string;
  testSuiteName?: string;
}

export class TestIModelGroup {
  private _iModelNamePrefix: string;

  constructor(
    private readonly _iModelsClient: TestIModelsClient,
    private readonly _testAuthorizationProvider: TestAuthorizationProvider,
    private readonly _testITwinProvider: TestITwinProvider,
    testRunContext: TestRunContext,
  ) {
    this._iModelNamePrefix = `[${testRunContext.testRunId}][${testRunContext.packageName}]`;
    if (testRunContext.testSuiteName)
      this._iModelNamePrefix += `[${testRunContext.testSuiteName}]`;
  }

  public getPrefixedUniqueIModelName(iModelName: string): string {
    return `${this._iModelNamePrefix} ${iModelName}`;
  }

  public async cleanupIModels(): Promise<void> {
    const iTwinId = await this._testITwinProvider.getOrCreate();
    const iModels = this._iModelsClient.iModels.getMinimalList({
      authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
      urlParams: {
        iTwinId,
      },
    });
    for await (const iModel of iModels) {
      if (this.doesIModelBelongToContext(iModel.displayName)) {
        await this._iModelsClient.iModels.delete({
          authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
          iModelId: iModel.id,
        });
      }
    }
  }

  private doesIModelBelongToContext(iModelName: string): boolean {
    return iModelName.startsWith(this._iModelNamePrefix);
  }
}
