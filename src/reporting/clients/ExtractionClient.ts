/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { BASE_PATH, OperationsBase } from "../OperationsBase";
import { ExtractionLog, ExtractionLogCollection, ExtractionRun, ExtractionStatusSingle } from "../interfaces/ExtractionProcess";

export interface ExtractionClientInterface {
  getExtractionLogs(
    accessToken: AccessToken,
    jobId: string,
    top?: number
  ): Promise<ExtractionLog[]>,
  runExtraction(
    accessToken: AccessToken,
    iModelId: string
  ): Promise<ExtractionRun>,
  getExtractionStatus(
    accessToken: AccessToken,
    jobId: string
  ): Promise<ExtractionStatusSingle>,
}

export class ExtractionClient extends OperationsBase implements ExtractionClientInterface {
  /**
   * Gets Logs of an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-logs/
   */
  public async getExtractionLogs(accessToken: AccessToken, jobId: string, top?: number) {
    const logs: Array<ExtractionLog> = [];
    const logIterator = this.getExtractionLogsIterator(accessToken, jobId, top);
    for await(const log of logIterator) {
      logs.push(log);
    }
    return logs;
  }

  public getExtractionLogsIterator(accessToken: AccessToken, jobId: string, top?: number): EntityListIterator<ExtractionLog> {
    let url: string = `${BASE_PATH}/datasources/extraction/status/${encodeURIComponent(jobId)}/logs`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ExtractionLog>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<collection> => {
        let response: ExtractionLogCollection = await this.fetch(url, requestOptions);
        return {
          values: response.logs,
          _links: response._links,
        }
    }));
  }

  /**
   * Manually run Extraction of data from an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/run-extraction/
   */
  public runExtraction(accessToken: AccessToken, iModelId: string): Promise<ExtractionRun> {
    const url = `${BASE_PATH}/datasources/imodels/${iModelId}/extraction/run`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken);
    return this.fetch(url, requestOptions);
  }

  /**
   * Gets the Status of an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-status/
   */
  public async getExtractionStatus(accessToken: AccessToken, jobId: string): Promise<ExtractionStatusSingle> {
    const url = `${BASE_PATH}/datasources/extraction/status/${encodeURIComponent(jobId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return this.fetch(url, requestOptions);
  }
}