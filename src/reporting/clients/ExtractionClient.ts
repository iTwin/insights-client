/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { OperationsBase } from "../OperationsBase";
import { ExtractionLog, ExtractionLogCollection, ExtractionRun, ExtractionRunSingle, ExtractionStatus, ExtractionStatusSingle } from "../interfaces/ExtractionProcess";

export interface ExtractionClientInterface {
  getExtractionLogs(
    accessToken: AccessToken,
    jobId: string,
    top?: number
  ): Promise<ExtractionLog[]>,
  getExtractionLogsIterator(
    accessToken: AccessToken,
    jobId: string,
    top?: number
  ): EntityListIterator<ExtractionLog>,
  runExtraction(
    accessToken: AccessToken,
    iModelId: string
  ): Promise<ExtractionRun>,
  getExtractionStatus(
    accessToken: AccessToken,
    jobId: string
  ): Promise<ExtractionStatus>,
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
  public async getExtractionLogs(accessToken: AccessToken, jobId: string, top?: number): Promise<ExtractionLog[]> {
    const logs: Array<ExtractionLog> = [];
    const logIterator = this.getExtractionLogsIterator(accessToken, jobId, top);
    for await(const log of logIterator) {
      logs.push(log);
    }
    return logs;
  }

  /**
   * Gets an async paged iterator of logs for an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-logs/
   */
  public getExtractionLogsIterator(accessToken: AccessToken, jobId: string, top?: number): EntityListIterator<ExtractionLog> {
    let url = `${this.basePath}/datasources/extraction/status/${encodeURIComponent(jobId)}/logs`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ExtractionLog>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<Collection<ExtractionLog>> => {
        const response: ExtractionLogCollection = await this.fetchData(url, requestOptions);
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
  public async runExtraction(accessToken: AccessToken, iModelId: string): Promise<ExtractionRun> {
    const url = `${this.basePath}/datasources/imodels/${iModelId}/extraction/run`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken);
    return (await this.fetchData<ExtractionRunSingle>(url, requestOptions)).run;
  }

  /**
   * Gets the Status of an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-status/
   */
  public async getExtractionStatus(accessToken: AccessToken, jobId: string): Promise<ExtractionStatus> {
    const url = `${this.basePath}/datasources/extraction/status/${encodeURIComponent(jobId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchData<ExtractionStatusSingle>(url, requestOptions)).status;
  }
}