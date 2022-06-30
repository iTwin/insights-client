/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";

import type {
  CalculatedProperty,
  CalculatedPropertyCollection,
  CalculatedPropertyCreate,
  CalculatedPropertyUpdate,
} from "./CalculatedProperties";
import type {
  CustomCalculation,
  CustomCalculationCollection,
  CustomCalculationCreate,
  CustomCalculationUpdate,
} from "./CustumCalculations";
import type {
  Group,
  GroupCollection,
  GroupCreate,
  GroupUpdate,
} from "./Groups";
import type {
  GroupProperty,
  GroupPropertyCollection,
  GroupPropertyCreate,
  GroupPropertyUpdate,
} from "./GroupProperties";
import type {
  ExtractionLog,
  ExtractionLogCollection,
} from "./ExtractionProcess";
import type {
  Mapping,
  MappingCollection,
  MappingCopy,
  MappingCreate,
  MappingUpdate,
} from "./Mappings";
import type {
  ODataEntityResponse,
  ODataItem,
} from "./OData";
import type {
  Report,
  ReportCollection,
  ReportCreate,
  ReportMapping,
  ReportMappingCollection,
  ReportMappingCreate,
  ReportUpdate,
} from "./Reports";
import {
  DataAccessApi,
  ExtractionApi,
  MappingsApi,
  REPORTING_BASE_PATH,
  ReportsApi,
} from "./generated/api";
import { PagedResponseLinks } from "./Links";
import isomorphicFetch from 'cross-fetch';

const BASE_PATH = 'https://api.bentley.com/insights/reporting'.replace(
  /\/+$/,
  '',
);

interface FetchArgs {
  url: string;
  options: any;
}

class RequiredError extends Error {
  constructor(public field: string, msg?: string) {
    super(msg);
  }
}

interface FetchAPI {
  (url: string, init?: any): Promise<Response>;
}

interface GenericCollection {
  values: Array<any>;
  _links: PagedResponseLinks;
}

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";

// To be only used within Viewer
export class ReportingClient {
  private _dataAccessApi: DataAccessApi;
  private _mappingsApi: MappingsApi;
  private _reportsApi: ReportsApi;
  private _extractionApi: ExtractionApi;
  constructor(baseUrl?: string) {
    const reportingBaseUrl = baseUrl ?? REPORTING_BASE_PATH;
    this._dataAccessApi = new DataAccessApi(undefined, reportingBaseUrl);
    this._mappingsApi = new MappingsApi(undefined, reportingBaseUrl);
    this._reportsApi = new ReportsApi(undefined, reportingBaseUrl);
    this._extractionApi = new ExtractionApi(undefined, reportingBaseUrl);
  }

  /**
   * Creates an abstract async generator to loop through collections
   * @param {Async Function} getNextBatch function that specifies what data to retrieve
   * @memberof ReportingClient
   */

  private genericIterator<T>(getNextBatch: (nextUrl: string | undefined) => Promise<GenericCollection>): {
    [Symbol.asyncIterator]: () => AsyncGenerator<T, void, unknown>;
  } {
    return {
      [Symbol.asyncIterator]: async function*() {
        let response: GenericCollection;
        let i: number = 0;
        let nextUrl: string | undefined = undefined;

        do {
          response = await getNextBatch(nextUrl);
          while(i < response.values.length) {
            yield response.values[i++];
          }
          i = 0;
          if (!response._links?.next?.href) {
            continue;
          }
          nextUrl = response._links?.next?.href;
        } while (response._links?.next?.href);
        return;
      },
    };
  }

  private createRequest(operation: string, accessToken: string): RequestInit {
    return {
      method: operation,
      headers: {
        Authorization: String(accessToken),
        Accept: String(ACCEPT),
    }};
  }

