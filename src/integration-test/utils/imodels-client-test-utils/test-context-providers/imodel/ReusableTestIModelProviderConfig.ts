/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { inject, injectable } from "inversify";
import type { BaseIntegrationTestsConfig, BehaviorOptions } from "../../BaseIntegrationTestsConfig";
import { testUtilTypes } from "../../TestUtilTypes";

@injectable()
export class ReusableTestIModelProviderConfig {
  public testIModelName: string;
  public behaviorOptions: Pick<BehaviorOptions, "recreateReusableIModel">;

  constructor(
  @inject(testUtilTypes.baseIntegrationTestsConfig)
    config: BaseIntegrationTestsConfig
  ) {
    this.testIModelName = config.testIModelName;
    this.behaviorOptions = config.behaviorOptions;
  }
}
