/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { Property, PropertyModify } from "./Properties";

export interface IPropertiesClient {

  /**
    * Creates a property. If group is a table, then property of that group is a column.
    * Properties can be mapped from existing iModel ECProperties, calculated using a predefined list of calculations, or calculated using your own mathematical formula.
    * @param {string} accessToken OAuth access token with scope `insights:modify`.
    * @param {string} mappingId The Mapping Id.
    * @param {string} groupId The Group Id.
    * @param {PropertyModify} property Request body.
    * @memberof PropertyClient
    * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/create-property/
    */
  createProperty( accessToken: AccessToken, mappingId: string, groupId: string, property: PropertyModify): Promise<Property>;

  /**
    * Deletes a property from a Group.
    * @param {string} accessToken OAuth access token with scope `insights:modify`.
    * @param {string} mappingId The Mapping Id.
    * @param {string} groupId The Group Id.
    * @param {string} propertyId The Group Property Id.
    * @memberof ReportingClient
    * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/delete-property/
    */
  deleteProperty( accessToken: AccessToken, mappingId: string, groupId: string, propertyId: string): Promise<Response>;

}
