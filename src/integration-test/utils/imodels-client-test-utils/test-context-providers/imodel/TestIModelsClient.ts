/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { decorate, inject, injectable } from "inversify";
import type { IModelsClientOptions } from "../../../imodels-client-authoring/IModelsClientExports";
import { IModelsClient } from "../../../imodels-client-authoring/IModelsClient";
import { testUtilTypes } from "../../TestUtilTypes";

decorate(injectable(), IModelsClient);

@injectable()
export class TestIModelsClient extends IModelsClient {
  constructor(
  @inject(testUtilTypes.iModelsClientOptions)
    options: IModelsClientOptions
  ) {
    super(options);
  }
}
