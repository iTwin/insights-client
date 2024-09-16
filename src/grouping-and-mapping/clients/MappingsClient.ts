/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import { AccessToken } from "@itwin/core-bentley";
import { GROUPING_AND_MAPPING_BASE_PATH, OperationsBase } from "../../common/OperationsBase";
import { RequiredError } from "../../common/Errors";
import { IMappingsClient } from "../interfaces/IMappingsClient";
import { Mapping, MappingContainer, MappingCreate, MappingExtraction, MappingExtractionCollection, MappingList, MappingUpdate } from "../interfaces/Mappings";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { getEntityCollectionPage } from "../../common/iterators/IteratorUtil";

export class MappingsClient extends OperationsBase implements IMappingsClient {
  private readonly _baseUrl;

  constructor(basePath?: string) {
    super(basePath ?? GROUPING_AND_MAPPING_BASE_PATH);
    this._baseUrl = `${basePath ?? GROUPING_AND_MAPPING_BASE_PATH}/datasources/imodel-mappings`;
  }

  public async createMapping(accessToken: AccessToken, mappingCreate: MappingCreate): Promise<Mapping> {
    if (!this.isSimpleIdentifier(mappingCreate.mappingName)) {
      throw new RequiredError(
        "mappingName",
        "Required field mappingName was missing or invalid.",
      );
    }

    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(mappingCreate));
    return (await this.fetchJSON<MappingContainer>(this._baseUrl, requestOptions)).mapping;
  }

  public async updateMapping(accessToken: AccessToken, mappingId: string, mappingUpdate: MappingUpdate): Promise<Mapping> {
    if (mappingUpdate.description == null && mappingUpdate.extractionEnabled == null && mappingUpdate.mappingName == null) {
      throw new RequiredError(
        "mapping",
        "All properties of mapping were missing.",
      );
    }
    if (mappingUpdate.mappingName != null && !this.isSimpleIdentifier(mappingUpdate.mappingName)) {
      throw new RequiredError(
        "mappingName",
        "Required field mappingName was invalid.",
      );
    }

    const mappingUrl = `${this._baseUrl}/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(mappingUpdate));
    return (await this.fetchJSON<MappingContainer>(mappingUrl, requestOptions)).mapping;
  }

  public async deleteMapping(accessToken: AccessToken, mappingId: string): Promise<Response> {
    const mappingUrl = `${this._baseUrl}/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(mappingUrl, requestOptions);
  }

  public async getMapping(accessToken: AccessToken, mappingId: string): Promise<Mapping> {
    const mappingUrl = `${this._baseUrl}/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<MappingContainer>(mappingUrl, requestOptions)).mapping;
  }

  public getMappingsIterator(accessToken: AccessToken, iModelId: string, top?: number): EntityListIterator<Mapping> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const baseUrl = `${this._baseUrl}?iModelId=${encodeURIComponent(iModelId)}`;
    const url = `${baseUrl}${top ? `&$top=${top}` : ""}`;

    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage(url, async (nextUrl: string) => {
      const response = await this.fetchJSON<MappingList>(nextUrl, request);
      return {
        values: response.mappings,
        _links: response._links,
      };
    }));
  }

  public async getMappings(accessToken: AccessToken, iModelId: string, top?: number): Promise<MappingList> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const baseUrl = `${this._baseUrl}?iModelId=${encodeURIComponent(iModelId)}`;
    const url = `${baseUrl}${top ? `&$top=${top}` : ""}`;

    const request = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<MappingList>(url, request);
    return response;
  }

  public getMappingExtractionsIterator(accessToken: AccessToken, mappingId: string, top?: number): EntityListIterator<MappingExtraction> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const baseUrl = `${this._baseUrl}/${encodeURIComponent(mappingId)}/extractions`;
    const url = `${baseUrl}${top ? `?$top=${top}` : ""}`;

    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage(url, async (nextUrl: string) => {
      const response = await this.fetchJSON<MappingExtractionCollection>(nextUrl, request);
      return {
        values: response.extractions,
        _links: response._links,
      };
    }));
  }

  public async getMappingExtractions(accessToken: AccessToken, mappingId: string, top?: number): Promise<MappingExtractionCollection> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const baseUrl = `${this._baseUrl}/${encodeURIComponent(mappingId)}/extractions`;
    const url = `${baseUrl}${top ? `?$top=${top}` : ""}`;

    const request = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<MappingExtractionCollection>(url, request);
    return response;
  }
}
