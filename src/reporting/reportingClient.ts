/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { report } from "process";

import type {
  CalculatedProperty,
  CalculatedPropertyCollection,
  CalculatedPropertyCreate,
  CalculatedPropertyUpdate,
  CustomCalculation,
  CustomCalculationCollection,
  CustomCalculationCreate,
  CustomCalculationUpdate,
  Group,
  GroupCollection,
  GroupCreate,
  GroupProperty,
  GroupPropertyCollection,
  GroupPropertyCreate,
  GroupPropertyUpdate,
  GroupUpdate,
  ExtractionLog,
  ExtractionLogCollection,
  Mapping,
  MappingCollection,
  MappingCopy,
  MappingCreate,
  MappingUpdate,
  ODataEntityResponse,
  ODataItem,
  Report,
  ReportCollection,
  ReportCreate,
  ReportMapping,
  ReportMappingCollection,
  ReportMappingCreate,
  ReportUpdate
} from "./generated/api";
import {
  DataAccessApi,
  ExtractionApi,
  MappingsApi,
  REPORTING_BASE_PATH,
  ReportsApi
} from "./generated/api";

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";

const prefixUrl = (baseUrl?: string, prefix?: string) => {
  if (prefix && baseUrl) {
    return baseUrl.replace("api.bentley.com", `${prefix}api.bentley.com`);
  }
  return baseUrl;
};

// To be only used within Viewer
export class ReportingClient {
  private _dataAccessApi: DataAccessApi;
  private _mappingsApi: MappingsApi;
  private _reportsApi: ReportsApi;
  private _extractionApi: ExtractionApi;
  constructor() {
    const baseUrl = prefixUrl(REPORTING_BASE_PATH, process.env.IMJS_URL_PREFIX);
    this._dataAccessApi = new DataAccessApi(undefined, baseUrl);
    this._mappingsApi = new MappingsApi(undefined, baseUrl);
    this._reportsApi = new ReportsApi(undefined, baseUrl);
    this._extractionApi = new ExtractionApi(undefined, baseUrl);
  }

  //#region Data Access Endpoints

  public async getODataReport(accessToken: AccessToken, reportId: string) {
    return this._dataAccessApi.odata(reportId, accessToken);
  }

  public async getODataReportEntity(accessToken: AccessToken, reportId: string, odataItem: ODataItem) {
    const segments = odataItem?.url?.split('/');
    if (segments?.length !== 3) return undefined;
    let sequence = 0;

    let reportData: Array<Object> = [];
    let response: ODataEntityResponse;

    do {
      response = await this._dataAccessApi.odataEntity(
        reportId,
        segments[0],
        segments[1],
        segments[2],
        sequence,
        accessToken
      );
      response.value && reportData.push(...response.value);
      sequence++;
    } while (response["@odata.nextLink"]);

    return reportData;
  }

  public async getODataReportMetadata(accessToken: AccessToken, reportId: string) {
    return this._dataAccessApi.odataMetadata(reportId, accessToken);
  }

  //#endregion

  //#region Extraction Endpoints

  public async getExtractionLogs(accessToken: AccessToken, jobId: string) {
    const logs: Array<ExtractionLog> = [];

    let response: ExtractionLogCollection;
    let continuationToken: string | undefined;

    do {
      response = await this._extractionApi.getExtractionLogs(
        jobId,
        accessToken,
        undefined,
        continuationToken,
        ACCEPT
      );
      response.extractionLog && logs.push(...response.extractionLog);
      if (!response._links?.next?.href) {
        continue;
      }
      const url = new URL(response._links?.next?.href);
      continuationToken = url.searchParams.get("$continuationToken") ?? undefined;
    } while (response._links?.next?.href);

    return logs;
  }

  public runExtraction(accessToken: AccessToken, iModelId: string) {
    return this._extractionApi.runExtraction(
      iModelId,
      accessToken,
      ACCEPT
    );
  }

  public async getExtractionStatus(accessToken: AccessToken, jobId: string) {
    return this._extractionApi.getExtractionStatus(
      jobId,
      accessToken,
      ACCEPT
    );

  }

  //#endregion

  //#region Reports Endpoints

  public async getReports(accessToken: AccessToken, projectId: string) {
    const reports: Array<Report> = [];

    let response: ReportCollection;
    let continuationToken: string | undefined;

    do {
      response = await this._reportsApi.getProjectReports(
        projectId,
        accessToken,
        undefined,
        continuationToken,
        false,
        ACCEPT
      );
      response.reports && reports.push(...response.reports);
      if (!response._links?.next?.href) {
        continue;
      }
      const url = new URL(response._links?.next?.href);
      continuationToken = url.searchParams.get("$continuationToken") ?? undefined;
    } while (response._links?.next?.href);

    return reports;
  }

