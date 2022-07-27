/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { Report, ReportCreate, ReportUpdate, ReportMapping, ReportMappingCreate } from "../interfaces/Reports";
import { EntityListIterator } from "../iterators/EntityListIterator";

export interface IReportsClient{
  /**
   * Gets all Reports within the context of a Project.
   * @param {string} projectId The Project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {boolean} deleted parameter to specify whether to include deleted reports
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-project-reports/
   */
  getReports(
    accessToken: AccessToken, 
    projectId: string, 
    deleted: boolean,
    top?: number
  ): Promise<Report[]>,
  /**
   * Gets an async paged iterator for Reports within the context of a Project.
   * @param {string} projectId The Project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {boolean} deleted parameter to specify whether to include deleted reports
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-project-reports/
   */
  getReportsIterator(
    accessToken: AccessToken, 
    projectId: string,
    deleted: boolean,
    top?: number
  ): EntityListIterator<Report>,
  /**
   * Gets a single Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report/
   */
  getReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<Report>,
  /**
   * Creates a Report within the context of a Project.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportCreate} report Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-report/
   */
  createReport(
    accessToken: AccessToken,
    report: ReportCreate
  ): Promise<Report>,
  /**
   * Updates a Report.
   * @param {string} reportId Id of the Report to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportUpdate} report Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-report/
   */
  updateReport(
    accessToken: AccessToken,
    reportId: string,
    report: ReportUpdate
  ): Promise<Report>,
  /**
   * Marks a Report for deletetion.
   * @param {string} reportId Id of the Report to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-report/
   */
  deleteReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<Response>,
  /**
   * Gets all Report Mappings for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report-mappings/
   */
  getReportMappings(
    accessToken: AccessToken,
    reportId: string,
    top?: number
  ): Promise<ReportMapping[]>,
  /**
   * Gets an async paged iterator of Report Mappings for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report-mappings/
   */
  getReportMappingsIterator(
    accessToken: AccessToken,
    reportId: string,
    top?: number
  ): EntityListIterator<ReportMapping>,
  /**
   * Creates a Report Mapping.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportMappingCreate} reportMapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-report-mapping/
   */
  createReportMapping(
    accessToken: AccessToken,
    reportId: string,
    reportMapping: ReportMappingCreate
  ): Promise<ReportMapping>,
  /**
   * Deletes a Report Mapping from a Report.
   * @param {string} reportId The Report Id.
   * @param {string} mappingId Id of the Report Mapping to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-report-mapping/
   */
  deleteReportMapping(
    accessToken: AccessToken,
    reportId: string,
    reportMappingId: string
  ): Promise<Response>,
}