  private async fetch(nextUrl: RequestInfo, requestOptions: RequestInit) {
    return isomorphicFetch(
      nextUrl,
      requestOptions
    ).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  /**
   * Lists all OData Entities for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata/
   */
  public async getODataReport(accessToken: AccessToken, reportId: string) {
    return this._dataAccessApi.odata(reportId, accessToken);
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
    const segments = odataItem?.url?.split('/');
    if (segments?.length !== 3) {
      return undefined;
    }
    let sequence = 0;

    const reportData: Array<{[key: string]: string}> = [];
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

  /**
   * Lists schemas for all Entities tied to a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/odata-metadata/
   */
  public async getODataReportMetadata(accessToken: AccessToken, reportId: string) {
    return this._dataAccessApi.odataMetadata(reportId, accessToken);
  }

  /**
   * Gets Logs of an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-logs/
   */
  public async getExtractionLogs(accessToken: AccessToken, jobId: string) {
    const logs: Array<ExtractionLog> = [];

    const logIterator = this.getExtractionLogsAsync(accessToken, jobId);
    for await(const log of logIterator) {
      logs.push(log);
    }
    return logs;
  }

  /**
   * Gets an async iterator for Logs of an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   */
  public getExtractionLogsAsync(accessToken: AccessToken, jobId: string): {
    [Symbol.asyncIterator]: () => AsyncGenerator<ExtractionLog, void, unknown>;
  } {
    return this.genericIterator<ExtractionLog>(
      async (nextUrl: string | undefined): Promise<GenericCollection> => {
        if(nextUrl === undefined) {
          nextUrl = BASE_PATH + "/datasources/extraction/status/" + encodeURIComponent(String(jobId)) + "/logs";
        }
        const requestOptions: RequestInit = this.createRequest('GET', accessToken);
        const response: ExtractionLogCollection = await this.fetch(nextUrl, requestOptions);
        return {
          values: response.logs,
          _links: response._links,
        };
      });
  }

  /**
   * Manually run Extraction of data from an iModel.
   * @param {string} imodelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/run-extraction/
   */
  public runExtraction(accessToken: AccessToken, iModelId: string) {
    return this._extractionApi.runExtraction(
      iModelId,
      accessToken,
      ACCEPT
    );
  }

  /**
   * Gets the Status of an Extraction Run.
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-extraction-status/
   */
  public async getExtractionStatus(accessToken: AccessToken, jobId: string) {
    return this._extractionApi.getExtractionStatus(
      jobId,
      accessToken,
      ACCEPT
    );

  }

  /**
   * Gets all Reports within the context of a Project.
   * @param {string} projectId The Project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-project-reports/
   */
  public async getReports(accessToken: AccessToken, projectId: string) {
    const reports: Array<Report> = [];

    const reportIterator = this.getReportsAsync(accessToken, projectId);
    for await(const report of reportIterator) {
      reports.push(report);
    }
    return reports;
  }

  /**
   * Gets an async iterator for the Reports of a Project
   * @param {string} projectId The Project Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   */
  public getReportsAsync(accessToken: AccessToken, projectId: string): {
    [Symbol.asyncIterator]: () => AsyncGenerator<Report, void, unknown>;
  } {
    return this.genericIterator<Report>(
      async (nextUrl: string | undefined): Promise<GenericCollection> => {
        if(nextUrl === undefined) {
          nextUrl = BASE_PATH + "/reports?projectId=" + encodeURIComponent(String(projectId)) + "&deleted=false";
        }
        const requestOptions : RequestInit = this.createRequest('GET', accessToken);
        const response: ReportCollection = await this.fetch(nextUrl, requestOptions);
        return {
          values: response.reports,
          _links: response._links,
        };
      });
  }

  /**
   * Gets a single Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report/
   */
  public async getReport(accessToken: AccessToken, projectId: string, reportId: string) {
    return this._reportsApi.getReport(
      projectId,
      reportId,
      accessToken
    );
  }

  /**
   * Creates a Report within the context of a Project.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportCreate} report Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-report/
   */
  public async createReport(accessToken: AccessToken, report: ReportCreate) {
    return this._reportsApi.createReport(
      accessToken,
      report,
      ACCEPT
    );
  }

  /**
   * Updates a Report.
   * @param {string} reportId Id of the Report to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportUpdate} report Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-report/
   */
  public async updateReport(accessToken: AccessToken, reportId: string, report: ReportUpdate) {
    return this._reportsApi.updateReport(
      reportId,
      accessToken,
      report,
      ACCEPT
    );
  }

  /**
   * Marks a Report for deletetion.
   * @param {string} reportId Id of the Report to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-report/
   */
  public async deleteReport(accessToken: AccessToken, reportId: string) {
    return this._reportsApi.deleteReport(
      reportId,
      accessToken,
      ACCEPT
    );
  }

  /**
   * Gets all Report Mappings for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-report-mappings/
   */
  public async getReportMappings(accessToken: AccessToken, projectId: string) {
    const reportMappings: Array<ReportMapping> = [];

    const reportMappingIterator = this.getReportMappingsAsync(accessToken, projectId);
    for await(const reportMapping of reportMappingIterator) {
      reportMappings.push(reportMapping);
    }
    return reportMappings;
  }

  /**
   * Gets an async iterator for Report Mappings for a Report.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   */
  public getReportMappingsAsync(accessToken: AccessToken, reportId: string): {
    [Symbol.asyncIterator]: () => AsyncGenerator<ReportMapping, void, unknown>;
  } {
    return this.genericIterator<ReportMapping>(
      async (nextUrl: string | undefined): Promise<GenericCollection> => {
        if(nextUrl === undefined) {
          nextUrl = BASE_PATH + "/reports/" + encodeURIComponent(String(reportId)) + "/datasources/imodelMappings";
        }
        const requestOptions : RequestInit = this.createRequest('GET', accessToken);
        const response: ReportMappingCollection = await this.fetch(nextUrl, requestOptions);
        return {
          values: response.mappings,
          _links: response._links,
        };
      });
  }

  /**
   * Creates a Report Mapping.
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {ReportMappingCreate} reportMapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-report-mapping/
   */
  public async createReportMapping(accessToken: AccessToken, reportId: string, reportMapping: ReportMappingCreate) {
    return this._reportsApi.createReportMapping(
      reportId,
      accessToken,
      reportMapping,
      ACCEPT
    );
  }

  /**
   * Deletes a Report Mapping from a Report.
   * @param {string} reportId The Report Id.
   * @param {string} mappingId Id of the Report Mapping to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-report-mapping/
   */
  public async deleteReportMapping(accessToken: AccessToken, reportId: string, reportMappingId: string) {
    return this._reportsApi.deleteReportMapping(
      reportId,
      reportMappingId,
      accessToken,
      ACCEPT
    );
  }

  /**
   * Gets all Mappings for an iModel.
   * @param {string} imodelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
  public async getMappings(accessToken: AccessToken, iModelId: string) {
    const mappings: Array<Mapping> = [];

    const mapIterator = this.getMappingsAsync(accessToken, iModelId);
    for await(const map of mapIterator) {
      mappings.push(map);
    }
    return mappings;
  }

  /**
   * Gets an async iterator for Mappings for an iModel.
   * @param {string} imodelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   */
  public getMappingsAsync(accessToken: AccessToken, iModelId: string): {
    [Symbol.asyncIterator]: () => AsyncGenerator<Mapping, void, unknown>;
  } {
    return this.genericIterator<Mapping>(
      async (nextUrl: string | undefined): Promise<GenericCollection> => {
        if(nextUrl === undefined) {
          nextUrl = BASE_PATH + "/datasources/imodels/" + encodeURIComponent(String(iModelId)) + "/mappings";
        }
        const requestOptions : RequestInit = this.createRequest('GET', accessToken);
        const response: MappingCollection = await this.fetch(nextUrl, requestOptions);
        return {
          values: response.mappings,
          _links: response._links,
        };
      });
  }

  /**
   * Gets a Mapping for an iModel.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mapping/
   */
  public async getMapping(accessToken: AccessToken, mappingId: string, iModelId: string) {
    return this._mappingsApi.getMapping(iModelId, mappingId, accessToken);
  }

  /**
   * Creates a Mapping for an iModel.
   * @param {string} imodelId Id of the iModel for which to create a new Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingCreate} mapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-mapping/
   */
  public async createMapping(
    accessToken: AccessToken,
    iModelId: string,
    mapping: MappingCreate
  ) {
    return this._mappingsApi.createMapping(iModelId, accessToken, mapping);
  }

  /**
   * Updates a Mapping for an iModel.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId Id of the Mapping to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingUpdate} mapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-mapping/
   */
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

  /**
   * Deletes a Mapping for an iModel.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId Id of the Mapping to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-mapping/
   */
  public async deleteMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ) {
    return this._mappingsApi.deleteMapping(iModelId, mappingId, accessToken);
  }

  /**
   * Copies a Mapping and all its Groups, GroupProperties, CalculatedProperties, and CustomCalculations to a target iModel.
   * @param {string} imodelId Id of the source Mapping&#x27;s iModel.
   * @param {string} mappingId Id of the source Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingCopy} mappingCopy Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/copy-mapping/
   */
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

  /**
   * Gets all Groups for a Mapping.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groups/
   */
  public async getGroups(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ) {
    const groups: Array<Group> = [];

    const groupIterator = this.getGroupsAsync(accessToken, iModelId, mappingId);
    for await(const group of groupIterator) {
      groups.push(group);
    }
    return groups;
  }

  /**
   * Gets an async iterator for all Groups of a Mapping.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   */
  public getGroupsAsync(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string):
    {
      [Symbol.asyncIterator]: () => AsyncGenerator<Group, void, unknown>;
    } {
    return this.genericIterator<Group>(
      async (nextUrl: string | undefined): Promise<GenericCollection> => {
        if(nextUrl === undefined) {
          nextUrl = BASE_PATH + "/datasources/imodels/" + encodeURIComponent(String(iModelId)) +
          "/mappings/" + encodeURIComponent(String(mappingId)) + "/groups";
        }
        const requestOptions : RequestInit = this.createRequest('GET', accessToken);
        const response: GroupCollection = await this.fetch(nextUrl, requestOptions);
        return {
          values: response.groups,
          _links: response._links,
        };
      });
  }

  /**
   * Creates a Group for an iModel data source Mapping.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId Id of the Mapping for which to create a new Group.
   * @param {string} AccessToken OAuth access token with scope `insights:modify`
   * @param {GroupCreate} group Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-group/
   */
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

  /**
   * Gets a Group for a Mapping.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-group/
   */
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

  /**
   * Updates a Group for a Mapping.
   * @param {string} imodelId Globally Unique Identifier of the target iModel.
   * @param {string} mappingId Globally Unique Identifier of the target Mapping.
   * @param {string} groupId Id of the Group to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {GroupUpdate} group Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-group/
   */
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

  /**
   * Deletes a Group for a Mapping.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-group/
   */
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

  /**
   * Gets all GroupProperties for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperties/
   */
  public async getGroupProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ) {
    const properties: Array<GroupProperty> = [];

    const groupPropertyIterator = this.getGroupPropertiesAsync(accessToken, iModelId, mappingId, groupId);
    for await(const groupProperty of groupPropertyIterator) {
      properties.push(groupProperty);
    }
    return properties;
  }

