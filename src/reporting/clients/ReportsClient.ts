/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { RequiredError } from "../interfaces/Errors";
import { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { OperationsBase } from "../OperationsBase";
import { Report, ReportCollection, ReportSingle, ReportCreate, ReportUpdate, ReportMapping, ReportMappingCollection, ReportMappingCreate, ReportMappingSingle } from "../interfaces/Reports";
import { IReportsClient } from "./IReportsClient";

export class ReportsClient extends OperationsBase implements IReportsClient{
  public async getReports(accessToken: AccessToken, projectId: string, deleted = false, top?: number): Promise<Report[]> {
    const reports: Array<Report> = [];
    const reportIterator = this.getReportsIterator(accessToken, projectId, deleted, top);
    for await(const report of reportIterator) {
      reports.push(report);
    }
    return reports;
  }

  public getReportsIterator(accessToken: AccessToken, projectId: string, deleted = false, top?: number): EntityListIterator<Report> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        'top',
        'Parameter top was outside of the valid range [1-1000] when calling getReportsIterator.'
      )
    }
    let url = `${this.basePath}/reports?projectId=${encodeURIComponent(projectId)}&deleted=${encodeURIComponent(deleted)}`;
    url += top ? `&%24top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Report>(
      url,
      async (url: string): Promise<Collection<Report>> => {
        const response: ReportCollection = await this.fetchJSON<ReportCollection>(url, request);
        return {
          values: response.reports,
          _links: response._links,
        }
    }));
  }

  public async getReport(accessToken: AccessToken, reportId: string): Promise<Report> {
    const url = `${this.basePath}/reports/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<ReportSingle>(url, requestOptions)).report;
  }

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

    const url = `${this.basePath}/reports/`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(report));
    return (await this.fetchJSON<ReportSingle>(url, requestOptions)).report;
  }

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

    const url = `${this.basePath}/reports/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(report));
    return (await this.fetchJSON<ReportSingle>(url, requestOptions)).report;
  }

  public async deleteReport(accessToken: AccessToken, reportId: string): Promise<Response> {
    const url = `${this.basePath}/reports/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async getReportMappings(accessToken: AccessToken, reportId: string, top?: number): Promise<ReportMapping[]> {
    const reportMappings: Array<ReportMapping> = [];
    const reportMappingIterator = this.getReportMappingsIterator(accessToken, reportId, top);
    for await(const reportMapping of reportMappingIterator) {
      reportMappings.push(reportMapping);
    }
    return reportMappings;
  }

  public getReportMappingsIterator(accessToken: AccessToken, reportId: string, top?: number): EntityListIterator<ReportMapping> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        'top',
        'Parameter top was outside of the valid range [1-1000] when calling getReportMappingsIterator.'
      )
    }
    let url = `${this.basePath}/reports/${encodeURIComponent(reportId)}/datasources/imodelMappings`;
    url += top ? `/?%24top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ReportMapping>(
      url,
      async (url: string): Promise<Collection<ReportMapping>> => {
        const response: ReportMappingCollection = await this.fetchJSON<ReportMappingCollection>(url, request);
        return {
          values: response.mappings,
          _links: response._links,
        }
    }));
  }

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

    const url = `${this.basePath}/reports/${encodeURIComponent(reportId)}/datasources/imodelMappings`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(reportMapping));
    return (await this.fetchJSON<ReportMappingSingle>(url, requestOptions)).mapping;
  }

  public async deleteReportMapping(accessToken: AccessToken, reportId: string, reportMappingId: string): Promise<Response> {
    const url = `${this.basePath}/reports/${encodeURIComponent(reportId)}/datasources/imodelMappings/${encodeURIComponent(reportMappingId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }
}