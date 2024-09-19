/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { NAMED_GROUPS_BASE_PATH, OperationsBase } from "../../common/OperationsBase";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { EntityCollectionPage, getEntityCollectionPage } from "../../common/iterators/IteratorUtil";
import { RequiredError } from "../../common/Errors";
import { AccessToken } from "@itwin/core-bentley";
import { PreferReturn } from "../../common/Common";
import { NamedGroup, NamedGroupContainer, NamedGroupCreate, NamedGroupList, NamedGroupMetadata, NamedGroupMinimal, NamedGroupMinimalList, NamedGroupUpdate } from "../interfaces/NamedGroups";
import { INamedGroupsClient } from "../interfaces/INamedGroupsClient";

export class NamedGroupsClient extends OperationsBase implements INamedGroupsClient {
  private _baseUrl = `${this.basePath}`;

  constructor(basePath?: string) {
    super(basePath ?? NAMED_GROUPS_BASE_PATH);
  }

  public async createNamedGroup(accessToken: AccessToken, group: NamedGroupCreate): Promise<NamedGroup> {
    if (!this.isSimpleIdentifier(group.displayName)) {
      throw new RequiredError(
        "displayName",
        "Field displayName was invalid.",
      );
    }

    if (this.isNullOrWhitespace(group.query)) {
      throw new RequiredError(
        "query",
        "Required field query was null or undefined.",
      );
    }

    group.metadata && this.validateMetadata(group.metadata);

    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<NamedGroupContainer>(this._baseUrl, requestOptions)).group;
  }

  public async deleteNamedGroup(accessToken: AccessToken, groupId: string): Promise<Response> {
    const url = this.constructUrl(groupId);
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async updateNamedGroup(accessToken: AccessToken, groupId: string, group: NamedGroupUpdate): Promise<NamedGroup> {
    if (null == group.displayName && null == group.description && null == group.query) {
      throw new RequiredError(
        "group",
        "All properties of group were missing.",
      );
    }

    if (null != group.displayName && !this.isSimpleIdentifier(group.displayName)) {
      throw new RequiredError(
        "displayName",
        "Field displayName was invalid.",
      );
    }

    if (null != group.query && this.isNullOrWhitespace(group.query)) {
      throw new RequiredError(
        "query",
        "Required field query was null or undefined.",
      );
    }

    group.metadata && this.validateMetadata(group.metadata);

    const url = this.constructUrl(groupId);
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<NamedGroupContainer>(url, requestOptions)).group;
  }

  public async getNamedGroup(accessToken: AccessToken, groupId: string): Promise<NamedGroup> {
    const url = this.constructUrl(groupId);
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<NamedGroupContainer>(url, requestOptions)).group;
  }

  public async getNamedGroups(accessToken: AccessToken, iTwinId: string, preferReturn?: PreferReturn.Minimal, top?: number): Promise<NamedGroupMinimalList>;
  public async getNamedGroups(accessToken: AccessToken, iTwinId: string, preferReturn: PreferReturn.Representation, top?: number): Promise<NamedGroupList>;
  public async getNamedGroups(accessToken: AccessToken, iTwinId: string, preferReturn?: PreferReturn, top?: number): Promise<NamedGroupMinimalList | NamedGroupList> {
    if (top !== undefined && !this.topIsValid(top)) {
      throw new RequiredError("top", "Parameter top was outside of the valid range [1-1000].");
    }

    const url = this.constructUrl(undefined, iTwinId, top);
    const request = this.createRequest("GET", accessToken, undefined, preferReturn);

    if (preferReturn === PreferReturn.Representation) {
      return this.fetchJSON<NamedGroupList>(url, request);
    } else {
      return this.fetchJSON<NamedGroupMinimalList>(url, request);
    }
  }

  public getNamedGroupsIterator(accessToken: AccessToken, iTwinId: string, preferReturn?: PreferReturn.Minimal, top?: number): EntityListIterator<NamedGroupMinimal>;
  public getNamedGroupsIterator(accessToken: AccessToken, iTwinId: string, preferReturn: PreferReturn.Representation, top?: number): EntityListIterator<NamedGroup>;
  public getNamedGroupsIterator(accessToken: AccessToken, iTwinId: string, preferReturn?: PreferReturn, top?: number): EntityListIterator<NamedGroup> | EntityListIterator<NamedGroupMinimal> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const url = this.constructUrl(undefined, iTwinId, top);
    const request = this.createRequest("GET", accessToken, undefined, preferReturn);

    if (preferReturn === PreferReturn.Representation) {
      return new EntityListIteratorImpl(async () => this.fetchCollection<NamedGroup>(url, request));
    } else {
      return new EntityListIteratorImpl(async () => this.fetchCollection<NamedGroupMinimal>(url, request));
    }
  }

  private async fetchCollection<T extends NamedGroupMinimal | NamedGroup>(url: string, request: RequestInit): Promise<EntityCollectionPage<T>> {
    return getEntityCollectionPage<T>(url, async (nextUrl: string) => {
      const response = await this.fetchJSON<NamedGroupList | NamedGroupMinimalList>(nextUrl, request);
      return {
        values: response.groups as T[],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _links: response._links,
      };
    });
  }

  /**
   * Validates metadata entries.
   * @param entries
   */
  private validateMetadata(entries: NamedGroupMetadata[]): void {
    const seenKeys = new Set<string>();
    entries.forEach((entry, index) => {
      if (this.isNullOrWhitespace(entry.key)) {
        throw new RequiredError(`metadata.key[${index}]`, "Key cannot be empty or consist only of whitespace characters.");
      }
      if (seenKeys.has(entry.key)) {
        throw new RequiredError(`metadata.key[${index}]`, `Duplicate key found: ${entry.key}`);
      }
      seenKeys.add(entry.key);
    });
  }

  protected constructUrl = (groupId?: string, iTwinId?: string, top?: number): string => {
    const base = iTwinId ? `${this._baseUrl}/?iTwinId=${iTwinId}` : `${this._baseUrl}/${groupId ? encodeURIComponent(groupId) : ""}`;
    const query = top && !groupId ? `&$top=${top}` : "";

    return `${base}${query}`;
  };
}
