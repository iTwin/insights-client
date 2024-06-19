/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { OperationsBase } from "../../common/OperationsBase";
import { ExtractionContainer, ExtractionLogEntry, ExtractionLogsResponse, ExtractionRequestDetails, ExtractionsResponse, ExtractionStatus } from "../interfaces/Extraction";
import { IExtractionClient } from "../interfaces/IExtractionClient";
import { RequiredError } from "../../common/Errors";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../../common/iterators/IteratorUtil";

export class ExtractionClient extends OperationsBase implements IExtractionClient {
  private _baseUrl = `${this.groupingAndMappingBasePath}/datasources/imodel-mappings/extractions`;

  public async runExtraction(accessToken: AccessToken, extractionRequestDetails: ExtractionRequestDetails): Promise<ExtractionStatus> {
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(extractionRequestDetails));
    return (await this.fetchJSON<ExtractionContainer>(this._baseUrl, requestOptions)).extraction;
  }

  public async getExtractionStatus(accessToken: AccessToken, extractionId: string): Promise<ExtractionStatus> {
    const url = `${this._baseUrl}/${encodeURIComponent(extractionId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<ExtractionContainer>(url, requestOptions)).extraction;
  }

  public async getIModelExtractions(accessToken: AccessToken, iModelId: string, top?: number): Promise<ExtractionsResponse> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const url = `${this._baseUrl}?iModelId=${iModelId}${top ? `&$top=${top}` : `` }`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<ExtractionsResponse>(url, requestOptions);
    return response;
  }

  public getIModelExtractionsIterator(accessToken: AccessToken, iModelId: string, top?: number): EntityListIterator<ExtractionStatus> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const url = `${this._baseUrl}?iModelId=${iModelId}${top ? `&$top=${top}` : `` }`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ExtractionStatus>( url, async (nextUrl: string): Promise<Collection<ExtractionStatus>> => {
      const response = await this.fetchJSON<ExtractionsResponse>(nextUrl, requestOptions);
      return {
        values: response.extractions,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _links: response._links,
      };
    }));
  }

  public async getExtractionLogs(accessToken: AccessToken, extractionId: string, top?: number): Promise<ExtractionLogsResponse> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const url = `${this._baseUrl}/${encodeURIComponent(extractionId)}/logs${top ? `?$top=${top}` : `` }`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<ExtractionLogsResponse>(url, requestOptions);
    return response;
  }

  public getExtractionLogsIterator(accessToken: AccessToken, extractionId: string, top?: number): EntityListIterator<ExtractionLogEntry> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const url = `${this._baseUrl}/${encodeURIComponent(extractionId)}/logs${top ? `?$top=${top}` : `` }`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ExtractionLogEntry>( url, async (nextUrl: string): Promise<Collection<ExtractionLogEntry>> => {
      const response = await this.fetchJSON<ExtractionLogsResponse>(nextUrl, requestOptions);
      return {
        values: response.logs,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _links: response._links,
      };
    }));
  }
}
