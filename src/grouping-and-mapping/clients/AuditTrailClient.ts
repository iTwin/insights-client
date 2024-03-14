/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { OperationsBase } from "../../common/OperationsBase";
import { AuditTrailCollection } from "../interfaces/AuditTrail";
import { IAuditTrailClient } from "../interfaces/IAuditTrailClient";

export class AuditTrailClients extends OperationsBase implements IAuditTrailClient {
  public async getAuditTrail(accessToken: string, iModelId: string, path?: string, after?: string, before?: string, top?: number): Promise<AuditTrailCollection> {
    let url = `${this.groupingAndMappingBasePath}/audit?iModelId=${iModelId}`;

    if(path){
      url += `&path=${path}`;
    }

    if(after){
      url += `&after=${after}`;
    }

    if(before){
      url += `&before=${before}`;
    }

    if(top){
      url += `&$top=${top}`;
    }

    const request = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<AuditTrailCollection>(url, request);
    return response;
  }
}
