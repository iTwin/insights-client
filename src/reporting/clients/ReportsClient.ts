/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { RequiredError } from "../interfaces/Errors";
import type { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../../common/iterators/IteratorUtil";
import { OperationsBase } from "../../common/OperationsBase";
import type { Report, ReportAggregation, ReportAggregationCollection, ReportAggregationCreate, ReportAggregationSingle, ReportCollection, ReportCreate, ReportMapping, ReportMappingCollection, ReportMappingCreate, ReportMappingSingle, ReportSingle, ReportUpdate } from "../interfaces/Reports";
import type { IReportsClient } from "./IReportsClient";

export class ReportsClient extends OperationsBase implements IReportsClient{
  public async getReports(accessToken: AccessToken, projectId: string, top?: number, deleted = false): Promise<Report[]> {
    const reports: Array<Report> = [];
    const reportIterator = this.getReportsIterator(accessToken, projectId, top, deleted);
    for await(const report of reportIterator) {
      reports.push(report);
    }
    return reports;
  }

  public getReportsIterator(accessToken: AccessToken, projectId: string, top?: number, deleted = false): EntityListIterator<Report> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    let url = `${this.basePath}/reports?projectId=${encodeURIComponent(projectId)}&deleted=${encodeURIComponent(deleted)}`;
    url += top ? `&$top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Report>(
      url,
      async (nextUrl: string): Promise<Collection<Report>> => {
        const response: ReportCollection = await this.fetchJSON<ReportCollection>(nextUrl, request);
        return {
          values: response.reports,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: response._links,
        };
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
        "displayName",
        "Required field displayName was null or undefined.",
      );
    }
    if (!report.projectId) {
      throw new RequiredError(
        "projectId",
        "Required field projectId was null or undefined.",
      );
    }

    const url = `${this.basePath}/reports/`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(report));
    return (await this.fetchJSON<ReportSingle>(url, requestOptions)).report;
  }

  public async updateReport(accessToken: AccessToken, reportId: string, report: ReportUpdate): Promise<Report> {
    if (report.deleted == null && report.description == null && report.displayName == null) {
      throw new RequiredError(
        "report",
        "All fields of report were null or undefined.",
      );
    }
    if (report.displayName === "") {
      throw new RequiredError(
        "displayName",
        "Field displayName was empty.",
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
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    let url = `${this.basePath}/reports/${encodeURIComponent(reportId)}/datasources/imodelMappings`;
    url += top ? `/?$top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ReportMapping>(
      url,
      async (nextUrl: string): Promise<Collection<ReportMapping>> => {
        const response: ReportMappingCollection = await this.fetchJSON<ReportMappingCollection>(nextUrl, request);
        return {
          values: response.mappings,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: response._links,
        };
      }));
  }

  public async createReportMapping(
    accessToken: AccessToken,
    reportId: string,
    reportMapping: ReportMappingCreate
  ): Promise<ReportMapping> {
    if (!reportMapping.imodelId) {
      throw new RequiredError(
        "imodelId",
        "Required field imodelId was null or undefined.",
      );
    }
    if (!reportMapping.mappingId) {
      throw new RequiredError(
        "mappingId",
        "Required field mappingId was null or undefined.",
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

  public async getReportAggregation(
    accessToken: AccessToken,
    reportId: string,
    top?: number
  ): Promise<ReportAggregation[]> {
    const aggregations: Array<ReportAggregation> = [];
    const reportAggregationIterator = this.getReportAggregationIterator(accessToken, reportId, top);
    for await(const reportAggregation of reportAggregationIterator) {
      aggregations.push(reportAggregation);
    }
    return aggregations;
  }

  public getReportAggregationIterator(
    accessToken: AccessToken,
    reportId: string,
    top?: number
  ): EntityListIterator<ReportAggregation> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    let url = `${this.basePath}/reports/${encodeURIComponent(reportId)}/datasources/aggregations`;
    url += top ? `/?$top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ReportAggregation>(
      url,
      async (nextUrl: string): Promise<Collection<ReportAggregation>> => {
        const response: ReportAggregationCollection = await this.fetchJSON<ReportAggregationCollection>(nextUrl, request);
        return {
          values: response.aggregations,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: response._links,
        };
      }));
  }

  public async createReportAggregation(
    accessToken: AccessToken,
    reportId: string,
    aggregation: ReportAggregationCreate
  ): Promise<ReportAggregation> {
    const url = `${this.basePath}/reports/${encodeURIComponent(reportId)}/datasources/aggregations`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(aggregation));
    return (await this.fetchJSON<ReportAggregationSingle>(url, requestOptions)).reportAggregation;
  }

  public async deleteReportAggregation(
    accessToken: AccessToken,
    reportId: string,
    aggregationTableSetId: string,
  ): Promise<Response> {
    const url = `${this.basePath}/reports/${encodeURIComponent(reportId)}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }
}
