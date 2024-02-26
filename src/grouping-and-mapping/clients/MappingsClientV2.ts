/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { OperationsBase } from "../../common/OperationsBase";
import { RequiredError } from "../../reporting/interfaces/Errors";
import { IMappingsClient } from "../interfaces/IMappingsClient";
import { Mapping, MappingCollection, MappingContainer, MappingCreate, MappingUpdate } from "../interfaces/Mappings";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { Collection, EntityCollectionPage, getEntityCollectionPage } from "../../common/iterators/IteratorUtil";

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

  public getMappingsIterator(accessToken: string, iModelId: string, top?: number | undefined): EntityListIterator<Mapping> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    const url = top ? `${this._mappingsUrl}?iModelId=${iModelId}&$top=${top}` : `${this._mappingsUrl}?iModelId=${iModelId}`;
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl( async ()=> this.getEntityCollectionPageWrapper(url, request));
  }

  private async getEntityCollectionPageWrapper(url: string, request: RequestInit): Promise<EntityCollectionPage<Mapping>> {
    return getEntityCollectionPage(url, async (nextUrl: string)=> this.getMappingCollection(nextUrl, request));
  }

  private async getMappingCollection(nextUrl: string, request: RequestInit): Promise<Collection<Mapping>>{
    const response: MappingCollection = await this.fetchJSON<MappingCollection>(nextUrl, request);
    return {
      values: response.mappings,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: response._links,
    };
  }

  public async getMappings(accessToken: string, iModelId: string, top?: number | undefined ): Promise<Mapping[]> {
    const mappings: Array<Mapping> = [];
    const mapIterator = this.getMappingsIterator(accessToken, iModelId, top);
    for await(const map of mapIterator) {
      mappings.push(map);
    }
    return mappings;
  }

}
