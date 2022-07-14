/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelsApiUrlFormatter as ManamegentIModelsApiUrlFormatter } from "../../../imodels-client-management/src/IModelsClientExports";
import { GetLockListUrlParams } from "./lock/LockOperationParams";

export class IModelsApiUrlFormatter extends ManamegentIModelsApiUrlFormatter {
  public getBaselineUrl(params: { iModelId: string }): string {
    return `${this.baseUrl}/${params.iModelId}/baselinefile`;
  }

  public getLockListUrl(params: { iModelId: string, urlParams?: GetLockListUrlParams }): string {
    return `${this.baseUrl}/${params.iModelId}/locks${this.formQueryString({ ...params.urlParams })}`;
  }
}
