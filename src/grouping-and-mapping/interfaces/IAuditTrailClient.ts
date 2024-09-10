/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { AuditTrailCollection } from "./AuditTrail";

export interface IAuditTrailClient {
  /**
   * Gets Audit Trail Entries.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} iModelId The IModel Id.
   * @param {string} path Query entries in path (recursive).
   * @param {string} after DateTimeOffset value to return the entries from (inclusive).
   * @param {string} before DateTimeOffset value to return the entries up to (inclusive).
   * @param {number} top Optional max items to be sent in response.
   */
  getAuditTrail(accessToken: AccessToken, iModelId: string, path?: string, after?: string, before?: string, top?: number): Promise<AuditTrailCollection>;
}
