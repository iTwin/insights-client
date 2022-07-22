/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { OperationsBaseOptions as ManagementOperationOptions } from "../../imodels-client-management/base";
import { FileHandler } from "../base";
import { IModelsApiUrlFormatter } from "./IModelsApiUrlFormatter";

export interface OperationOptions extends ManagementOperationOptions {
  urlFormatter: IModelsApiUrlFormatter;
  fileHandler: FileHandler;
}
