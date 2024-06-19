/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { inject, injectable } from "inversify";
import { TestAuthorizationProvider } from "../test-context-providers/auth/TestAuthorizationProvider";
import { TestIModelsClient } from "../test-context-providers/imodel/TestIModelsClient";
import { TestITwinProvider } from "../test-context-providers/itwin/TestITwinProvider";
import { TestIModelGroup } from "./TestIModelGroup";

@injectable()
export class TestIModelGroupFactory {
  constructor(
    @inject(TestIModelsClient)
    private readonly _iModelsClient: TestIModelsClient,
    @inject(TestAuthorizationProvider)
    private readonly _testAuthorizationProvider: TestAuthorizationProvider,
    @inject(TestITwinProvider)
    private readonly _testProjectProvider: TestITwinProvider,
  ) { }

  public create(testRunContext: {
    testRunId: string;
    packageName: string;
    testSuiteName?: string;
  }): TestIModelGroup {
    return new TestIModelGroup(this._iModelsClient, this._testAuthorizationProvider, this._testProjectProvider, testRunContext);
  }
}
