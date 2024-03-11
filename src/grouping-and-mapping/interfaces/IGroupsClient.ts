/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { Group, GroupCreate, GroupList, GroupUpdate  } from "./Groups";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";

export interface IGroupsClient {
  /**
    * Creates a Group for a Mapping.
    * @param {string} accessToken OAuth access token with imodels:modify or itwin-platform scope.
    * @param {string} mappingId The Mapping Id.
    * @param {GroupCreate} group Request body.
    * @memberof GroupsClient
    * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/create-group/
    */
  createGroup( accessToken: AccessToken, mappingId: string, group: GroupCreate): Promise<Group>;

  /**
   * Deletes a Group for a Mapping.
   * @param {string} accessToken OAuth access token with imodels:modify or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @memberof GroupsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/delete-group/
   */
  deleteGroup(accessToken: AccessToken, mappingId: string, groupId: string): Promise<Response>;

  /**
   * Updates a Group for a Mapping.
   * @param {string} accessToken OAuth access token with imodels:modify or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {GroupUpdate} group Request body.
   * @memberof GroupsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/update-group/
   */
  updateGroup( accessToken: AccessToken, mappingId: string, groupId: string, group: GroupUpdate): Promise<Group>;

  /**
   * Gets a Group for a Mapping.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @memberof GroupsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-group/
   */
  getGroup(accessToken: AccessToken, mappingId: string, groupId: string): Promise<Group>;

  /**
   * Gets all Groups for a Mapping. This method returns the full list of groups.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof GroupsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-groups/
   */
  getGroups(accessToken: AccessToken,  mappingId: string, top?: number): Promise<GroupList>;

  /**
   * Gets an async paged iterator of Groups for a Mapping.
   * This method returns an iterator which loads pages of groups as it is being iterated over.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof GroupsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-groups/
   */
  getGroupsIterator(accessToken: AccessToken, mappingId: string, top?: number): EntityListIterator<Group>;
}
