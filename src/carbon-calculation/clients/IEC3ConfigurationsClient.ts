/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { EC3Configuration, EC3ConfigurationMinimal, EC3ExtractionConfigurationCreate, EC3ExtractionConfigurationUpdate, EC3ReportConfigurationCreate, EC3ReportConfigurationUpdate } from "../interfaces/EC3Configurations";
import type { EntityListIterator } from "../../common/iterators/EntityListIterator";

export interface IEC3ConfigurationsClient {
  /**
   * Gets all EC3 Configurations within the context of a Project. This method returns the full list of EC3 Configurations.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} projectId The project Id.
   * @param {number} top The number of entities to load per page.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-ec3-configurations/
   */
  getConfigurations(
    accessToken: AccessToken,
    projectId: string,
    top?: number
  ): Promise<EC3ConfigurationMinimal[]>;

  /**
   * Gets an async paged iterator for EC3 Configurations within the context of a Project.
   * This method returns an iterator which loads pages of EC3 Configurations as it is being iterated over.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} projectId The project Id.
   * @param {number} top The number of entities to load per page.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-ec3-configurations/
   */
  getConfigurationsIterator(
    accessToken: AccessToken,
    projectId: string,
    top?: number
  ): EntityListIterator<EC3ConfigurationMinimal>;

  /**
   * Gets a single EC3 Configuration.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} configurationId The EC3 configuration Id.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-ec3-configuration/
   */
  getConfiguration(
    accessToken: AccessToken,
    configurationId: string
  ): Promise<EC3Configuration>;

  /**
   * Creates an EC3 Configuration within the context of a Project.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {EC3ReportConfigurationCreate | EC3ExtractionConfigurationCreate} configuration Request body.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/create-ec3-configuration/
   */
  createConfiguration(
    accessToken: AccessToken,
    configuration: EC3ReportConfigurationCreate | EC3ExtractionConfigurationCreate
  ): Promise<EC3Configuration>;

  /**
   * Updates an EC3 Configuration.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} configurationId The EC3 configuration Id.
   * @param {EC3ReportConfigurationUpdate | EC3ExtractionConfigurationUpdate} configuration Request body.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/update-ec3-configuration/
   */
  updateConfiguration(
    accessToken: AccessToken,
    configurationId: string,
    configuration: EC3ReportConfigurationUpdate | EC3ExtractionConfigurationUpdate
  ): Promise<EC3Configuration>;

  /**
   * Deletes an EC3 Configuration.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} configurationId The EC3 configuration Id.
   * @memberof IEC3ConfigurationsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/delete-ec3-configuration/
   */
  deleteConfiguration(
    accessToken: AccessToken,
    configurationId: string
  ): Promise<Response>;
}
