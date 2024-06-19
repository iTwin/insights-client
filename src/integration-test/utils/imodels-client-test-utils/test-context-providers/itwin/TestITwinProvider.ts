/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { inject, injectable } from "inversify";
import { TestAuthorizationProvider } from "../auth/TestAuthorizationProvider";
import { TestITwinsClient } from "./TestITwinsClient";
import { TestITwinProviderConfig } from "./TestITwinProviderConfig";

@injectable()
export class TestITwinProvider {
  private _iTwinId: string | undefined;

  constructor(
    @inject(TestITwinProviderConfig)
    private readonly _testProjectProviderConfig: TestITwinProviderConfig,
    @inject(TestITwinsClient)
    private readonly _iTwinsClient: TestITwinsClient,
    @inject(TestAuthorizationProvider)
    private readonly _testAuthorizationProvider: TestAuthorizationProvider,
  ) { }

  public async getOrCreate(): Promise<string> {
    return this._iTwinId ?? await this.initialize();
  }

  private async initialize(): Promise<string> {
    const authorization = this._testAuthorizationProvider.getAdmin1AuthorizationForProjects();
    this._iTwinId = await this._iTwinsClient.getOrCreateITwin({
      authorization,
      iTwinName: this._testProjectProviderConfig.testITwinName,
    });
    return this._iTwinId;
  }
}
