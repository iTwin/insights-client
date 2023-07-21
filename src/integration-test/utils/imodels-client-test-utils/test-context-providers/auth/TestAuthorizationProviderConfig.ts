/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { inject, injectable } from "inversify";
import type { BaseIntegrationTestsConfig, TestUsersConfigValues } from "../../BaseIntegrationTestsConfig";
import { testUtilTypes } from "../../TestUtilTypes";

interface ApiScopes {
  iModels: string;
  iTwins: string;
}

@injectable()
export class TestAuthorizationProviderConfig {
  public testUsers: TestUsersConfigValues;
  public apiScopes: ApiScopes;

  constructor(
  @inject(testUtilTypes.baseIntegrationTestsConfig)
    config: BaseIntegrationTestsConfig
  ) {
    this.testUsers = config.testUsers;
    this.apiScopes = {
      iModels: config.apis.iModels.scopes,
      iTwins: config.apis.iTwins.scopes,
    };
  }
}
