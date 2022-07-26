/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { ODataResponse, ODataItem, ODataEntityValue, ODataEntityResponse } from "../interfaces/OData";
import { EntityListIterator } from "../iterators/EntityListIterator";

export interface IOdataClient{
  /**
   * Lists all OData Entities for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata/
   */
  getODataReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<ODataResponse>,
  /**
   * Lists the specified page of raw table data for a Report Entity.
   * @param {string} reportId The Report Id.
   * @param {ODataItem} odataItem Reference to a table exported to your Report. Use {@link getODataReport()} to fetch a list of ODataItems in the report.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-entity/
   */
   getODataReportEntityPage(
    accessToken: AccessToken,
    reportId: string,
    odataItem: ODataItem,
    sequence: number
  ): Promise<ODataEntityResponse>
  /**
   * Lists the raw table data for a Report Entity.
   * @param {string} reportId The Report Id.
   * @param {ODataItem} odataItem Reference to a table exported to your Report. Use {@link getODataReport()} to fetch a list of ODataItems in the report.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-entity/
   */
  getODataReportEntities(
    accessToken: AccessToken,
    reportId: string,
    odataItem: ODataItem
  ): Promise<Array<ODataEntityValue>>
  /**
   * Gets an async iterator for the raw table data for a Report Entity.
   * @param {string} reportId The Report Id.
   * @param {ODataItem} odataItem Reference to a table exported to your Report. Use {@link getODataReport()} to fetch a list of ODataItems in the report.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-entity/
   */
   getODataReportEntitiesIterator(
    accessToken: AccessToken,
    reportId: string,
    odataItem: ODataItem
  ): EntityListIterator<ODataEntityValue>
  /**
   * Lists schemas for all Entities tied to a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-metadata/
   */
  getODataReportMetadata(
    accessToken: AccessToken,
    reportId: string
  ): Promise<Response>,
}