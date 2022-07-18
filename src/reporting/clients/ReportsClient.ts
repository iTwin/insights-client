/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { RequiredError } from "../interfaces/Errors";
import { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { BASE_PATH, OperationsBase } from "../OperationsBase";
import { Report, ReportCollection, ReportSingle, ReportCreate, ReportUpdate, ReportMapping, ReportMappingCollection, ReportMappingCreate, ReportMappingSingle } from "../interfaces/Reports";

export interface ReportsClientInterface{
  getReports(
    accessToken: AccessToken, 
    projectId: string, 
    top?: number
  ): Promise<Report[]>,
  getReportsIterator(
    accessToken: AccessToken, 
    projectId: string, 
    top?: number
  ): EntityListIterator<Report>,
  getReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<Report>,
  createReport(
    accessToken: AccessToken,
    report: ReportCreate
  ): Promise<Report>,
  updateReport(
    accessToken: AccessToken,
    reportId: string,
    report: ReportUpdate
  ): Promise<Report>,
  deleteReport(
    accessToken: AccessToken,
    reportId: string
  ): Promise<Response>,
  getReportMappings(
    accessToken: AccessToken,
    reportId: string,
    top?: number
  ): Promise<ReportMapping[]>,
  getReportMappingsIterator(
    accessToken: AccessToken,
    reportId: string,
    top?: number
  ): EntityListIterator<ReportMapping>,
  createReportMapping(
    accessToken: AccessToken,
    reportId: string,
    reportMapping: ReportMappingCreate
  ): Promise<ReportMapping>,
  deleteReportMapping(
    accessToken: AccessToken,
    reportId: string,
    reportMappingId: string
  ): Promise<Response>,
}

export class ReportsClient extends OperationsBase implements ReportsClientInterface{
  /**
   * Gets all Reports within the context of a Project.
   * @param {string} projectId The Project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-project-reports/
   */
  public async getReports(accessToken: AccessToken, projectId: string, top?: number): Promise<Report[]> {
    const reports: Array<Report> = [];
    const reportIterator = this.getReportsIterator(accessToken, projectId, top);
    for await(const report of reportIterator) {
      reports.push(report);
    }
    return reports;
  }

  /**
   * Gets an async paged iterator for Reports within the context of a Project.
   * @param {string} projectId The Project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-project-reports/
   */
  public getReportsIterator(accessToken: AccessToken, projectId: string, top?: number): EntityListIterator<Report> {
    let url: string = `${BASE_PATH}/reports?projectId=${encodeURIComponent(projectId)}`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Report>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<collection> => {
        let response: ReportCollection = await this.fetch<ReportCollection>(url, requestOptions);
        return {
          values: response.reports,
          _links: response._links,
        }
    }));
  }

  /**
   * Gets a single Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report/
   */
  public async getReport(accessToken: AccessToken, reportId: string): Promise<Report> {
    const url = `${BASE_PATH}/reports/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetch<ReportSingle>(url, requestOptions)).report;;
  }

  /**
   * Creates a Report within the context of a Project.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportCreate} report Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-report/
   */
  public async createReport(accessToken: AccessToken, report: ReportCreate): Promise<Report>{
    if (!report.displayName) {
      throw new RequiredError(
        'displayName',
        'Required field displayName of report was null or undefined when calling createReport.',
      );
    }
    if (!report.projectId) {
      throw new RequiredError(
        'projectId',
        'Required field of report was null or undefined when calling createReport.',
      );
    }

    const url = `${BASE_PATH}/reports/`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(report || {}));
    return (await this.fetch<ReportSingle>(url, requestOptions)).report;
  }

  /**
   * Updates a Report.
   * @param {string} reportId Id of the Report to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportUpdate} report Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-report/
   */
  public async updateReport(accessToken: AccessToken, reportId: string, report: ReportUpdate): Promise<Report> {
    if (report.deleted == null && report.description == null && report.displayName == null) {
      throw new RequiredError(
        'report',
        'All fields of report were null or undefined when calling updateReport.',
      );
    }
    if (report.displayName === "") {
      throw new RequiredError(
        'displayName',
        'Field display of report was empty when calling createReportMapping.',
      );
    }

    const url = `${BASE_PATH}/reports/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(report || {}));
    return (await this.fetch<ReportSingle>(url, requestOptions)).report;
  }

  /**
   * Marks a Report for deletetion.
   * @param {string} reportId Id of the Report to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-report/
   */
  public async deleteReport(accessToken: AccessToken, reportId: string): Promise<Response> {
    const url = `${BASE_PATH}/reports/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetch<Response>(url, requestOptions);
  }

  /**
   * Gets all Report Mappings for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report-mappings/
   */
  public async getReportMappings(accessToken: AccessToken, reportId: string, top?: number): Promise<ReportMapping[]> {
    const reportMappings: Array<ReportMapping> = [];
    const reportMappingIterator = this.getReportMappingsIterator(accessToken, reportId, top);
    for await(const reportMapping of reportMappingIterator) {
      reportMappings.push(reportMapping);
    }
    return reportMappings;
  }

  /**
   * Gets an async paged iterator of Report Mappings for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report-mappings/
   */
  public getReportMappingsIterator(accessToken: AccessToken, reportId: string, top?: number): EntityListIterator<ReportMapping> {
    let url: string = `${BASE_PATH}/reports/${encodeURIComponent(reportId)}/datasources/imodelMappings`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ReportMapping>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<collection> => {
        let response: ReportMappingCollection = await this.fetch<ReportMappingCollection>(url, requestOptions);
        return {
          values: response.mappings,
          _links: response._links,
        }
    }));
  }

  /**
   * Creates a Report Mapping.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportMappingCreate} reportMapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-report-mapping/
   */
  public async createReportMapping(
    accessToken: AccessToken,
    reportId: string,
    reportMapping: ReportMappingCreate
  ): Promise<ReportMapping> {
    if (!reportMapping.imodelId) {
      throw new RequiredError(
        'imodelId',
        'Required field imodelId of reportMapping was null or undefined when calling createReportMapping.',
      );
    }
    if (!reportMapping.mappingId) {
      throw new RequiredError(
        'mappingId',
        'Required field mappingId of reportMapping was null or undefined when calling createReportMapping.',
      );
    }

    const url = `${BASE_PATH}/reports/${encodeURIComponent(reportId)}/datasources/imodelMappings`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(reportMapping || {}));
    return (await this.fetch<ReportMappingSingle>(url, requestOptions)).mapping;
  }

  /**
   * Deletes a Report Mapping from a Report.
   * @param {string} reportId The Report Id.
   * @param {string} mappingId Id of the Report Mapping to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-report-mapping/
   */
  public async deleteReportMapping(accessToken: AccessToken, reportId: string, reportMappingId: string): Promise<Response> {
    const url = `${BASE_PATH}/reports/${encodeURIComponent(reportId)}/datasources/imodelMappings/${encodeURIComponent(reportMappingId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetch<Response>(url, requestOptions);
  }

}