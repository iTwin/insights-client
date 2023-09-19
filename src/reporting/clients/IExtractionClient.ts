/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { Extraction, ExtractionLog, ExtractionRun, ExtractionRunRequest, ExtractionStatus } from "../interfaces/ExtractionProcess";
import type { EntityListIterator } from "../../common/iterators/EntityListIterator";

export interface IExtractionClient {
  /**
   * Gets Logs of an Extraction Run. This method returns the full list of extraction logs.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-logs/
   */
  getExtractionLogs(
    accessToken: AccessToken,
    jobId: string,
    top?: number
  ): Promise<ExtractionLog[]>;

  /**
   * Gets an async paged iterator of logs for an Extraction Run.
   * This method returns an iterator which loads pages of extraction logs as it is being iterated over.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-logs/
   */
  getExtractionLogsIterator(
    accessToken: AccessToken,
    jobId: string,
    top?: number
  ): EntityListIterator<ExtractionLog>;

  /**
   * Manually run Extraction of data from an iModel.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {ExtractionRunRequest | undefined} extractionRequest Extraction properties.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/run-extraction/
   */
  runExtraction(
    accessToken: AccessToken,
    iModelId: string,
    extractionRequest: ExtractionRunRequest | undefined
  ): Promise<ExtractionRun>;

  /**
   * Gets the Status of an Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-status/
   */
  getExtractionStatus(
    accessToken: AccessToken,
    jobId: string
  ): Promise<ExtractionStatus>;

  /**
   * Gets Extractions of an IModel. This method returns the full list of Extractions.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-history/
   */
  getExtractionHistory(
    accessToken: AccessToken,
    iModelId: string,
    top?: number
  ): Promise<Extraction[]>;

  /**
   * Gets an async paged iterator of Extractions for an IModel.
   * This method returns an iterator which loads pages of extractions as it is being iterated over.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-history/
   */
  getExtractionHistoryIterator(
    accessToken: AccessToken,
    iModelId: string,
    top?: number
  ): EntityListIterator<Extraction>;
}
