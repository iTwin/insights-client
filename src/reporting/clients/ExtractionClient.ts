/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { OperationsBase } from "../OperationsBase";
import type { ExtractionLog, ExtractionLogCollection, ExtractionRun, ExtractionRunSingle, ExtractionStatus, ExtractionStatusSingle } from "../interfaces/ExtractionProcess";
import type { IExtractionClient } from "./IExtractionClient";
import { RequiredError } from "../interfaces/Errors";

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
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000] when calling getExtractionLogsIterator."
      );
    }
    let url = `${this.basePath}/datasources/extraction/status/${encodeURIComponent(jobId)}/logs`;
    url += top ? `/?$top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ExtractionLog>(
      url,
      async (nextUrl: string): Promise<Collection<ExtractionLog>> => {
        const response: ExtractionLogCollection = await this.fetchJSON(nextUrl, request);
        return {
          values: response.logs,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: response._links,
        };
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
