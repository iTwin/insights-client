/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { OperationsBase } from "../../common/OperationsBase";
import { RequiredError } from "../../reporting/interfaces/Errors";
import { IMappingsClient } from "../interfaces/IMappingsClient";
import { Mapping, MappingContainer, MappingCreate, MappingUpdate } from "../interfaces/Mappings";

export class MappingsClientV2 extends OperationsBase implements IMappingsClient {
  private _mappingsUrl = `${this.groupingAndMappingBasePath}/datasources/imodel-mappings`;

  public async createMapping(accessToken: AccessToken, mappingCreate: MappingCreate): Promise<Mapping> {
    if (!this.isSimpleIdentifier(mappingCreate.mappingName)) {
      throw new RequiredError(
        "mappingName",
        "Required field mappingName was missing or invalid.",
      );
    }

    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(mappingCreate));
    return (await this.fetchJSON<MappingContainer>(this._mappingsUrl, requestOptions)).mapping;
  }

  public async updateMapping(accessToken: string, mappingId: string, mappingUpdate: MappingUpdate): Promise<Mapping> {
    const url = `${this._mappingsUrl}/${mappingId}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(mappingUpdate));
    return (await this.fetchJSON<MappingContainer>(url, requestOptions)).mapping;
  }

  public async deleteMapping(accessToken: AccessToken, mappingId: string): Promise<Response> {
    const url = `${this._mappingsUrl}/${mappingId}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async getMapping(accessToken: AccessToken, mappingId: string): Promise<Mapping> {
    const url = `${this._mappingsUrl}/${mappingId}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<MappingContainer>(url, requestOptions)).mapping;
  }

}