  /**
   * Gets an async iterator for all GroupProperties of a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   */
  public getGroupPropertiesAsync(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): {
      [Symbol.asyncIterator]: () => AsyncGenerator<GroupProperty, void, unknown>;
    } {
    return this.genericIterator<GroupProperty>(
      async (nextUrl: string | undefined): Promise<GenericCollection> => {
        if(nextUrl === undefined) {
          nextUrl = BASE_PATH + "/datasources/imodels/" + encodeURIComponent(String(iModelId)) + "/mappings/" + 
          encodeURIComponent(String(mappingId)) + "/groups/" + encodeURIComponent(String(groupId)) + "/properties";
        }
        const requestOptions : RequestInit = this.createRequest('GET', accessToken);
        const response: GroupPropertyCollection = await this.fetch(nextUrl, requestOptions);
        return {
          values: response.properties,
          _links: response._links,
        };
      });
  }

  /**
   * Gets a GroupProperty for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The GroupProperty Id.
   * @param {string} accessToken access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperty/
   */
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

  /**
   * Creates a GroupProperty for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new GroupProperty.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {GroupPropertyCreate} groupProperty Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-groupproperty/
   */
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

  /**
   * Updates a GroupProperty for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the GroupProperty to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {GroupPropertyUpdate} groupProperty Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-groupproperty/
   */
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

