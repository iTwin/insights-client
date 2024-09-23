/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { NamedGroup, NamedGroupCreate, NamedGroupList, NamedGroupMinimal, NamedGroupMinimalList, NamedGroupUpdate } from "./NamedGroups";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { PreferReturn } from "../../common/Common";

export interface INamedGroupsClient {
  /**
    * Creates a NamedGroup for an iTwin.
    * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
    * @param {NamedGroupCreate} group Request body.
    * @memberof NamedGroupsClient
    * @link https://developer.bentley.com/apis/named-groups/operations/create-group/
    */
  createNamedGroup(accessToken: AccessToken, group: NamedGroupCreate): Promise<NamedGroup>;

  /**
   * Deletes a NamedGroup for an iTwin.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} groupId The NamedGroup Id.
   * @memberof NamedGroupsClient
   * @link https://developer.bentley.com/apis/named-groups/operations/delete-group/
   */
  deleteNamedGroup(accessToken: AccessToken, groupId: string): Promise<Response>;

  /**
   * Updates a NamedGroup for an iTwin.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} groupId The NamedGroup Id.
   * @param {NamedGroupUpdate} group Request body.
   * @memberof NamedGroupsClient
   * @link https://developer.bentley.com/apis/named-groups/operations/update-group/
   */
  updateNamedGroup(accessToken: AccessToken, groupId: string, group: NamedGroupUpdate): Promise<NamedGroup>;

  /**
   * Gets a NamedGroup for an iTwin.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} groupId The NamedGroup Id.
   * @memberof NamedGroupsClient
   * @link https://developer.bentley.com/apis/named-groups/operations/get-group/
   */
  getNamedGroup(accessToken: AccessToken, groupId: string): Promise<NamedGroup>;

  /**
   * Gets all NamedGroups for an iTwin. This method returns the full list of minimal groups.
   * @param accessToken accessToken OAuth access token with scope `itwin-platform`.
   * @param iTwinId iTwinId The iTwin Id.
   * @param preferReturn Specifies the level of detail of the returned group information. Defaults to minimal information if not provided.
   * @param top Optional max items to be sent in response.
   * @memberof NamedGroupsClient
   * @link https://developer.bentley.com/apis/named-groups/operations/get-itwin-groups/
   */
  getNamedGroups(accessToken: AccessToken, iTwinId: string, preferReturn?: PreferReturn.Minimal, top?: number): Promise<NamedGroupMinimalList>;

  /**
     * Gets all NamedGroups for an iTwin. This method returns the full list of NamedGroups representations.
     * @param accessToken accessToken OAuth access token with scope `itwin-platform`.
     * @param iTwinId iTwinId The iTwin Id.
     * @param preferReturn Specifies the level of detail of the returned group information. Defaults to minimal information if not provided.
     * @param top Optional max items to be sent in response.
     * @memberof NamedGroupsClient
     * @link https://developer.bentley.com/apis/named-groups/operations/get-itwin-groups/
     */
  getNamedGroups(accessToken: AccessToken, iTwinId: string, preferReturn: PreferReturn.Representation, top?: number): Promise<NamedGroupList>;

  /**
   * Gets an async paged iterator of minimal NamedGroups for an iTwin.
   * This method returns an iterator which loads pages of groups as it is being iterated over.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} iTwinId The iTwin Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof NamedGroupsClient
   * @link https://developer.bentley.com/apis/named-groups/operations/get-itwin-groups/
   */
  getNamedGroupsIterator(accessToken: AccessToken, iTwinId: string, preferReturn?: PreferReturn.Minimal, top?: number): EntityListIterator<NamedGroupMinimal>;

  /**
   * Gets an async paged iterator of NamedGroups representations for an iTwin.
   * This method returns an iterator which loads pages of groups as it is being iterated over.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} iTwinId The iTwin Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof NamedGroupsClient
   * @link https://developer.bentley.com/apis/named-groups/operations/get-itwin-groups/
   */
  getNamedGroupsIterator(accessToken: AccessToken, iTwinId: string, preferReturn: PreferReturn.Representation, top?: number): EntityListIterator<NamedGroup>;

}
