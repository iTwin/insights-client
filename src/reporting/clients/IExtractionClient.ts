/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { ExtractionLog, ExtractionRun, ExtractionStatus } from "../interfaces/ExtractionProcess";
import { EntityListIterator } from "../iterators/EntityListIterator";

export interface IExtractionClient {
  /**
   * Gets Logs of an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-logs/
   */
  getExtractionLogs(
    accessToken: AccessToken,
    jobId: string,
    top?: number
  ): Promise<ExtractionLog[]>,
  /**
   * Gets an async paged iterator of logs for an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-logs/
   */
  getExtractionLogsIterator(
    accessToken: AccessToken,
    jobId: string,
    top?: number
  ): EntityListIterator<ExtractionLog>,
  /**
   * Manually run Extraction of data from an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/run-extraction/
   */
  runExtraction(
    accessToken: AccessToken,
    iModelId: string
  ): Promise<ExtractionRun>,
  /**
   * Gets the Status of an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-status/
   */
  getExtractionStatus(
    accessToken: AccessToken,
    jobId: string
  ): Promise<ExtractionStatus>,
}