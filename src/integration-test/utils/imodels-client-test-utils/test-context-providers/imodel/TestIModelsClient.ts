/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { decorate, inject, injectable } from "inversify";
import { IModelsClient, IModelsClientOptions } from "@itwin/imodels-client-authoring";
import { testUtilTypes } from "../../TestUtilTypes";

decorate(injectable(), IModelsClient);

@injectable()
export class TestIModelsClient extends IModelsClient {
  constructor(
  @inject(testUtilTypes.iModelsClientOptions)
    options: IModelsClientOptions,
  ) {
    super(options);
  }
}
