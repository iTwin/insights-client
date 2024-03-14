/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { ExtractionLogEntry, ExtractionLogsResponse, ExtractionRequestDetails, ExtractionsResponse, ExtractionStatus } from "./Extraction";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";

export interface IExtractionClient {
  /**
   * Manually run Extraction of data from an iModel.
   * @param {AccessToken} accessToken OAuth access token with imodels:modify or itwin-platform scope.
   * @param {ExtractionRunRequest} extractionRequestDetails Extraction properties.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/run-extraction/
   */
  runExtraction(accessToken: AccessToken, extractionRequestDetails: ExtractionRequestDetails): Promise<ExtractionStatus>;

  /**
   * Gets the status of an extraction.
   * @param {AccessToken} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} extractionId The extraction Id.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-extraction-status/
   */
  getExtractionStatus(accessToken: AccessToken, extractionId: string): Promise<ExtractionStatus>;

  /**
   * Gets all of the extractions that were run on a given iModel.
   * @param {AccessToken} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} iModelId The iModel Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-imodel-extractions/
   */
  getIModelExtractions(accessToken: AccessToken, iModelId: string, top?: number): Promise<ExtractionsResponse>;

  /**
   * Gets an async paged iterator of IModel extractions.
   * @param {AccessToken} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} iModelId The iModel Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-imodel-extractions/
   */
  getIModelExtractionsIterator(accessToken: AccessToken, iModelId: string, top?: number): EntityListIterator<ExtractionStatus>;

  /**
   * Gets the logs of an extraction.
   * @param {AccessToken} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} extractionId The extraction Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-extraction-logs/
   */
  getExtractionLogs(accessToken: AccessToken, extractionId: string, top?: number): Promise<ExtractionLogsResponse>;

  /**
   * Gets an async paged iterator of the logs of an extraction.
   * @param {AccessToken} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} extractionId The extraction Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof ExtractionClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-extraction-logs/
   */
  getExtractionLogsIterator(accessToken: AccessToken, extractionId: string, top?: number): EntityListIterator<ExtractionLogEntry>;
}
