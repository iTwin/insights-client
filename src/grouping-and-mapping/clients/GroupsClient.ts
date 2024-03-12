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
import { AccessToken } from "@itwin/core-bentley";

export class GroupsClient extends OperationsBase  implements IGroupsClient {
  private _baseUrl = `${this.groupingAndMappingBasePath}/datasources/imodel-mappings`;

  public async createGroup(accessToken: AccessToken, mappingId: string, group: GroupCreate): Promise<Group> {
    if (!this.isSimpleIdentifier(group.groupName)) {
      throw new RequiredError(
        "groupName",
        "Field groupName was invalid.",
      );
    }

    if(this.isNullOrWhitespace(group.query)) {
      throw new RequiredError(
        "query",
        "Required field query was null or undefined.",
      );
    }

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

    const url = this.constructUrl(mappingId, groupId);
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<GroupContainer>(url, requestOptions)).group;
  }

  public async getGroup(accessToken: AccessToken, mappingId: string, groupId: string): Promise<Group> {
    const url = this.constructUrl(mappingId, groupId);
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<GroupContainer>(url, requestOptions)).group;
  }

  public async getGroups(accessToken: AccessToken,  mappingId: string, top?: number ): Promise<GroupList> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }

    const url = this.constructUrl(mappingId, undefined, top);
    const request = this.createRequest("GET", accessToken);
    const response =  await this.fetchJSON<GroupList>(url, request);
    return response;
  }

  public getGroupsIterator(accessToken: AccessToken,  mappingId: string, top?: number ): EntityListIterator<Group> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }

    const url = this.constructUrl(mappingId, undefined, top);
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

  /**
   * Construct group endpoint with provided params.
   * @param mappingId Mapping Id.
   * @param groupId Group Id.
   * @param top Optional top number.
   * @returns url endpoint.
   */
  protected constructUrl(mappingId: string, groupId?: string, top?: number): string {
    let url = `${this._baseUrl}/${encodeURIComponent(mappingId)}/groups`;

    if(groupId){
      url += `/${encodeURIComponent(groupId)}`;
    }else if(top){
      url += `?$top=${top}`;
    }
    return url;
  }
}
