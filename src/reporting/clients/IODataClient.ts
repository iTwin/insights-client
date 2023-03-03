/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { ODataEntityResponse, ODataEntityValue, ODataItem, ODataResponse, ODataTable } from "../interfaces/OData";
import type { EntityListIterator } from "../../common/iterators/EntityListIterator";

export interface IOdataClient {
  /**
   * Lists all OData Entities for a Report.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} reportId The Report Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata/
   */
  getODataReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<ODataResponse>;

  /**
   * Lists the specified page of raw table data for a Report Entity.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} reportId The Report Id.
   * @param {ODataItem} odataItem Reference to a table exported to your Report. Use {@link getODataReport()} to fetch a list of ODataItems in the report.
   * @param {number} sequence The number of the page to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-entity/
   */
  getODataReportEntityPage(
    accessToken: AccessToken,
    reportId: string,
    odataItem: ODataItem,
    sequence: number
  ): Promise<ODataEntityResponse>;

  /**
   * Lists the raw table data for a Report Entity. This method returns the full list of OData report entities.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} reportId The Report Id.
   * @param {ODataItem} odataItem Reference to a table exported to your Report. Use {@link getODataReport()} to fetch a list of ODataItems in the report.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-entity/
   */
  getODataReportEntities(
    accessToken: AccessToken,
    reportId: string,
    odataItem: ODataItem
  ): Promise<Array<ODataEntityValue>>;

  /**
   * Gets an async iterator for the raw table data for a Report Entity.
   * This method returns an iterator which loads pages of OData report entities as it is being iterated over.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} reportId The Report Id.
   * @param {ODataItem} odataItem Reference to a table exported to your Report. Use {@link getODataReport()} to fetch a list of ODataItems in the report.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-entity/
   */
  getODataReportEntitiesIterator(
    accessToken: AccessToken,
    reportId: string,
    odataItem: ODataItem
  ): EntityListIterator<ODataEntityValue>;

  /**
   * Lists schemas for all Entities tied to a Report.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} reportId The Report Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-metadata/
   */
  getODataReportMetadata(
    accessToken: AccessToken,
    reportId: string
  ): Promise<ODataTable[]>;
}
