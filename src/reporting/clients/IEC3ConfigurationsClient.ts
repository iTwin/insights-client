/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { EC3Configuration, EC3ConfigurationCreate, EC3ConfigurationUpdate } from "../interfaces/EC3Configurations";
import type { EntityListIterator } from "../iterators/EntityListIterator";

export interface IEC3ConfigurationsClient {
  /**
   * Gets all EC3 Configurations within the context of a Project. This method returns the full list of EC3 Configurations.
   * @param {string} projectId The project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {number} top The number of entities to load per page.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-ec3-configurations/
   */
  getConfigurations(
    accessToken: AccessToken,
    projectId: string,
    top?: number
  ): Promise<EC3Configuration[]>;

  /**
   * Gets an async paged iterator for EC3 Configurations within the context of a Project.
   * This method returns an iterator which loads pages of EC3 Configurations as it is being iterated over.
   * @param {string} projectId The projectId Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {number} top The number of entities to load per page.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-ec3-configurations/
   */
  getConfigurationsIterator(
    accessToken: AccessToken,
    projectId: string,
    top?: number
  ): EntityListIterator<EC3Configuration>;

  /**
   * Gets a single EC3 Configuration.
   * @param {string} configurationId The EC3 configuration Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-ec3-configuration/
   */
  getConfiguration(
    accessToken: AccessToken,
    configurationId: string
  ): Promise<EC3Configuration>;

  /**
   * Creates an EC3 Configuration within the context of a Project.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {ConfigurationCreate} configuration Request body.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/create-ec3-job/
   */
  createConfiguration(
    accessToken: AccessToken,
    configuration: EC3ConfigurationCreate
  ): Promise<EC3Configuration>;

  /**
   * Updates an EC3 Configuration.
   * @param {string} configurationId The EC3 configuration Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {ConfigurationUpdate} configuration Request body.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/update-ec3-configuration/
   */
  updateConfiguration(
    accessToken: AccessToken,
    configurationId: string,
    configuration: EC3ConfigurationUpdate
  ): Promise<EC3Configuration>;

  /**
   * Deletes an EC3 Configuration.
   * @param {string} configurationId The EC3 configuration Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/delete-ec3-configuration/
   */
  deleteConfiguration(
    accessToken: AccessToken,
    configurationId: string
  ): Promise<Response>;
}
