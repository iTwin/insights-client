/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { EC3Configuration, EC3ConfigurationCreate, EC3ConfigurationUpdate } from "../interfaces/EC3Configurations";
import type { EntityListIterator } from "../iterators/EntityListIterator";

export interface IEC3ConfigurationClient {
  /**
   * Gets all EC3 Configurations for an iModel. This method returns the full list of EC3 Configurations.
   * @param {string} iModelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {number} top The number of entities to load per page.
   * @memberof IEC3ConfigurationClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
  getConfigurations(
    accessToken: AccessToken,
    iModelId: string,
    top?: number
  ): Promise<EC3Configuration[]>;

  /**
   * Gets an async paged iterator of EC3 Configurations for an iModel.
   * This method returns an iterator which loads pages of mappings as it is being iterated over.
   * @param {string} iModelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {number} top The number of entities to load per page.
   * @memberof IEC3ConfigurationClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
  getConfigurationsIterator(
    accessToken: AccessToken,
    iModelId: string,
    top?: number
  ): EntityListIterator<EC3Configuration>;

  /**
   * Gets an EC3 Configuration for an iModel.
   * @param {string} configurationId The EC3 configuration Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @memberof IEC3ConfigurationClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mapping/
   */
  getConfiguration(
    accessToken: AccessToken,
    configurationId: string
  ): Promise<EC3Configuration>;

  /**
   * Creates an EC3 Configuration for an iModel.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {ConfigurationCreate} configuration Request body.
   * @memberof IEC3ConfigurationClient
   * @link https://developer.bentley.com/apis/insights/operations/create-mapping/
   */
  createConfiguration(
    accessToken: AccessToken,
    configuration: EC3ConfigurationCreate
  ): Promise<EC3Configuration>;

  /**
   * Updates an EC3 Configuration for an iModel.
   * @param {string} configurationId The EC3 configuration Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {ConfigurationUpdate} configuration Request body.
   * @memberof IEC3ConfigurationClient
   * @link https://developer.bentley.com/apis/insights/operations/update-mapping/
   */
  updateConfiguration(
    accessToken: AccessToken,
    configurationId: string,
    configuration: EC3ConfigurationUpdate
  ): Promise<EC3Configuration>;

  /**
   * Deletes an EC3 Configuration for an iModel.
   * @param {string} configurationId The EC3 configuration Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @memberof IEC3ConfigurationClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-mapping/
   */
  deleteConfiguration(
    accessToken: AccessToken,
    configurationId: string
  ): Promise<Response>;
}
