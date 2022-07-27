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
import { IExtractionClient } from "./IExtractionClient";

export class ExtractionClient extends OperationsBase implements IExtractionClient {
  public async getExtractionLogs(accessToken: AccessToken, jobId: string, top?: number): Promise<ExtractionLog[]> {
    const logs: Array<ExtractionLog> = [];
    const logIterator = this.getExtractionLogsIterator(accessToken, jobId, top);
    for await(const log of logIterator) {
      logs.push(log);
    }
    return logs;
  }

  public getExtractionLogsIterator(accessToken: AccessToken, jobId: string, top?: number): EntityListIterator<ExtractionLog> {
    this.topInRangeValidation(top);
    let url = `${this.basePath}/datasources/extraction/status/${encodeURIComponent(jobId)}/logs`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ExtractionLog>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<Collection<ExtractionLog>> => {
        const response: ExtractionLogCollection = await this.fetchJSON(url, requestOptions);
        return {
          values: response.logs,
          _links: response._links,
        }
    }));
  }

  public async runExtraction(accessToken: AccessToken, iModelId: string): Promise<ExtractionRun> {
    const url = `${this.basePath}/datasources/imodels/${iModelId}/extraction/run`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken);
    return (await this.fetchJSON<ExtractionRunSingle>(url, requestOptions)).run;
  }

  public async getExtractionStatus(accessToken: AccessToken, jobId: string): Promise<ExtractionStatus> {
    const url = `${this.basePath}/datasources/extraction/status/${encodeURIComponent(jobId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<ExtractionStatusSingle>(url, requestOptions)).status;
  }
}