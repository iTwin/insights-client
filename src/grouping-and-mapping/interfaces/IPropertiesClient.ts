/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { Property, PropertyList, PropertyModify } from "./Properties";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";

export interface IPropertiesClient {

  /**
    * Creates a property. If group is a table, then property of that group is a column.
    * Properties can be mapped from existing iModel ECProperties, calculated using a predefined list of calculations, or calculated using your own mathematical formula.
    * @param {AccessToken} accessToken OAuth access token with imodels:modify or itwin-platform scope.
    * @param {string} mappingId The Mapping Id.
    * @param {string} groupId The Group Id.
    * @param {PropertyModify} property Request body.
    * @memberof PropertiesClient
    * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/create-property/
    */
  createProperty( accessToken: AccessToken, mappingId: string, groupId: string, property: PropertyModify): Promise<Property>;

  /**
    * Deletes a property from a Group.
    * @param {AccessToken} accessToken OAuth access token with imodels:modify or itwin-platform scope.
    * @param {string} mappingId The Mapping Id.
    * @param {string} groupId The Group Id.
    * @param {string} propertyId The Group Property Id.
    * @memberof PropertiesClient
    * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/delete-property/
    */
  deleteProperty( accessToken: AccessToken, mappingId: string, groupId: string, propertyId: string): Promise<Response>;

  /**
   * Gets a Property for a Group.
   * @param {AccessToken} accessToken OAuth access token with scope `imodels:read`.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The GroupProperty Id.
   * @memberof PropertiesClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-property/
   */
  getProperty( accessToken: AccessToken, mappingId: string, groupId: string, propertyId: string): Promise<Property>;

  /**
   * Gets properties for a Group. This method returns the full list of group properties.
   * @param {AccessToken} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {number} top The number of entities to load per page.
   * @memberof PropertiesClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-properties/
   */
  getProperties( accessToken: AccessToken, mappingId: string, groupId: string, top?: number): Promise<PropertyList>;

  /**
   * Gets an async paged iterator of properties for a Group.
   * @param {AccessToken} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {number} top The number of entities to load per page.
   * @memberof PropertiesClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-properties/
   */
  getPropertiesIterator(accessToken: AccessToken, mappingId: string, groupId: string, top?: number ): EntityListIteratorImpl<Property>;

  /**
   * Updates a Property for a Group.
   * @param {AccessToken} accessToken OAuth access token with imodels:modify or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The Group Property Id.
   * @param {PropertyUpdate} propertyUpdate Request body.
   * @memberof PropertiesClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/update-property/
   */
  updateProperty( accessToken: AccessToken, mappingId: string, groupId: string, propertyId: string, propertyUpdate: PropertyModify): Promise<Property>;

}
