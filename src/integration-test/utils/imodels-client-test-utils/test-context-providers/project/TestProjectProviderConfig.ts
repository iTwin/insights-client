/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { inject, injectable } from "inversify";
import type { BaseIntegrationTestsConfig } from "../../BaseIntegrationTestsConfig";
import { testUtilTypes } from "../../TestUtilTypes";

@injectable()
export class TestProjectProviderConfig {
  public testProjectName: string;

  constructor(@inject(testUtilTypes.baseIntegrationTestsConfig) config: BaseIntegrationTestsConfig) {
    this.testProjectName = config.testProjectName;
  }
}
