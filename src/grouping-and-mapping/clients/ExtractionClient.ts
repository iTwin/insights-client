/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { OperationsBase } from "../../common/OperationsBase";
import { ExtractionContainer, ExtractionLogsResponse, ExtractionRequestDetails, ExtractionsResponse, ExtractionStatus } from "../interfaces/Extraction";
import { IExtractionClient } from "../interfaces/IExtractionClient";
import { RequiredError } from "../../common/Errors";

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
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    const url = `${this._baseUrl}?iModelId=${iModelId}${top ? `&$top=${top}` : `` }`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<ExtractionsResponse>(url, requestOptions);
    return response;
  }

  public async getExtractionLogs(accessToken: string, extractionId: string, top?: number | undefined): Promise<ExtractionLogsResponse> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    const url = `${this._baseUrl}/${encodeURIComponent(extractionId)}/logs${top ? `?$top=${top}` : `` }`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<ExtractionLogsResponse>(url, requestOptions);
    return response;
  }

}