  /**
   * Deletes a GroupProperty from a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the GroupProperty to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-groupproperty/
   */
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

  /**
   * Gets all CalculatedProperties for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperties/
   */
  public async getCalculatedProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ) {
    const properties: Array<CalculatedProperty> = [];

    const calculatedPropertyIterator = this.getCalculatedPropertiesAsync(accessToken, iModelId, mappingId, groupId);
    for await(const calculatedProperty of calculatedPropertyIterator) {
      properties.push(calculatedProperty);
    }
    return properties;
  }

  /**
   * Gets an async iterator for all CalculatedProperties of a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   */
  public getCalculatedPropertiesAsync(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): {
      [Symbol.asyncIterator]: () => AsyncGenerator<CalculatedProperty, void, unknown>;
    } {
    return this.genericIterator<CalculatedProperty>(
      async (nextUrl: string | undefined): Promise<GenericCollection> => {
        if(nextUrl === undefined) {
          nextUrl = BASE_PATH + "/datasources/imodels/" + encodeURIComponent(String(iModelId)) + "/mappings/" + 
          encodeURIComponent(String(mappingId)) + "/groups/" + encodeURIComponent(String(groupId)) + "/calculatedProperties";
        }
        const requestOptions : RequestInit = this.createRequest('GET', accessToken);
        const response: CalculatedPropertyCollection = await this.fetch(nextUrl, requestOptions);
        return {
          values: response.properties,
          _links: response._links,
        };
      });
  }

  /**
   * Gets a CalculatedProperty for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The CalculatedProperty Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperty/
   */
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

  /**
   * Creates a CalculatedProperty for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new CalculatedProperty.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {CalculatedPropertyCreate} property Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-calculatedproperty/
   */
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

  /**
   * Updates a CalculatedProperty for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the CalculatedProperty to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {CalculatedPropertyUpdate} property Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-calculatedproperty/
   */
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

  /**
   * Deletes a CalculatedProperty from a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the CalculatedProperty to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-calculatedproperty/
   */
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

  /**
   * Gets all CustomCalculations for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculations/
   */
  public async getCustomCalculations(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ) {
    const customCalculations: Array<CustomCalculation> = [];

    const customCalculationsIterator = this.getCustomCalculationsAsync(accessToken, iModelId, mappingId, groupId);
    for await(const customCalculation of customCalculationsIterator) {
      customCalculations.push(customCalculation);
    }
    return customCalculations;
  }

  /**
   * Gets an async iterator for all CustomCalculations of a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   */
  public getCustomCalculationsAsync(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): {
      [Symbol.asyncIterator]: () => AsyncGenerator<CustomCalculation, void, unknown>;
    } {
    return this.genericIterator<CustomCalculation>(
      async (nextUrl: string | undefined): Promise<GenericCollection> => {
        if(nextUrl === undefined) {
          nextUrl = BASE_PATH + "/datasources/imodels/" + encodeURIComponent(String(iModelId)) + "/mappings/" + 
          encodeURIComponent(String(mappingId)) + "/groups/" + encodeURIComponent(String(groupId)) + "/customCalculations";
        }
        const requestOptions : RequestInit = this.createRequest('GET', accessToken);
        const response: CustomCalculationCollection = await this.fetch(nextUrl, requestOptions);
        return {
          values: response.customCalculations,
          _links: response._links,
        };
      });
  }

  /**
   * Gets a CustomCalculation for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The CustomCalculation Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculation/
   */
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

  /**
   * Creates a CustomCalculation for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new CustomCalculation.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {CustomCalculationCreate} property Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-customcalculation/
   */
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

  /**
   * Updates a CustomCalculation for a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} customCalculationId Id of the CustomCalculation to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {CustomCalculationUpdate} property Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-customcalculation/
   */
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

  /**
   * Deletes a CustomCalculation from a Group.
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} customCalculationId Id of the CustomCalculation to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-customcalculation/
   */
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
}
