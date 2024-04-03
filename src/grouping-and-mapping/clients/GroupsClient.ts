/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { OperationsBase } from "../../common/OperationsBase";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { EntityCollectionPage, getEntityCollectionPage } from "../../common/iterators/IteratorUtil";
import { RequiredError } from "../../common/Errors";
import { Group, GroupContainer, GroupCreate, GroupList, GroupMetadata, GroupMinimal, GroupMinimalList, GroupUpdate } from "../interfaces/Groups";
import { IGroupsClient } from "../interfaces/IGroupsClient";
import { AccessToken } from "@itwin/core-bentley";
import { PreferReturn } from "../../common/Common";

export class GroupsClient extends OperationsBase implements IGroupsClient {
  private _baseUrl = `${this.groupingAndMappingBasePath}/datasources/imodel-mappings`;

  public async createGroup(accessToken: AccessToken, mappingId: string, group: GroupCreate): Promise<Group> {
    if (!this.isSimpleIdentifier(group.groupName)) {
      throw new RequiredError(
        "groupName",
        "Field groupName was invalid.",
      );
    }

    if (this.isNullOrWhitespace(group.query)) {
      throw new RequiredError(
        "query",
        "Required field query was null or undefined.",
      );
    }

    group.metadata && this.validateMetadata(group.metadata);

    const url = this.constructUrl(mappingId);
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<GroupContainer>(url, requestOptions)).group;
  }

  public async deleteGroup(accessToken: AccessToken, mappingId: string, groupId: string): Promise<Response> {
    const url = this.constructUrl(mappingId, groupId);
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async updateGroup(accessToken: AccessToken, mappingId: string, groupId: string, group: GroupUpdate): Promise<Group> {
    if (null == group.groupName && null == group.description && null == group.query) {
      throw new RequiredError(
        "group",
        "All properties of group were missing.",
      );
    }

    if (null != group.groupName && !this.isSimpleIdentifier(group.groupName)) {
      throw new RequiredError(
        "groupName",
        "Field groupName was invalid.",
      );
    }

    if (null != group.query && this.isNullOrWhitespace(group.query)) {
      throw new RequiredError(
        "query",
        "Required field query was null or undefined.",
      );
    }

    group.metadata && this.validateMetadata(group.metadata);

    const url = this.constructUrl(mappingId, groupId);
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<GroupContainer>(url, requestOptions)).group;
  }

  public async getGroup(accessToken: AccessToken, mappingId: string, groupId: string): Promise<Group> {
    const url = this.constructUrl(mappingId, groupId);
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<GroupContainer>(url, requestOptions)).group;
  }

  public async getGroups(accessToken: AccessToken, mappingId: string, preferReturn?: PreferReturn.Minimal, top?: number): Promise<GroupMinimalList>;
  public async getGroups(accessToken: AccessToken, mappingId: string, preferReturn: PreferReturn.Representation, top?: number): Promise<GroupList>;
  public async getGroups(accessToken: AccessToken, mappingId: string, preferReturn?: PreferReturn, top?: number): Promise<GroupMinimalList | GroupList> {
    if (top !== undefined && !this.topIsValid(top)) {
      throw new RequiredError("top", "Parameter top was outside of the valid range [1-1000].");
    }

    const url = this.constructUrl(mappingId, undefined, top);
    const request = this.createRequest("GET", accessToken, undefined, preferReturn);

    if (preferReturn === PreferReturn.Representation) {
      return this.fetchJSON<GroupList>(url, request);
    } else {
      return this.fetchJSON<GroupMinimalList>(url, request);
    }
  }

  public getGroupsIterator(accessToken: AccessToken, mappingId: string, preferReturn?: PreferReturn.Minimal, top?: number): EntityListIterator<GroupMinimal>;
  public getGroupsIterator(accessToken: AccessToken, mappingId: string, preferReturn: PreferReturn.Representation, top?: number): EntityListIterator<Group>;
  public getGroupsIterator(accessToken: AccessToken, mappingId: string, preferReturn?: PreferReturn, top?: number): EntityListIterator<Group> | EntityListIterator<GroupMinimal> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }

    const url = this.constructUrl(mappingId, undefined, top);
    const request = this.createRequest("GET", accessToken, undefined, preferReturn);

    if (preferReturn === PreferReturn.Representation) {
      return new EntityListIteratorImpl(async () => this.fetchCollection<Group>(url, request));
    } else {
      return new EntityListIteratorImpl(async () => this.fetchCollection<GroupMinimal>(url, request));
    }
  }

  private async fetchCollection<T extends GroupMinimal | Group>(url: string, request: RequestInit): Promise<EntityCollectionPage<T>> {
    return getEntityCollectionPage<T>(url, async (nextUrl: string) => {
      const response = await this.fetchJSON<GroupList | GroupMinimalList>(nextUrl, request);
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
  private validateMetadata(entries: GroupMetadata[]): void {
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

  /**
   * Construct group endpoint with provided params.
   * @param mappingId Mapping Id.
   * @param groupId Group Id.
   * @param top Optional top number.
   * @returns url endpoint.
   */
  protected constructUrl(mappingId: string, groupId?: string, top?: number): string {
    let url = `${this._baseUrl}/${encodeURIComponent(mappingId)}/groups`;

    if (groupId) {
      url += `/${encodeURIComponent(groupId)}`;
    } else if (top) {
      url += `?$top=${top}`;
    }
    return url;
  }
}
