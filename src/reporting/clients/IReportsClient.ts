/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { Report, ReportCreate, ReportMapping, ReportMappingCreate, ReportUpdate } from "../interfaces/Reports";
import type { EntityListIterator } from "../iterators/EntityListIterator";

export interface IReportsClient{
  /**
   * Gets all Reports within the context of a Project. This method returns the full list of reports.
   * @param {string} projectId The project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {boolean} deleted Parameter to specify whether to include deleted reports.
   * @param {number} top the number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-project-reports/
   */
  getReports(
    accessToken: AccessToken,
    projectId: string,
    top?: number,
    deleted?: boolean
  ): Promise<Report[]>;

  /**
   * Gets an async paged iterator for Reports within the context of a Project.
   * This method returns an iterator which loads pages of reports as it is being iterated over.
   * @param {string} projectId The project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {boolean} deleted Parameter to specify whether to include deleted reports.
   * @param {number} top the number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-project-reports/
   */
  getReportsIterator(
    accessToken: AccessToken,
    projectId: string,
    top?: number,
    deleted?: boolean,
  ): EntityListIterator<Report>;

  /**
   * Gets a single Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report/
   */
  getReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<Report>;

  /**
   * Creates a Report within the context of a Project.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {ReportCreate} report Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-report/
   */
  createReport(
    accessToken: AccessToken,
    report: ReportCreate
  ): Promise<Report>;

  /**
   * Updates a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {ReportUpdate} report Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-report/
   */
  updateReport(
    accessToken: AccessToken,
    reportId: string,
    report: ReportUpdate
  ): Promise<Report>;

  /**
   * Marks a Report for deletion.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-report/
   */
  deleteReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<Response>;

  /**
   * Gets all Report Mappings for a Report. This method returns the full list of report mappings.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {number} top the number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report-mappings/
   */
  getReportMappings(
    accessToken: AccessToken,
    reportId: string,
    top?: number
  ): Promise<ReportMapping[]>;

  /**
   * Gets an async paged iterator of Report Mappings for a Report.
   * This method returns an iterator which loads pages of report mappings as it is being iterated over.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {number} top the number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report-mappings/
   */
  getReportMappingsIterator(
    accessToken: AccessToken,
    reportId: string,
    top?: number
  ): EntityListIterator<ReportMapping>;

  /**
   * Creates a Report Mapping.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {ReportMappingCreate} reportMapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-report-mapping/
   */
  createReportMapping(
    accessToken: AccessToken,
    reportId: string,
    reportMapping: ReportMappingCreate
  ): Promise<ReportMapping>;

  /**
   * Deletes a Report Mapping from a Report.
   * @param {string} reportId The Report Id.
   * @param {string} reportMappingId The Report Mapping Id
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-report-mapping/
   */
  deleteReportMapping(
    accessToken: AccessToken,
    reportId: string,
    reportMappingId: string
  ): Promise<Response>;
}
