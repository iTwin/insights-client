/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelOperations as ManagementIModelOperations } from "../../../imodels-client-management/operations/imodel/IModelOperations";
import type { OperationOptions } from "../OperationOptions";

export class IModelOperations<TOptions extends OperationOptions> extends ManagementIModelOperations<TOptions> {
  constructor(options: TOptions) {
    super(options);
  }
}
