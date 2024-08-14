/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { GROUPING_AND_MAPPING_BASE_PATH, OperationsBase } from "../../common/OperationsBase";
import { CDM } from "../interfaces/CDM";
import { ICDMClient } from "../interfaces/ICDMClient";

export class CDMClient extends OperationsBase implements ICDMClient {
  private _baseUrl = `${this.basePath}/datasources/imodel-mappings`;

  constructor(basePath?: string) {
    super(basePath ?? GROUPING_AND_MAPPING_BASE_PATH);
  }

  public async getCDM(accessToken: string, mappingId: string, extractionId: string): Promise<CDM> {
    const url = `${this._baseUrl}/${mappingId}/extractions/${extractionId}/cdm`;

    const request = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<CDM>(url, request);
    return response;
  }

  public async getCDMPartition(accessToken: string, mappingId: string, extractionId: string, location: string): Promise<Response> {
    const url = `${this._baseUrl}/${encodeURIComponent(mappingId)}/extractions/${encodeURIComponent(extractionId)}/cdm/partitions?location=${encodeURIComponent(location)}`;
    const request = this.createRequest("GET", accessToken);
    const response = await this.fetchData(url, request);
    return response;
  }
}
