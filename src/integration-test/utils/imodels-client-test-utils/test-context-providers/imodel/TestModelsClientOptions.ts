/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { inject, injectable } from "inversify";
import type { ApiOptions, IModelsClientOptions } from "@itwin/imodels-client-authoring";
import type { BaseIntegrationTestsConfig } from "../../BaseIntegrationTestsConfig";
import { testUtilTypes } from "../../TestUtilTypes";

@injectable()
export class TestIModelsClientOptions implements IModelsClientOptions {
  public api: ApiOptions;

  constructor(
  @inject(testUtilTypes.baseIntegrationTestsConfig)
    config: BaseIntegrationTestsConfig
  ) {
    this.api = { baseUrl: config.apis.iModels.baseUrl };
  }
}
