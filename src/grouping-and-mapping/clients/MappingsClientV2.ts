/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import { AccessToken } from "@itwin/core-bentley";
import { OperationsBase } from "../../common/OperationsBase";
import { RequiredError } from "../../reporting/interfaces/Errors";
import { IMappingsClient } from "../interfaces/IMappingsClient";
import { Mapping, MappingCollection, MappingContainer, MappingCreate, MappingExtraction, MappingExtractionCollection, MappingUpdate } from "../interfaces/Mappings";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { getEntityCollectionPage } from "../../common/iterators/IteratorUtil";

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

  public async updateMapping(accessToken: AccessToken, mappingId: string, mappingUpdate: MappingUpdate): Promise<Mapping> {
    const url = `${this._mappingsUrl}/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(mappingUpdate));
    return (await this.fetchJSON<MappingContainer>(url, requestOptions)).mapping;
  }

  public async deleteMapping(accessToken: AccessToken, mappingId: string): Promise<Response> {
    const url = `${this._mappingsUrl}/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async getMapping(accessToken: AccessToken, mappingId: string): Promise<Mapping> {
    const url = `${this._mappingsUrl}/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<MappingContainer>(url, requestOptions)).mapping;
  }

  public getMappingsIterator(accessToken: AccessToken, iModelId: string, top?: number | undefined): EntityListIterator<Mapping> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    const url = top ? `${this._mappingsUrl}?iModelId=${encodeURIComponent(iModelId)}&$top=${top}` :
      `${this._mappingsUrl}?iModelId=${encodeURIComponent(iModelId)}`;

    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl( async ()=> getEntityCollectionPage(url, async (nextUrl: string)=> {
      const response = await this.fetchJSON<MappingCollection>(nextUrl, request);
      return {
        values: response.mappings,
        _links: response._links,
      };
    }));
  }

  public async getMappings(accessToken: AccessToken, iModelId: string, top?: number | undefined ): Promise<MappingCollection> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }

    const url = top ? `${this._mappingsUrl}?iModelId=${encodeURIComponent(iModelId)}&$top=${top}` :
      `${this._mappingsUrl}?iModelId=${encodeURIComponent(iModelId)}`;
    const request = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<MappingCollection>(url, request);
    return response;
  }

  public getMappingExtractionsIterator(accessToken: AccessToken, mappingId: string, top?: number | undefined): EntityListIterator<MappingExtraction> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    const url = top ? `${this._mappingsUrl}/${encodeURIComponent(mappingId)}/extractions?$top=${top}` :
      `${this._mappingsUrl}/${encodeURIComponent(mappingId)}/extractions`;
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl( async ()=> getEntityCollectionPage(url, async (nextUrl: string)=> {
      const response = await this.fetchJSON<MappingExtractionCollection>(nextUrl, request);
      return {
        values: response.extractions,
        _links: response._links,
      };
    }));
  }

  public async getMappingExtractions(accessToken: AccessToken, mappingId: string, top?: number | undefined): Promise<MappingExtractionCollection> {
    const url = top ? `${this._mappingsUrl}/${encodeURIComponent(mappingId)}/extractions?$top=${top}` :
      `${this._mappingsUrl}/${encodeURIComponent(mappingId)}/extractions`;
    const request = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<MappingExtractionCollection>(url, request);
    return response;
  }

}
