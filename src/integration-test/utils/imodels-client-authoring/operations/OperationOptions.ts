/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { OperationsBaseOptions as ManagementOperationOptions } from "../../imodels-client-management/base/OperationsBase";
import type { FileHandler } from "../base/files/FileHandler";
import type { IModelsApiUrlFormatter } from "./IModelsApiUrlFormatter";

export interface OperationOptions extends ManagementOperationOptions {
  urlFormatter: IModelsApiUrlFormatter;
  fileHandler: FileHandler;
}
