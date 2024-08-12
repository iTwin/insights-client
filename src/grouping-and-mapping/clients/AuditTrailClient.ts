/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { GROUPING_AND_MAPPING_BASE_PATH, OperationsBase } from "../../common/OperationsBase";
import { AuditTrailCollection } from "../interfaces/AuditTrail";
import { IAuditTrailClient } from "../interfaces/IAuditTrailClient";

export class AuditTrailClient extends OperationsBase implements IAuditTrailClient {
  constructor(basePath?: string) {
    super(basePath ?? GROUPING_AND_MAPPING_BASE_PATH);
  }

  public async getAuditTrail(accessToken: string, iModelId: string, path?: string, after?: string, before?: string, top?: number): Promise<AuditTrailCollection> {
    let url = `${this.basePath}/audit?iModelId=${iModelId}`;

    if (path) {
      url += `&path=${path}`;
    }

    if (after) {
      url += `&after=${after}`;
    }

    if (before) {
      url += `&before=${before}`;
    }

    if (top) {
      url += `&$top=${top}`;
    }

    const request = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<AuditTrailCollection>(url, request);
    return response;
  }
}
