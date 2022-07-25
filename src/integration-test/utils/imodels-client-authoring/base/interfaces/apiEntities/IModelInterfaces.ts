/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModel, IModelLinks } from "../../../../imodels-client-management/base";

/**
 * Links that belong to iModel entity returned from iModels API.
 * @deprecated
 */
export type iModelLinks = IModelLinks;

/**
 * DTO to hold a single iModel API response returned by iModel creation operation.
 * @deprecated
 */
export interface IModelCreateResponse {
  iModel: IModel & { _links: iModelLinks };
}
