/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { ODataResponse, ODataItem, ODataEntityResponse } from "../interfaces/OData";
import { OperationsBase } from "../OperationsBase";

export interface ODataClientInterface{
  getODataReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<ODataResponse>,
  getODataReportEntity(
    accessToken: AccessToken,
    reportId: string,
    odataItem: ODataItem
  ): Promise<{[key: string]: string;}[] | undefined>,
  getODataReportMetadata(
    accessToken: AccessToken,
    reportId: string
  ): Promise<Response>,
}

export class ODataClient extends OperationsBase implements ODataClientInterface{
  /**
   * Lists all OData Entities for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata/
   */
  public async getODataReport(accessToken: AccessToken, reportId: string): Promise<ODataResponse> {
    const url = `${this.basePath}/odata/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return this.fetchData<ODataResponse>(url, requestOptions);
  }

  /**
   * Lists the raw table data for a Report Entity.
   * @param {string} reportId The Report Id.
   * @param {ODataItem} odataItem Reference to a table exported to your Report. Use {@link getODataReport()} to fetch a list of ODataItems in the report.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-entity/
   */
  public async getODataReportEntity(accessToken: AccessToken, reportId: string, odataItem: ODataItem) {
    const segments = odataItem.url.split('/');  // region, manifestId, entityType
    if (segments.length !== 3) {
      return undefined;
    }
    let sequence = 0;
    const reportData: Array<{[key: string]: string}> = [];
    let response: ODataEntityResponse;
    let url = `${this.basePath}/odata/${encodeURIComponent(reportId)}/${encodeURIComponent(segments[0])}/${encodeURIComponent(segments[1])}/${encodeURIComponent(segments[2])}?sequence=${encodeURIComponent(sequence)}`;
    do {
      const requestOptions: RequestInit = this.createRequest("GET", accessToken);
      response = await this.fetchData(url, requestOptions);
      response.value && reportData.push(...response.value);
      sequence++;
      url = response["@odata.nextLink"] ? response["@odata.nextLink"] : "";
    } while (response["@odata.nextLink"]);

    return reportData;
  }

  /**
   * Lists schemas for all Entities tied to a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-metadata/
   */
  public async getODataReportMetadata(accessToken: AccessToken, reportId: string): Promise<Response> {
    const url = `${this.basePath}/odata/${encodeURIComponent(reportId)}/$metadata`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return this.fetch(url, requestOptions).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        throw response;
      }
    });
  }
}