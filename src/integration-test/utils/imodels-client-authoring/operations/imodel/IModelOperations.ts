/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { AuthorizationParam, IModel, IModelsErrorCode, IModelsErrorImpl, Link, IModelOperations as ManagementIModelOperations } from "../../../imodels-client-management/IModelsClientExports";
import { BaselineFileState } from "../../base/interfaces/apiEntities/BaselineFileInterfaces";
import { OperationOptions } from "../OperationOptions";
import { CreateIModelFromBaselineParams, IModelPropertiesForCreateFromBaseline } from "./IModelOperationParams";

export class IModelOperations<TOptions extends OperationOptions> extends ManagementIModelOperations<TOptions> {

  constructor(options: TOptions) {
    super(options);
  }

}