  public async getReport(accessToken: AccessToken, projectId: string, reportId: string) {
    return this._reportsApi.getReport(
      projectId,
      reportId,
      accessToken
    );
  }

  public async createReport(accessToken: AccessToken, report: ReportCreate) {
    return this._reportsApi.createReport(
      accessToken,
      report,
      ACCEPT
    );
  }

  public async updateReport(accessToken: AccessToken, reportId: string, report: ReportUpdate) {
    return this._reportsApi.updateReport(
      reportId,
      accessToken,
      report,
      ACCEPT
    );
  }

  public async deleteReport(accessToken: AccessToken, reportId: string) {
    return this._reportsApi.deleteReport(
      reportId,
      accessToken,
      ACCEPT
    );
  }

  public async getReportMappings(accessToken: AccessToken, reportId: string) {
    const reportMappings: Array<ReportMapping> = [];

    let response: ReportMappingCollection;
    let continuationToken: string | undefined;

    do {
      response = await this._reportsApi.getReportMappings(
        reportId,
        accessToken,
        undefined,
        continuationToken,
        ACCEPT
      );
      response.mappings && reportMappings.push(...response.mappings);
      if (!response._links?.next?.href) {
        continue;
      }
      const url = new URL(response._links?.next?.href);
      continuationToken = url.searchParams.get("$continuationToken") ?? undefined;
    } while (response._links?.next?.href);

    return reportMappings;
  }

  public async createReportMapping(accessToken: AccessToken, reportId: string, reportMapping: ReportMappingCreate) {
    return this._reportsApi.createReportMapping(
      reportId,
      accessToken,
      reportMapping,
      ACCEPT
    );
  }

  public async deleteReportMapping(accessToken: AccessToken, reportId: string, reportMappingId: string) {
    return this._reportsApi.deleteReportMapping(
      reportId,
      reportMappingId,
      accessToken,
      ACCEPT
    );
  }

  //#endregion

  //#region Mappings Endpoints

  public async getMappings(accessToken: AccessToken, iModelId: string) {
    const mappings: Array<Mapping> = [];

    let response: MappingCollection;
    let continuationToken: string | undefined;

    do {
      response = await this._mappingsApi.getMappings(
        iModelId,
        accessToken,
        undefined,
        continuationToken,
        ACCEPT
      );
      response.mappings && mappings.push(...response.mappings);
      if (!response._links?.next?.href) {
        continue;
      }
      const url = new URL(response._links?.next?.href);
      continuationToken = url.searchParams.get("$continuationToken") ?? undefined;
    } while (response._links?.next?.href);

    return mappings;
  }

  public async getMapping(accessToken: AccessToken, mappingId: string, iModelId: string) {
    return this._mappingsApi.getMapping(iModelId, mappingId, accessToken);
  }

  public async createMapping(
    accessToken: AccessToken,
    iModelId: string,
    mapping: MappingCreate
  ) {
    return this._mappingsApi.createMapping(iModelId, accessToken, mapping);
  }

