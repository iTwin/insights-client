/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { ExtractionLogsResponse, ExtractionRequestDetails, ExtractionsResponse, ExtractionStatus } from "./Extraction";

export interface IExtractionClient {
  /**
   * Manually run Extraction of data from an iModel.
   * @param {string} accessToken OAuth access token with imodels:modify or itwin-platform scope.
   * @param {ExtractionRunRequest} extractionRequestDetails Extraction properties.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/run-extraction/
   */
  runExtraction( accessToken: AccessToken, extractionRequestDetails: ExtractionRequestDetails ): Promise<ExtractionStatus>;

  /**
   * Gets the status of an extraction.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} extractionId The extraction Id.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-extraction-status/
   */
  getExtractionStatus(accessToken: AccessToken, extractionId: string): Promise<ExtractionStatus>;

  /**
   * Gets all of the extractions that were run on a given iModel.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} iModelId The extraction Id.
   * @param {top} top Optional max items to be sent in response.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-imodel-extractions/
   */
  getIModelExtractions(accessToken: AccessToken, iModelId: string, top?: number): Promise<ExtractionsResponse>;

  /**
   * Gets the logs of an extraction.
   * @param accessToken OAuth access token with imodels:read or itwin-platform scope
   * @param extractionId The extraction Id.
   * @param top Optional max items to be sent in response.
   */
  getExtractionLogs(accessToken: AccessToken, extractionId: string, top?: number): Promise<ExtractionLogsResponse>;

}
