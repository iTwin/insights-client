/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { OperationsBase } from "../../common/OperationsBase";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../../common/iterators/IteratorUtil";
import { RequiredError } from "../../common/Errors";
import { Group, GroupContainer, GroupCreate, GroupList, GroupUpdate } from "../interfaces/Groups";
import { IGroupsClient } from "../interfaces/IGroupsClient";

export class GroupsClient extends OperationsBase  implements IGroupsClient {
  private _groupsUrl = `${this.groupingAndMappingBasePath}/datasources/imodel-mappings`;

  public async createGroup(accessToken: string, mappingId: string, group: GroupCreate): Promise<Group> {
    if (!this.isSimpleIdentifier(group.groupName)) {
      throw new RequiredError(
        "mappingName",
        "Required field mappingName was missing or invalid.",
      );
    }

    if(this.isNullOrWhitespace(group.query)) {
      throw new RequiredError(
        "query",
        "Required field query was null or undefined.",
      );
    }

    const url = `${this._groupsUrl}/${encodeURIComponent(mappingId)}/groups`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<GroupContainer>(url, requestOptions)).group;
  }

  public async deleteGroup(accessToken: string, mappingId: string, groupId: string): Promise<Response> {
    const url = `${this._groupsUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async updateGroup(accessToken: string, mappingId: string, groupId: string, group: GroupUpdate): Promise<Group> {
    if(null == group.groupName && null == group.description && null == group.query) {
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

    const url = `${this._groupsUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<GroupContainer>(url, requestOptions)).group;
  }

  public async getGroup(accessToken: string, mappingId: string, groupId: string): Promise<Group> {
    const url = `${this._groupsUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<GroupContainer>(url, requestOptions)).group;
  }

  public async getGroups(accessToken: string,  mappingId: string, top?: number | undefined): Promise<GroupList> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }

    const url = top ? `${this._groupsUrl}/${encodeURIComponent(mappingId)}/groups?$top=${top}` : `${this._groupsUrl}/${encodeURIComponent(mappingId)}/groups`;
    const request = this.createRequest("GET", accessToken);
    const response =  await this.fetchJSON<GroupList>(url, request);
    return response;
  }

  public getGroupsIterator(accessToken: string,  mappingId: string, top?: number | undefined): EntityListIterator<Group> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    const url = top ? `${this._groupsUrl}/${encodeURIComponent(mappingId)}/groups?$top=${top}` : `${this._groupsUrl}/${encodeURIComponent(mappingId)}/groups`;
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Group>( url, async (nextUrl: string): Promise<Collection<Group>> => {
      const response = await this.fetchJSON<GroupList>(nextUrl, request);
      return {
        values: response.groups,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _links: response._links,
      };
    }));
  }
}