  public async updateMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    mapping: MappingUpdate
  ) {
    return this._mappingsApi.updateMapping(
      iModelId,
      mappingId,
      accessToken,
      mapping
    );
  }

  public async deleteMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ) {
    return this._mappingsApi.deleteMapping(iModelId, mappingId, accessToken);
  }

  public async copyMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    mappingCopy: MappingCopy
  ) {
    return this._mappingsApi.copyMapping(
      iModelId,
      mappingId,
      accessToken,
      mappingCopy
    );
  }

  public async getGroups(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ) {
    const groups: Array<Group> = [];

    let response: GroupCollection;
    let continuationToken: string | undefined;

    do {
      response = await this._mappingsApi.getGroups(
        iModelId,
        mappingId,
        accessToken,
        undefined,
        continuationToken,
        ACCEPT
      );
      response.groups && groups.push(...response.groups);
      if (!response._links?.next?.href) {
        continue;
      }
      const url = new URL(response._links?.next?.href);
      continuationToken = url.searchParams.get("$continuationToken") ?? undefined;
    } while (response._links?.next?.href);

    return groups;
  }

  public async createGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    group: GroupCreate
  ) {
    return this._mappingsApi.createGroup(
      iModelId,
      mappingId,
      accessToken,
      group
    );
  }

  public async getGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ) {
    return this._mappingsApi.getGroup(
      iModelId,
      mappingId,
      groupId,
      accessToken
    );
  }

  public async updateGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    group: GroupUpdate
  ) {
    return this._mappingsApi.updateGroup(
      iModelId,
      mappingId,
      groupId,
      accessToken,
      group
    );
  }

  public async deleteGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ) {
    return this._mappingsApi.deleteGroup(
      iModelId,
      mappingId,
      groupId,
      accessToken
    );
  }

  public async getGroupProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ) {
    const properties: Array<GroupProperty> = [];

    let response: GroupPropertyCollection;
    let continuationToken: string | undefined;

    do {
      response = await this._mappingsApi.getGroupproperties(
        iModelId,
        mappingId,
        groupId,
        accessToken,
        undefined,
        continuationToken,
        ACCEPT
      );
      response.groupProperties && properties.push(...response.groupProperties);
      if (!response._links?.next?.href) {
        continue;
      }
      const url = new URL(response._links?.next?.href);
      continuationToken = url.searchParams.get("$continuationToken") ?? undefined;
    } while (response._links?.next?.href);

    return properties;
  }

  public async getGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ) {
    return this._mappingsApi.getGroupproperty(
      iModelId,
      mappingId,
      groupId,
      propertyId,
      accessToken
    );
  }

  public async createGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    groupProperty: GroupPropertyCreate
  ) {
    return this._mappingsApi.createGroupproperty(
      iModelId,
      mappingId,
      groupId,
      accessToken,
      groupProperty
    );
  }

  public async updateGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    groupPropertyId: string,
    groupProperty: GroupPropertyUpdate
  ) {
    return this._mappingsApi.updateGroupproperty(
      iModelId,
      mappingId,
      groupId,
      groupPropertyId,
      accessToken,
      groupProperty
    );
  }

  public async deleteGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    groupPropertyId: string
  ) {
    return this._mappingsApi.deleteGroupproperty(
      iModelId,
      mappingId,
      groupId,
      groupPropertyId,
      accessToken
    );
  }

  public async getCalculatedProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ) {
    const properties: Array<CalculatedProperty> = [];

    let response: CalculatedPropertyCollection;
    let continuationToken: string | undefined;

    do {
      response = await this._mappingsApi.getCalculatedproperties(
        iModelId,
        mappingId,
        groupId,
        accessToken
      );
      response.properties && properties.push(...response.properties);
      if (!response._links?.next?.href) {
        continue;
      }
      const url = new URL(response._links?.next?.href);
      continuationToken = url.searchParams.get("$continuationToken") ?? undefined;
    } while (response._links?.next?.href);

    return properties;
  }

  public async getCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ) {
    return this._mappingsApi.getCalculatedproperty(
      iModelId,
      mappingId,
      groupId,
      propertyId,
      accessToken
    );
  }

  public async createCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    property: CalculatedPropertyCreate
  ) {
    return this._mappingsApi.createCalculatedproperty(
      iModelId,
      mappingId,
      groupId,
      accessToken,
      property
    );
  }

  public async updateCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    property: CalculatedPropertyUpdate
  ) {
    return this._mappingsApi.updateCalculatedproperty(
      iModelId,
      mappingId,
      groupId,
      propertyId,
      accessToken,
      property
    );
  }

  public async deleteCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ) {
    return this._mappingsApi.deleteCalculatedproperty(
      iModelId,
      mappingId,
      groupId,
      propertyId,
      accessToken
    );
  }

  public async getCustomCalculations(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ) {
    const customCalculations: Array<CustomCalculation> = [];

    let response: CustomCalculationCollection;
    let continuationToken: string | undefined;

    do {
      response = await this._mappingsApi.getCustomcalculations(
        iModelId,
        mappingId,
        groupId,
        accessToken
      );
      response.customCalculations && customCalculations.push(...response.customCalculations);
      if (!response._links?.next?.href) {
        continue;
      }
      const url = new URL(response._links?.next?.href);
      continuationToken = url.searchParams.get("$continuationToken") ?? undefined;
    } while (response._links?.next?.href);

    return customCalculations;
  }

  public async getCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ) {
    return this._mappingsApi.getCustomcalculation(
      iModelId,
      mappingId,
      groupId,
      propertyId,
      accessToken
    );
  }

  public async createCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    property: CustomCalculationCreate
  ) {
    return this._mappingsApi.createCustomcalculation(
      iModelId,
      mappingId,
      groupId,
      accessToken,
      property
    );
  }

  public async updateCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    property: CustomCalculationUpdate
  ) {
    return this._mappingsApi.updateCustomcalculation(
      iModelId,
      mappingId,
      groupId,
      propertyId,
      accessToken,
      property
    );
  }

  public async deleteCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ) {
    return this._mappingsApi.deleteCustomcalculation(
      iModelId,
      mappingId,
      groupId,
      propertyId,
      accessToken
    );
  }

  //#endregion
}
