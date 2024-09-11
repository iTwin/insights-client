/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { CDM } from "./CDM";

export interface ICDMClient {
  /**
   * Gets the data model of extracted data in Common Data Model (CDM) format.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} mappingId The mapping Id.
   * @param {string} extractionId The extraction Id.
   * @memberof CDMClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-cdm/
   */
  getCDM(accessToken: AccessToken, mappingId: string, extractionId: string): Promise<CDM>;

  /**
   * Gets the extracted data in CSV format.
   * CSV column order matches the entity attribute order returned by the Get CDM operation.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} mappingId The mapping Id.
   * @param {string} extractionId The extraction Id.
   * @param {string} location
   * @memberof CDMClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-cdm-partition/
   */
  getCDMPartition(accessToken: AccessToken, mappingId: string, extractionId: string, location: string): Promise<Response>;
}
