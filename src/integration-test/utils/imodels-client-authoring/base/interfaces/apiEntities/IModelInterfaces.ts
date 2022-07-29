/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IModel, IModelLinks } from "../../../../imodels-client-management/base/interfaces/apiEntities/IModelInterfaces";

/**
 * DTO to hold a single iModel API response returned by iModel creation operation.
 * @deprecated
 */
export interface IModelCreateResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  iModel: IModel & { _links: IModelLinks };
}
