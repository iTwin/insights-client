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
  constructor(prefix?: "dev" | "qa" | "") {
    const baseUrl = prefixUrl(REPORTING_BASE_PATH, prefix ? `${prefix}-` : process.env.IMJS_URL_PREFIX);
    this._dataAccessApi = new DataAccessApi(undefined, baseUrl);
    this._mappingsApi = new MappingsApi(undefined, baseUrl);
    this._reportsApi = new ReportsApi(undefined, baseUrl);
    this._extractionApi = new ExtractionApi(undefined, baseUrl);
  }

  //#region Data Access Endpoints

  /**
   * ---    Lists all OData Entities for a Report. This endpoint can be used as an OData feed in applications like Excel or Power BI.    ### Notes    This is an OData v4 compliant endpoint.    This endpoint should only be accessed using OData compliant libraries and tools such as Power BI.    Use of these endpoints directly is not prohibited, however we recommend understanding the [OData protocols and conventions](https://www.odata.org/documentation/) first.    ### Authentication    Requires `Authorization` header with one of schemes:    - Valid [API Key](/apis/insights/api-keys) used as the password in Basic auth.  - Valid Bearer token for scope `insights:read`.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary OData
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
  public async getODataReport(accessToken: AccessToken, reportId: string) {
    return this._dataAccessApi.odata(reportId, accessToken);
  }

  /**
   * ---    Lists the raw table data for a Report Entity.     ### Notes    This is an OData v4 compliant endpoint.    This endpoint should only be accessed using OData compliant libraries and tools such as Power BI.    Use of these endpoints directly is not prohibited, however we recommend understanding the [OData protocols and conventions](https://www.odata.org/documentation/) first.    ### Authentication    Requires `Authorization` header with one of schemes:    - Valid [API Key](/apis/insights/api-keys) used as the password in Basic auth.  - Valid Bearer token for scope `insights:read`.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary OData Entity
   * @param {string} reportId The Report Id.
   * @param {ODataItem} odataItem Reference to a table exported to your Report. Use {@link getODataReport()} to fetch a list of ODataItems in the report.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
  public async getODataReportEntity(accessToken: AccessToken, reportId: string, odataItem: ODataItem) {
    const segments = odataItem?.url?.split('/');
    if (segments?.length !== 3) {
      return undefined;
    }
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

  /**
   * ---    Lists schemas for all Entities tied to a Report.    ### Notes    This is an OData v4 compliant endpoint.    This endpoint should only be accessed using OData compliant libraries and tools such as Power BI.    Use of these endpoints directly is not prohibited, however we recommend understanding the [OData protocols and conventions](https://www.odata.org/documentation/) first.    ### Authentication    Requires `Authorization` header with one of schemes:    - Valid [API Key](/apis/insights/api-keys) used as the password in Basic auth.  - Valid Bearer token for scope `insights:read`.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary OData Metadata
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
  public async getODataReportMetadata(accessToken: AccessToken, reportId: string) {
    return this._dataAccessApi.odataMetadata(reportId, accessToken);
  }

  //#endregion

  //#region Extraction Endpoints

  /**
   * ---    Gets Logs of an Extraction Run.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Extraction Logs
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Manually run Extraction of data from an iModel. Latest Named Version is used for Extraction.    For the iModel data source, data must be Extracted first before it can be used in your Reports.    ### Notes    iModel data Extraction is executed automatically after new Named Version is created. Do not call this API on scheduled basis or after making changes to an iModel.    Only call this API after creating or changing an iModel Mapping.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Run Extraction
   * @param {string} imodelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @memberof ReportingClient
   */
  public runExtraction(accessToken: AccessToken, iModelId: string) {
    return this._extractionApi.runExtraction(
      iModelId,
      accessToken,
      ACCEPT
    );
  }

  /**
   * ---    Gets the Status of an Extraction Run.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Extraction Status
   * @param {string} jobId Unique Identifier of the Extraction Run.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
  public async getExtractionStatus(accessToken: AccessToken, jobId: string) {
    return this._extractionApi.getExtractionStatus(
      jobId,
      accessToken,
      ACCEPT
    );

  }

  //#endregion

  //#region Reports Endpoints

  /**
   * ---    Gets all Reports within the context of a Project.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Reports
   * @param {string} projectId The Project Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Gets a single Report.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Report
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
  public async getReport(accessToken: AccessToken, projectId: string, reportId: string) {
    return this._reportsApi.getReport(
      projectId,
      reportId,
      accessToken
    );
  }

  /**
   * ---    Creates a Report within the context of a Project.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_modify` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Create Report
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {ReportCreate} report Request body.
   * @memberof ReportingClient
   */
  public async createReport(accessToken: AccessToken, report: ReportCreate) {
    return this._reportsApi.createReport(
      accessToken,
      report,
      ACCEPT
    );
  }

  /**
   * ---    Updates a Report.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_modify` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Update Report
   * @param {string} reportId Id of the Report to be updated.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {ReportUpdate} report Request body.
   * @memberof ReportingClient
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
   * ---    Marks a Report for deletetion. Reports are permanently deleted one month after being marked for deletion. A Report marked for deletion can be restored if it hasn't been permanently deleted yet.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_modify` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Delete Report
   * @param {string} reportId Id of the Report to be deleted.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @memberof ReportingClient
   */
  public async deleteReport(accessToken: AccessToken, reportId: string) {
    return this._reportsApi.deleteReport(
      reportId,
      accessToken,
      ACCEPT
    );
  }

  /**
   * ---    Gets all Report Mappings for a Report.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Report Mappings
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Creates a Report Mapping. Each one links a Mapping to a Report and each Report can have more than one Report Mapping.     ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read`, `insights_modify` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Create Report Mapping
   * @param {string} reportId The Report Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {ReportMappingCreate} reportMapping Request body.
   * @memberof ReportingClient
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
   * ---    Deletes a Report Mapping from a Report.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_modify` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Delete Report Mapping
   * @param {string} reportId The Report Id.
   * @param {string} mappingId Id of the Report Mapping to be deleted.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Gets all Mappings for an iModel.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Mappings
   * @param {string} imodelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Gets a Mapping for an iModel.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Mapping
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
  public async getMapping(accessToken: AccessToken, mappingId: string, iModelId: string) {
    return this._mappingsApi.getMapping(iModelId, mappingId, accessToken);
  }

  /**
   * ---    Creates a Mapping for an iModel. Each Mapping represents a collection of tables (Groups) of data that can be consumed in a Report.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Create Mapping
   * @param {string} imodelId Id of the iModel for which to create a new Mapping.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {MappingCreate} mapping Request body.
   * @memberof ReportingClient
   */
  public async createMapping(
    accessToken: AccessToken,
    iModelId: string,
    mapping: MappingCreate
  ) {
    return this._mappingsApi.createMapping(iModelId, accessToken, mapping);
  }

  /**
   * ---    Updates a Mapping for an iModel.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Update Mapping
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId Id of the Mapping to be updated.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {MappingUpdate} mapping Request body.
   * @memberof ReportingClient
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
   * ---    Deletes a Mapping for an iModel.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Delete Mapping
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId Id of the Mapping to be deleted.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @memberof ReportingClient
   */
  public async deleteMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ) {
    return this._mappingsApi.deleteMapping(iModelId, mappingId, accessToken);
  }

  /**
   * ---    Copies a Mapping and all its Groups, GroupProperties, CalculatedProperties, and CustomCalculations to a target iModel.    The `mappingName` request body property is optional. If the `mappingName` is not provided the new Mapping will have the same name as the source Mapping but with the `_Copy` appendix. If the `mappingName` is provided the new Mapping will have the provided name.    The `mappingName` property becomes mandatory if the source Mapping has 124 or more characters in its name.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Copy Mapping
   * @param {string} imodelId Id of the source Mapping&#x27;s iModel.
   * @param {string} mappingId Id of the source Mapping.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {MappingCopy} mappingCopy Request body.
   * @memberof ReportingClient
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
   * ---    Gets all Groups for a Mapping.    ### Group Query    The `query` parameter of a Group supports ECSql and ECClassIds.    If a valid ECSql query is given and the selected class is `bis.Element`, or if it is a descendant of the class `bis.Element`, the only required column is `ECInstanceId`.    - `SELECT * FROM bis.Element` is a valid query  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT * FROM Building.Beam` is a valid query  - `SELECT ECInstanceId FROM bis.Element` is a valid query  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT ECInstanceId FROM Building.Beam` is valid  - `SELECT ECClassId FROM bis.Element` is _not_ a valid query because ECInstanceId column is missing  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT ECClassId FROM Building.Beam` is _not_ valid because ECInstanceId column is missing  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.ECInstanceId FROM bis.Element E JOIN Building.BeamAspect A ON A.Element.id = E.ECInstanceId` is _not_ valid because the selected `ECInstanceId` is of the aspect, not the element  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.Element.id FROM Building.BeamAspect` is _not_ valid because the selected column's name is not `ECInstanceId`  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.Element.id ECInstanceId FROM Building.BeamAspect` is valid    In all other cases when providing an ECSql query it is required to select `ECInstanceId`, `ECClassId`, and all other columns that you are planning to use for mapping. If only `ECInstanceId` and `ECClassId` are selected and other columns are used for mapping, those columns will be filled with `null` values. If either `ECInstanceId` or `ECClassId` column is not selected, the query will not produce any output.    If the `query` parameter does not contain a valid ECSql query, then it must be equal to `bis.Element`, `bis.ElementAspect`, or any of their descendants.    The ECClassId format `{schemaName}:{schemaItemName}` where `schemaName` does not contain a 3-part version number is supported.    The ECClassId format `{schemaName}.{schemaItemName}` is supported.    The ECClassId format `{schemaAlias}:{schemaItemName}` where `schemaAlias` is the alias of a `schemaName` is supported.    The ECClassId format `{schemaFullName}:{schemaItemName}` where `schemaFullName` contains a 3-part version number is _not_ supported.    When the given ECClassId is equal to `bis.Element` or is one of its descendants, then all elements with the ECClassId will be selected.    When the given ECClassId is equal to `bis.ElementAspect` or is one of its descendants, then all elements that have such aspect will be selected.    When the given ECClassId is none of the above, the query will not produce any output.    - If a class `Building.Beam` does not have any subclasses and the `query` parameter is set to `Building.Beam`, then all elements with ECClassIds of `Building.Beam` will be selected  - If there is a class `Building.StructuralMember` which has 2 subclasses `Building.Beam` and `Building.Column`, and the `query` parameter is set to `Building.StructuralMember`, then all elements with ECClassIds of `Building.StructuralMember`, `Building.Beam`, and `Building.Column` will be selected  - If a class `Building.BeamAspect` inherits from a class `bis.ElementAspect` (is unique or multi aspect) and the `query` parameter is set to `Building.BeamAspect`, then all elements that have a `Building.BeamAspect` attached to them will be selected. This query will _not_ select the aspects themselves, but the elements that they are attached to. The selected elements may have any ECClassId  - If there is class `Building.StructuralMemberAspect` which has 2 subclasses `Building.BeamAspect` and `Building.ColumnAspect`, the `Building.StructuralMemberAspect` class inherits from a class `bis.ElementAspect` (is unique or multi aspect) and the `query` parameter is set to `Building.StructuralMemberAspect`, then all elements that have `Building.StructuralMemberAspect`, `Building.BeamAspect`, or `Building.ColumnAspect` attached to them will be selected. This query will _not_ select the aspects themselves, but the elements that they are attached to. The selected elements may have any ECClassId    If different queries are needed for a single output table, then create multiple Groups with those different queries but with the same name for each Group. That will cause results of all these queries to be concatenated into a single output table. The output table will have column list equal to a union of all GroupProperties of Groups with the same name.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Groups
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Creates a Group for an iModel data source Mapping. A Group is a collection of design elements from an iModel represented by an [ECSQL](https://www.itwinjs.org/learning/ecsql/) query and defines one table in the output data of a report.    ### Group Query    The `query` parameter of a Group supports ECSql and ECClassIds.    If a valid ECSql query is given and the selected class is `bis.Element`, or if it is a descendant of the class `bis.Element`, the only required column is `ECInstanceId`.    - `SELECT * FROM bis.Element` is a valid query  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT * FROM Building.Beam` is a valid query  - `SELECT ECInstanceId FROM bis.Element` is a valid query  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT ECInstanceId FROM Building.Beam` is valid  - `SELECT ECClassId FROM bis.Element` is _not_ a valid query because ECInstanceId column is missing  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT ECClassId FROM Building.Beam` is _not_ valid because ECInstanceId column is missing  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.ECInstanceId FROM bis.Element E JOIN Building.BeamAspect A ON A.Element.id = E.ECInstanceId` is _not_ valid because the selected `ECInstanceId` is of the aspect, not the element  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.Element.id FROM Building.BeamAspect` is _not_ valid because the selected column's name is not `ECInstanceId`  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.Element.id ECInstanceId FROM Building.BeamAspect` is valid    In all other cases when providing an ECSql query it is required to select `ECInstanceId`, `ECClassId`, and all other columns that you are planning to use for mapping. If only `ECInstanceId` and `ECClassId` are selected and other columns are used for mapping, those columns will be filled with `null` values. If either `ECInstanceId` or `ECClassId` column is not selected, the query will not produce any output.    If the `query` parameter does not contain a valid ECSql query, then it must be equal to `bis.Element`, `bis.ElementAspect`, or any of their descendants.    The ECClassId format `{schemaName}:{schemaItemName}` where `schemaName` does not contain a 3-part version number is supported.    The ECClassId format `{schemaName}.{schemaItemName}` is supported.    The ECClassId format `{schemaAlias}:{schemaItemName}` where `schemaAlias` is the alias of a `schemaName` is supported.    The ECClassId format `{schemaFullName}:{schemaItemName}` where `schemaFullName` contains a 3-part version number is _not_ supported.    When the given ECClassId is equal to `bis.Element` or is one of its descendants, then all elements with the ECClassId will be selected.    When the given ECClassId is equal to `bis.ElementAspect` or is one of its descendants, then all elements that have such aspect will be selected.    When the given ECClassId is none of the above, the query will not produce any output.    - If a class `Building.Beam` does not have any subclasses and the `query` parameter is set to `Building.Beam`, then all elements with ECClassIds of `Building.Beam` will be selected  - If there is a class `Building.StructuralMember` which has 2 subclasses `Building.Beam` and `Building.Column`, and the `query` parameter is set to `Building.StructuralMember`, then all elements with ECClassIds of `Building.StructuralMember`, `Building.Beam`, and `Building.Column` will be selected  - If a class `Building.BeamAspect` inherits from a class `bis.ElementAspect` (is unique or multi aspect) and the `query` parameter is set to `Building.BeamAspect`, then all elements that have a `Building.BeamAspect` attached to them will be selected. This query will _not_ select the aspects themselves, but the elements that they are attached to. The selected elements may have any ECClassId  - If there is class `Building.StructuralMemberAspect` which has 2 subclasses `Building.BeamAspect` and `Building.ColumnAspect`, the `Building.StructuralMemberAspect` class inherits from a class `bis.ElementAspect` (is unique or multi aspect) and the `query` parameter is set to `Building.StructuralMemberAspect`, then all elements that have `Building.StructuralMemberAspect`, `Building.BeamAspect`, or `Building.ColumnAspect` attached to them will be selected. This query will _not_ select the aspects themselves, but the elements that they are attached to. The selected elements may have any ECClassId    If different queries are needed for a single output table, then create multiple Groups with those different queries but with the same name for each Group. That will cause results of all these queries to be concatenated into a single output table. The output table will have column list equal to a union of all GroupProperties of Groups with the same name.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Create Group
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId Id of the Mapping for which to create a new Group.
   * @param {string} AccessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {GroupCreate} group Request body.
   * @memberof ReportingClient
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
   * ---    Gets a Group for a Mapping.    ### Group Query    The `query` parameter of a Group supports ECSql and ECClassIds.    If a valid ECSql query is given and the selected class is `bis.Element`, or if it is a descendant of the class `bis.Element`, the only required column is `ECInstanceId`.    - `SELECT * FROM bis.Element` is a valid query  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT * FROM Building.Beam` is a valid query  - `SELECT ECInstanceId FROM bis.Element` is a valid query  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT ECInstanceId FROM Building.Beam` is valid  - `SELECT ECClassId FROM bis.Element` is _not_ a valid query because ECInstanceId column is missing  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT ECClassId FROM Building.Beam` is _not_ valid because ECInstanceId column is missing  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.ECInstanceId FROM bis.Element E JOIN Building.BeamAspect A ON A.Element.id = E.ECInstanceId` is _not_ valid because the selected `ECInstanceId` is of the aspect, not the element  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.Element.id FROM Building.BeamAspect` is _not_ valid because the selected column's name is not `ECInstanceId`  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.Element.id ECInstanceId FROM Building.BeamAspect` is valid    In all other cases when providing an ECSql query it is required to select `ECInstanceId`, `ECClassId`, and all other columns that you are planning to use for mapping. If only `ECInstanceId` and `ECClassId` are selected and other columns are used for mapping, those columns will be filled with `null` values. If either `ECInstanceId` or `ECClassId` column is not selected, the query will not produce any output.    If the `query` parameter does not contain a valid ECSql query, then it must be equal to `bis.Element`, `bis.ElementAspect`, or any of their descendants.    The ECClassId format `{schemaName}:{schemaItemName}` where `schemaName` does not contain a 3-part version number is supported.    The ECClassId format `{schemaName}.{schemaItemName}` is supported.    The ECClassId format `{schemaAlias}:{schemaItemName}` where `schemaAlias` is the alias of a `schemaName` is supported.    The ECClassId format `{schemaFullName}:{schemaItemName}` where `schemaFullName` contains a 3-part version number is _not_ supported.    When the given ECClassId is equal to `bis.Element` or is one of its descendants, then all elements with the ECClassId will be selected.    When the given ECClassId is equal to `bis.ElementAspect` or is one of its descendants, then all elements that have such aspect will be selected.    When the given ECClassId is none of the above, the query will not produce any output.    - If a class `Building.Beam` does not have any subclasses and the `query` parameter is set to `Building.Beam`, then all elements with ECClassIds of `Building.Beam` will be selected  - If there is a class `Building.StructuralMember` which has 2 subclasses `Building.Beam` and `Building.Column`, and the `query` parameter is set to `Building.StructuralMember`, then all elements with ECClassIds of `Building.StructuralMember`, `Building.Beam`, and `Building.Column` will be selected  - If a class `Building.BeamAspect` inherits from a class `bis.ElementAspect` (is unique or multi aspect) and the `query` parameter is set to `Building.BeamAspect`, then all elements that have a `Building.BeamAspect` attached to them will be selected. This query will _not_ select the aspects themselves, but the elements that they are attached to. The selected elements may have any ECClassId  - If there is class `Building.StructuralMemberAspect` which has 2 subclasses `Building.BeamAspect` and `Building.ColumnAspect`, the `Building.StructuralMemberAspect` class inherits from a class `bis.ElementAspect` (is unique or multi aspect) and the `query` parameter is set to `Building.StructuralMemberAspect`, then all elements that have `Building.StructuralMemberAspect`, `Building.BeamAspect`, or `Building.ColumnAspect` attached to them will be selected. This query will _not_ select the aspects themselves, but the elements that they are attached to. The selected elements may have any ECClassId    If different queries are needed for a single output table, then create multiple Groups with those different queries but with the same name for each Group. That will cause results of all these queries to be concatenated into a single output table. The output table will have column list equal to a union of all GroupProperties of Groups with the same name.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get Group
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
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
   * ---    Updates a Group for a Mapping.    ### Group Query    The `query` parameter of a Group supports ECSql and ECClassIds.    If a valid ECSql query is given and the selected class is `bis.Element`, or if it is a descendant of the class `bis.Element`, the only required column is `ECInstanceId`.    - `SELECT * FROM bis.Element` is a valid query  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT * FROM Building.Beam` is a valid query  - `SELECT ECInstanceId FROM bis.Element` is a valid query  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT ECInstanceId FROM Building.Beam` is valid  - `SELECT ECClassId FROM bis.Element` is _not_ a valid query because ECInstanceId column is missing  - Assuming that class `Building.Beam` is a descendant of the class `bis.Element`, the query `SELECT ECClassId FROM Building.Beam` is _not_ valid because ECInstanceId column is missing  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.ECInstanceId FROM bis.Element E JOIN Building.BeamAspect A ON A.Element.id = E.ECInstanceId` is _not_ valid because the selected `ECInstanceId` is of the aspect, not the element  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.Element.id FROM Building.BeamAspect` is _not_ valid because the selected column's name is not `ECInstanceId`  - Assuming that `Building.BeamAspect` is an aspect, the query `SELECT A.Element.id ECInstanceId FROM Building.BeamAspect` is valid    In all other cases when providing an ECSql query it is required to select `ECInstanceId`, `ECClassId`, and all other columns that you are planning to use for mapping. If only `ECInstanceId` and `ECClassId` are selected and other columns are used for mapping, those columns will be filled with `null` values. If either `ECInstanceId` or `ECClassId` column is not selected, the query will not produce any output.    If the `query` parameter does not contain a valid ECSql query, then it must be equal to `bis.Element`, `bis.ElementAspect`, or any of their descendants.    The ECClassId format `{schemaName}:{schemaItemName}` where `schemaName` does not contain a 3-part version number is supported.    The ECClassId format `{schemaName}.{schemaItemName}` is supported.    The ECClassId format `{schemaAlias}:{schemaItemName}` where `schemaAlias` is the alias of a `schemaName` is supported.    The ECClassId format `{schemaFullName}:{schemaItemName}` where `schemaFullName` contains a 3-part version number is _not_ supported.    When the given ECClassId is equal to `bis.Element` or is one of its descendants, then all elements with the ECClassId will be selected.    When the given ECClassId is equal to `bis.ElementAspect` or is one of its descendants, then all elements that have such aspect will be selected.    When the given ECClassId is none of the above, the query will not produce any output.    - If a class `Building.Beam` does not have any subclasses and the `query` parameter is set to `Building.Beam`, then all elements with ECClassIds of `Building.Beam` will be selected  - If there is a class `Building.StructuralMember` which has 2 subclasses `Building.Beam` and `Building.Column`, and the `query` parameter is set to `Building.StructuralMember`, then all elements with ECClassIds of `Building.StructuralMember`, `Building.Beam`, and `Building.Column` will be selected  - If a class `Building.BeamAspect` inherits from a class `bis.ElementAspect` (is unique or multi aspect) and the `query` parameter is set to `Building.BeamAspect`, then all elements that have a `Building.BeamAspect` attached to them will be selected. This query will _not_ select the aspects themselves, but the elements that they are attached to. The selected elements may have any ECClassId  - If there is class `Building.StructuralMemberAspect` which has 2 subclasses `Building.BeamAspect` and `Building.ColumnAspect`, the `Building.StructuralMemberAspect` class inherits from a class `bis.ElementAspect` (is unique or multi aspect) and the `query` parameter is set to `Building.StructuralMemberAspect`, then all elements that have `Building.StructuralMemberAspect`, `Building.BeamAspect`, or `Building.ColumnAspect` attached to them will be selected. This query will _not_ select the aspects themselves, but the elements that they are attached to. The selected elements may have any ECClassId    If different queries are needed for a single output table, then create multiple Groups with those different queries but with the same name for each Group. That will cause results of all these queries to be concatenated into a single output table. The output table will have column list equal to a union of all GroupProperties of Groups with the same name.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Update Group
   * @param {string} imodelId Globally Unique Identifier of the target iModel.
   * @param {string} mappingId Globally Unique Identifier of the target Mapping.
   * @param {string} groupId Id of the Group to be updated.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {GroupUpdate} group Request body.
   * @memberof ReportingClient
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
   * ---    Deletes a Group for a Mapping.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Delete Group
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group to be deleted.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @memberof ReportingClient
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
   * ---    Gets all GroupProperties for a Group.    ### Mapping ECProperties    GroupProperties define mappings from ECProperties on an iModel to columns. They allow mapping the queried, element, element aspect, or related element properties.    Content of the columns depend on the `ecProperties` field. The `ecProperties` field is a prioritized array which contains `ECProperty` entities. The closer the `ECProperty` is to the array's start, the higher the priority. The priority of `ECProperty` can be changed by reordering the `ecProperties` array. Reading of the `ecProperties` array stops when a valid value is found. For example, if the `ecProperties` array contains two entries and the first entry results in a null or undefined value, it will take the second entry. The value can be undefined if the given ECProperty does not exist. The result column will be filled with a null value if no valid value was found.    Evaluating `ecProperties` is prioritized by:    1. Queried properties  2. Element properties  3. Element aspect properties    Having queried properties as the highest priority allows for constant or complex values to be added to a mapping.    `ECProperty` lookup is defined by three values - `ECSchemaName`, `ECClassName`, and `ECPropertyName`.    `ECSchemaName` and `ECClassName` are used together to create a ECClassId which is the ECClassId of the current row when selecting a property. If the ECClassId of a selected row does not match the `ECSchemaName` and `ECClassName` pair, the value for this `ECProperty` is considered undefined. If the formed ECClassId is of an element aspect, the current selected row is an element and there is only one instance of that element aspect related to the element, the property lookup is done on the element aspect.    `ECSchemaName` and `ECClassName` are case-insensitive.    `ECSchemaName` and `ECClassName` can be set to a wildcard value `*`.    - If the value of `ECSchemaName` is `*` and the value of `ECClassName` is `Beam`, then it will match any `Beam` class from any schema (e.g. `Building.Beam`, `Structural.Beam`, etc.)  - If the value of `ECSchemaName` is `Building` and the value of `ECClassName` is `*`, then it will match any class from the schema `Building` (e.g. `Building.Beam`, `Building.CurtainWall`, etc.)  - If values of `ECSchemaName` and `ECClassName` are `*`, then it will match any ECClassId (e.g. `Building.Beam`, `Structural.Column`, etc.)  - If either value of `ECSchemaName` or `ECClassName` are `*`, then no element aspect lookup is done    Class inheritance is checked if there is no wildcard value.    - If the value of `ECSchemaName` is `Building` and the value of `ECClassName` is `StructuralMember`, then it will match any ECClassId which inherits `Building.StructuralMember` (e.g. `Building.Beam` which inherits `Building.StructuralMember`, `Building.Column` which inherits `Building.StructuralMember`, etc)  - If `ECSchemaName` or `ECClassName` is a wildcard, then inheritance will not be checked    Set `ECPropertyName` to a property name that you want to select. The value of `ECPropertyName` can also be a path defining how to find a property. The path segments must be separated by a period (`.`). The path can contain the names of:    - A navigation property  - A struct property  - A string property that happens to contain a string representation of a json object  - A property inside the selected json    Names of properties are not case sensitive. If json object does not have duplicate property names which only differ in letter casing, then those json properties are not case sensitive. We recommend treating json properties as case sensitive.    - If `Category` property is a navigation property with a value of `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` and the `ECPropertyName` is set to `Category` or `category`, then the whole value `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` will be selected  - If `Category` property is a navigation property with a value of `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` and the `ECPropertyName` is set to `Category.id`, then only the `id` value `0x2000000000b` will be selected  - If `Category` property is a navigation property and it points to a row that has a property `CodeValue` that we want to select, the `ECPropertyName` should be set to `Category.CodeValue`  - If `Model` property is a navigation property and it points to a row that has a property `JsonProperties` with a value `{\"formatter\":{\"mastUnit\":{\"label\":\"m\"}}}` and we want to select the master unit label, the `ECPropertyName` should be set to `Model.JsonProperties.formatter.mastUnit.label`. The result will be `m`    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get GroupProperties
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Gets a GroupProperty for a Group.    ### Mapping ECProperties    GroupProperties define mappings from ECProperties on an iModel to columns. They allow mapping the queried, element, element aspect, or related element properties.    Content of the columns depend on the `ecProperties` field. The `ecProperties` field is a prioritized array which contains `ECProperty` entities. The closer the `ECProperty` is to the array's start, the higher the priority. The priority of `ECProperty` can be changed by reordering the `ecProperties` array. Reading of the `ecProperties` array stops when a valid value is found. For example, if the `ecProperties` array contains two entries and the first entry results in a null or undefined value, it will take the second entry. The value can be undefined if the given ECProperty does not exist. The result column will be filled with a null value if no valid value was found.    Evaluating `ecProperties` is prioritized by:    1. Queried properties  2. Element properties  3. Element aspect properties    Having queried properties as the highest priority allows for constant or complex values to be added to a mapping.    `ECProperty` lookup is defined by three values - `ECSchemaName`, `ECClassName`, and `ECPropertyName`.    `ECSchemaName` and `ECClassName` are used together to create a ECClassId which is the ECClassId of the current row when selecting a property. If the ECClassId of a selected row does not match the `ECSchemaName` and `ECClassName` pair, the value for this `ECProperty` is considered undefined. If the formed ECClassId is of an element aspect, the current selected row is an element and there is only one instance of that element aspect related to the element, the property lookup is done on the element aspect.    `ECSchemaName` and `ECClassName` are case-insensitive.    `ECSchemaName` and `ECClassName` can be set to a wildcard value `*`.    - If the value of `ECSchemaName` is `*` and the value of `ECClassName` is `Beam`, then it will match any `Beam` class from any schema (e.g. `Building.Beam`, `Structural.Beam`, etc.)  - If the value of `ECSchemaName` is `Building` and the value of `ECClassName` is `*`, then it will match any class from the schema `Building` (e.g. `Building.Beam`, `Building.CurtainWall`, etc.)  - If values of `ECSchemaName` and `ECClassName` are `*`, then it will match any ECClassId (e.g. `Building.Beam`, `Structural.Column`, etc.)  - If either value of `ECSchemaName` or `ECClassName` are `*`, then no element aspect lookup is done    Class inheritance is checked if there is no wildcard value.    - If the value of `ECSchemaName` is `Building` and the value of `ECClassName` is `StructuralMember`, then it will match any ECClassId which inherits `Building.StructuralMember` (e.g. `Building.Beam` which inherits `Building.StructuralMember`, `Building.Column` which inherits `Building.StructuralMember`, etc)  - If `ECSchemaName` or `ECClassName` is a wildcard, then inheritance will not be checked    Set `ECPropertyName` to a property name that you want to select. The value of `ECPropertyName` can also be a path defining how to find a property. The path segments must be separated by a period (`.`). The path can contain the names of:    - A navigation property  - A struct property  - A string property that happens to contain a string representation of a json object  - A property inside the selected json    Names of properties are not case sensitive. If json object does not have duplicate property names which only differ in letter casing, then those json properties are not case sensitive. We recommend treating json properties as case sensitive.    - If `Category` property is a navigation property with a value of `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` and the `ECPropertyName` is set to `Category` or `category`, then the whole value `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` will be selected  - If `Category` property is a navigation property with a value of `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` and the `ECPropertyName` is set to `Category.id`, then only the `id` value `0x2000000000b` will be selected  - If `Category` property is a navigation property and it points to a row that has a property `CodeValue` that we want to select, the `ECPropertyName` should be set to `Category.CodeValue`  - If `Model` property is a navigation property and it points to a row that has a property `JsonProperties` with a value `{\"formatter\":{\"mastUnit\":{\"label\":\"m\"}}}` and we want to select the master unit label, the `ECPropertyName` should be set to `Model.JsonProperties.formatter.mastUnit.label`. The result will be `m`    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get GroupProperty
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The GroupProperty Id.
   * @param {string} accessToken access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
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
   * ---    Creates a GroupProperty for a Group. Each GroupProperty defines a column of mapped data.    ### Mapping ECProperties    GroupProperties define mappings from ECProperties on an iModel to columns. They allow mapping the queried, element, element aspect, or related element properties.    Content of the columns depend on the `ecProperties` field. The `ecProperties` field is a prioritized array which contains `ECProperty` entities. The closer the `ECProperty` is to the array's start, the higher the priority. The priority of `ECProperty` can be changed by reordering the `ecProperties` array. Reading of the `ecProperties` array stops when a valid value is found. For example, if the `ecProperties` array contains two entries and the first entry results in a null or undefined value, it will take the second entry. The value can be undefined if the given ECProperty does not exist. The result column will be filled with a null value if no valid value was found.    Evaluating `ecProperties` is prioritized by:    1. Queried properties  2. Element properties  3. Element aspect properties    Having queried properties as the highest priority allows for constant or complex values to be added to a mapping.    `ECProperty` lookup is defined by three values - `ECSchemaName`, `ECClassName`, and `ECPropertyName`.    `ECSchemaName` and `ECClassName` are used together to create a ECClassId which is the ECClassId of the current row when selecting a property. If the ECClassId of a selected row does not match the `ECSchemaName` and `ECClassName` pair, the value for this `ECProperty` is considered undefined. If the formed ECClassId is of an element aspect, the current selected row is an element and there is only one instance of that element aspect related to the element, the property lookup is done on the element aspect.    `ECSchemaName` and `ECClassName` are case-insensitive.    `ECSchemaName` and `ECClassName` can be set to a wildcard value `*`.    - If the value of `ECSchemaName` is `*` and the value of `ECClassName` is `Beam`, then it will match any `Beam` class from any schema (e.g. `Building.Beam`, `Structural.Beam`, etc.)  - If the value of `ECSchemaName` is `Building` and the value of `ECClassName` is `*`, then it will match any class from the schema `Building` (e.g. `Building.Beam`, `Building.CurtainWall`, etc.)  - If values of `ECSchemaName` and `ECClassName` are `*`, then it will match any ECClassId (e.g. `Building.Beam`, `Structural.Column`, etc.)  - If either value of `ECSchemaName` or `ECClassName` are `*`, then no element aspect lookup is done    Class inheritance is checked if there is no wildcard value.    - If the value of `ECSchemaName` is `Building` and the value of `ECClassName` is `StructuralMember`, then it will match any ECClassId which inherits `Building.StructuralMember` (e.g. `Building.Beam` which inherits `Building.StructuralMember`, `Building.Column` which inherits `Building.StructuralMember`, etc)  - If `ECSchemaName` or `ECClassName` is a wildcard, then inheritance will not be checked    Set `ECPropertyName` to a property name that you want to select. The value of `ECPropertyName` can also be a path defining how to find a property. The path segments must be separated by a period (`.`). The path can contain the names of:    - A navigation property  - A struct property  - A string property that happens to contain a string representation of a json object  - A property inside the selected json    Names of properties are not case sensitive. If json object does not have duplicate property names which only differ in letter casing, then those json properties are not case sensitive. We recommend treating json properties as case sensitive.    - If `Category` property is a navigation property with a value of `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` and the `ECPropertyName` is set to `Category` or `category`, then the whole value `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` will be selected  - If `Category` property is a navigation property with a value of `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` and the `ECPropertyName` is set to `Category.id`, then only the `id` value `0x2000000000b` will be selected  - If `Category` property is a navigation property and it points to a row that has a property `CodeValue` that we want to select, the `ECPropertyName` should be set to `Category.CodeValue`  - If `Model` property is a navigation property and it points to a row that has a property `JsonProperties` with a value `{\"formatter\":{\"mastUnit\":{\"label\":\"m\"}}}` and we want to select the master unit label, the `ECPropertyName` should be set to `Model.JsonProperties.formatter.mastUnit.label`. The result will be `m`    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Create GroupProperty
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new GroupProperty.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {GroupPropertyCreate} groupProperty Request body.
   * @memberof ReportingClient
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
   * ---    Updates a GroupProperty for a Group.    ### Mapping ECProperties    GroupProperties define mappings from ECProperties on an iModel to columns. They allow mapping the queried, element, element aspect, or related element properties.    Content of the columns depend on the `ecProperties` field. The `ecProperties` field is a prioritized array which contains `ECProperty` entities. The closer the `ECProperty` is to the array's start, the higher the priority. The priority of `ECProperty` can be changed by reordering the `ecProperties` array. Reading of the `ecProperties` array stops when a valid value is found. For example, if the `ecProperties` array contains two entries and the first entry results in a null or undefined value, it will take the second entry. The value can be undefined if the given ECProperty does not exist. The result column will be filled with a null value if no valid value was found.    Evaluating `ecProperties` is prioritized by:    1. Queried properties  2. Element properties  3. Element aspect properties    Having queried properties as the highest priority allows for constant or complex values to be added to a mapping.    `ECProperty` lookup is defined by three values - `ECSchemaName`, `ECClassName`, and `ECPropertyName`.    `ECSchemaName` and `ECClassName` are used together to create a ECClassId which is the ECClassId of the current row when selecting a property. If the ECClassId of a selected row does not match the `ECSchemaName` and `ECClassName` pair, the value for this `ECProperty` is considered undefined. If the formed ECClassId is of an element aspect, the current selected row is an element and there is only one instance of that element aspect related to the element, the property lookup is done on the element aspect.    `ECSchemaName` and `ECClassName` are case-insensitive.    `ECSchemaName` and `ECClassName` can be set to a wildcard value `*`.    - If the value of `ECSchemaName` is `*` and the value of `ECClassName` is `Beam`, then it will match any `Beam` class from any schema (e.g. `Building.Beam`, `Structural.Beam`, etc.)  - If the value of `ECSchemaName` is `Building` and the value of `ECClassName` is `*`, then it will match any class from the schema `Building` (e.g. `Building.Beam`, `Building.CurtainWall`, etc.)  - If values of `ECSchemaName` and `ECClassName` are `*`, then it will match any ECClassId (e.g. `Building.Beam`, `Structural.Column`, etc.)  - If either value of `ECSchemaName` or `ECClassName` are `*`, then no element aspect lookup is done    Class inheritance is checked if there is no wildcard value.    - If the value of `ECSchemaName` is `Building` and the value of `ECClassName` is `StructuralMember`, then it will match any ECClassId which inherits `Building.StructuralMember` (e.g. `Building.Beam` which inherits `Building.StructuralMember`, `Building.Column` which inherits `Building.StructuralMember`, etc)  - If `ECSchemaName` or `ECClassName` is a wildcard, then inheritance will not be checked    Set `ECPropertyName` to a property name that you want to select. The value of `ECPropertyName` can also be a path defining how to find a property. The path segments must be separated by a period (`.`). The path can contain the names of:    - A navigation property  - A struct property  - A string property that happens to contain a string representation of a json object  - A property inside the selected json    Names of properties are not case sensitive. If json object does not have duplicate property names which only differ in letter casing, then those json properties are not case sensitive. We recommend treating json properties as case sensitive.    - If `Category` property is a navigation property with a value of `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` and the `ECPropertyName` is set to `Category` or `category`, then the whole value `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` will be selected  - If `Category` property is a navigation property with a value of `{\"id\":\"0x2000000000b\",\"relClassName\":\"BisCore.GeometricElement3dIsInCategory\"}` and the `ECPropertyName` is set to `Category.id`, then only the `id` value `0x2000000000b` will be selected  - If `Category` property is a navigation property and it points to a row that has a property `CodeValue` that we want to select, the `ECPropertyName` should be set to `Category.CodeValue`  - If `Model` property is a navigation property and it points to a row that has a property `JsonProperties` with a value `{\"formatter\":{\"mastUnit\":{\"label\":\"m\"}}}` and we want to select the master unit label, the `ECPropertyName` should be set to `Model.JsonProperties.formatter.mastUnit.label`. The result will be `m`    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Update GroupProperty
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the GroupProperty to be updated.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {GroupPropertyUpdate} groupProperty Request body.
   * @memberof ReportingClient
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
   * ---    Deletes a GroupProperty from a Group.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Delete GroupProperty
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the GroupProperty to be deleted.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @memberof ReportingClient
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
   * ---    Gets all CalculatedProperties for a Group.    ### Calculation Types    Calculation types that start with `BoundingBox` use element aligned bounding boxes. They can be used for approximations of geometric element dimensions when there are no available properties that would have exact dimensions. Some errors may occur due to bounding boxes not being a perfect fit for the surrounded element.    List of all available calculation types:    - `Length` - calculation of a linear element length or a perimeter of a geometric element that does not have a volume. For elements that have a volume use BoundingBox calculations to approximate the length.  - `Area` - calculation of a geometric element's surface area.  - `Volume` - calculation of a geometric element's volume.  - `BoundingBoxLongestEdgeLength` - calculation that gives the longest edge length of an element aligned bounding box.  - `BoundingBoxIntermediateEdgeLength` - calculation that gives the edge length that is not the longest nor the shortest of an element aligned bounding box.  - `BoundingBoxShortestEdgeLength` - calculation that gives the shortest edge length of an element aligned bounding box.  - `BoundingBoxDiagonalLength` - calculation that gives the distance between 2 opposite corners of the element aligned bounding box.  - `BoundingBoxLongestFaceDiagonalLength` - calculation that gives the longest distance between 2 opposite corners of a face on the element aligned bounding box.  - `BoundingBoxIntermediateFaceDiagonalLength` - calculation that gives the distance between 2 opposite corners of a face on the element aligned bounding box that is not the longest nor the shortest.  - `BoundingBoxShortestFaceDiagonalLength` - calculation that gives the shortest distance between 2 opposite corners of a face on the element aligned bounding box.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get CalculatedProperties
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Gets a CalculatedProperty for a Group.    ### Calculation Types    Calculation types that start with `BoundingBox` use element aligned bounding boxes. They can be used for approximations of geometric element dimensions when there are no available properties that would have exact dimensions. Some errors may occur due to bounding boxes not being a perfect fit for the surrounded element.    List of all available calculation types:    - `Length` - calculation of a linear element length or a perimeter of a geometric element that does not have a volume. For elements that have a volume use BoundingBox calculations to approximate the length.  - `Area` - calculation of a geometric element's surface area.  - `Volume` - calculation of a geometric element's volume.  - `BoundingBoxLongestEdgeLength` - calculation that gives the longest edge length of an element aligned bounding box.  - `BoundingBoxIntermediateEdgeLength` - calculation that gives the edge length that is not the longest nor the shortest of an element aligned bounding box.  - `BoundingBoxShortestEdgeLength` - calculation that gives the shortest edge length of an element aligned bounding box.  - `BoundingBoxDiagonalLength` - calculation that gives the distance between 2 opposite corners of the element aligned bounding box.  - `BoundingBoxLongestFaceDiagonalLength` - calculation that gives the longest distance between 2 opposite corners of a face on the element aligned bounding box.  - `BoundingBoxIntermediateFaceDiagonalLength` - calculation that gives the distance between 2 opposite corners of a face on the element aligned bounding box that is not the longest nor the shortest.  - `BoundingBoxShortestFaceDiagonalLength` - calculation that gives the shortest distance between 2 opposite corners of a face on the element aligned bounding box.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get CalculatedProperty
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The CalculatedProperty Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
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
   * ---    Creates a CalculatedProperty for a Group. Each CalculatedProperty defines a property or 'column' which is calculated for each element that is returned by the Group's query.    ### Calculation Types    Calculation types that start with `BoundingBox` use element aligned bounding boxes. They can be used for approximations of geometric element dimensions when there are no available properties that would have exact dimensions. Some errors may occur due to bounding boxes not being a perfect fit for the surrounded element.    List of all available calculation types:    - `Length` - calculation of a linear element length or a perimeter of a geometric element that does not have a volume. For elements that have a volume use BoundingBox calculations to approximate the length.  - `Area` - calculation of a geometric element's surface area.  - `Volume` - calculation of a geometric element's volume.  - `BoundingBoxLongestEdgeLength` - calculation that gives the longest edge length of an element aligned bounding box.  - `BoundingBoxIntermediateEdgeLength` - calculation that gives the edge length that is not the longest nor the shortest of an element aligned bounding box.  - `BoundingBoxShortestEdgeLength` - calculation that gives the shortest edge length of an element aligned bounding box.  - `BoundingBoxDiagonalLength` - calculation that gives the distance between 2 opposite corners of the element aligned bounding box.  - `BoundingBoxLongestFaceDiagonalLength` - calculation that gives the longest distance between 2 opposite corners of a face on the element aligned bounding box.  - `BoundingBoxIntermediateFaceDiagonalLength` - calculation that gives the distance between 2 opposite corners of a face on the element aligned bounding box that is not the longest nor the shortest.  - `BoundingBoxShortestFaceDiagonalLength` - calculation that gives the shortest distance between 2 opposite corners of a face on the element aligned bounding box.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Create CalculatedProperty
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new CalculatedProperty.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {CalculatedPropertyCreate} property Request body.
   * @memberof ReportingClient
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
   * ---    Updates a CalculatedProperty for a Group.    ### Calculation Types    Calculation types that start with `BoundingBox` use element aligned bounding boxes. They can be used for approximations of geometric element dimensions when there are no available properties that would have exact dimensions. Some errors may occur due to bounding boxes not being a perfect fit for the surrounded element.    List of all available calculation types:    - `Length` - calculation of a linear element length or a perimeter of a geometric element that does not have a volume. For elements that have a volume use BoundingBox calculations to approximate the length.  - `Area` - calculation of a geometric element's surface area.  - `Volume` - calculation of a geometric element's volume.  - `BoundingBoxLongestEdgeLength` - calculation that gives the longest edge length of an element aligned bounding box.  - `BoundingBoxIntermediateEdgeLength` - calculation that gives the edge length that is not the longest nor the shortest of an element aligned bounding box.  - `BoundingBoxShortestEdgeLength` - calculation that gives the shortest edge length of an element aligned bounding box.  - `BoundingBoxDiagonalLength` - calculation that gives the distance between 2 opposite corners of the element aligned bounding box.  - `BoundingBoxLongestFaceDiagonalLength` - calculation that gives the longest distance between 2 opposite corners of a face on the element aligned bounding box.  - `BoundingBoxIntermediateFaceDiagonalLength` - calculation that gives the distance between 2 opposite corners of a face on the element aligned bounding box that is not the longest nor the shortest.  - `BoundingBoxShortestFaceDiagonalLength` - calculation that gives the shortest distance between 2 opposite corners of a face on the element aligned bounding box.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Update CalculatedProperty
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the CalculatedProperty to be updated.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {CalculatedPropertyUpdate} property Request body.
   * @memberof ReportingClient
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
   * ---    Deletes a CalculatedProperty from a Group.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Delete CalculatedProperty
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the CalculatedProperty to be deleted.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @memberof ReportingClient
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
   * ---    Gets all CustomCalculations for a Group.    ### CustomCalculations    CustomCalculation is a kind of Group property which has a mathematical formula. CustomCalculation defines a column in the output data which gets filled with a result of the formula evaluation. The formula is evaluated during each extraction for each row of the Group's query result.    The formula supports using other columns (GroupProperty, CalculatedProperty or CustomCalculation entities) as variables. Recursive formulas are not supported, i.e., formula containing a variable `X` is not supported inside a CustomCalculation with a `propertyName` equal to `X`.    Supported operators:    - Unary `-` (negation) has a precedence of 5 and right associativity  - `**` (exponentiation) has a precedence of 4 and right associativity  - `*` (multiplication) has a precedence of 3 and left associativity  - `/` (division) has a precedence of 3 and left associativity  - `%` (remainder) has a precedence of 3 and left associativity  - `+` (addition) has a precedence of 2 and left associativity  - Binary `-` (subtraction) has a precedence of 2 and left associativity    Parenthesis `(` and `)` can be used to change the precedence of operations. Variables, constants, and functions have a precedence of 1 and left associativity.    Supported constants:    - `E` - Euler's constant and the base of natural logarithms (approx. 2.718)  - `LN2` - natural logarithm of 2 (approx. 0.693)  - `LN10` - natural logarithm of 10 (approx. 2.303)  - `LOG2E` - base-2 logarithm of `E` (approx. 1.443)  - `PI` - ratio of a circle's circumference to its diameter (approx. 3.14159)  - `SQRT1_2` - square root of ½ (approx. 0.707)  - `SQRT2` - square root of 2 (approx. 1.414)    Supported numeric constant formats:    - Decimal, e.g., `123` or `1.123`  - Binary (base 2), e.g., `0b1010`  - Octal (base 8), e.g., `0o1234567`  - Hexadecimal (base 16), e.g., `0x123af`  - Scientific notation, e.g., `1.123e+3`    Supported functions:    - `abs(x)` - returns the absolute value of `x`  - `acos(x)` - returns the arccosine of `x`  - `acosh(x)` - returns the hyperbolic arccosine of `x`  - `asin(x)` - returns the arcsine of `x`  - `asinh(x)` - returns the hyperbolic arcsine of `x`  - `atan(x)` - returns the arctangent of `x`  - `atanh(x)` - returns the hyperbolic arctangent of `x`  - `atan2(y, x)` - returns the arctangent of the quotient of `y` divided by `x`  - `cbrt(x)` - returns the cube root of `x`  - `ceil(x)` - returns the smallest integer greater than or equal to `x`  - `clz32(x)` - returns the number of leading zero bits of the 32-bit integer `x`  - `cos(x)` - returns the cosine of `x`  - `cosh(x)` - returns the hyperbolic cosine of `x`  - `exp(x)` - returns `E ** x` or `pow(E, x)`, where `x` is the argument, and `E` is Euler's constant (2.718…, the base of the natural logarithm)  - `expm1(x)` - returns subtracting 1 from `exp(x)`  - `floor(x)` - returns the largest integer less than or equal to `x`  - `fround(x)` - returns the nearest single precision float representation of `x`  - `hypot(x, y[, z[, …]])` - returns the square root of the sum of squares of its arguments  - `imul(x, y)` - returns the result of the 32-bit integer multiplication of `x` and `y`  - `log(x)` - returns the natural logarithm of `x`  - `log1p(x)` - returns the natural logarithm of `1 + x`  - `log10(x)` - returns the base-10 logarithm of `x`  - `log2(x)` - returns the base-2 logarithm of `x`  - `max(x, y[, z[, …]])` - returns the largest of 2 or more numbers  - `min(x, y[, z[, …]])` - returns the smallest of 2 or more numbers  - `pow(x, y)` - returns base `x` to the exponent power `y` (i.e., `x**y`)  - `random()` - returns a pseudo-random number between 0 and 1. The value only changes between different output tables. All rows within a single output table get the same value  - `round(x)` - returns the value of the number `x` rounded to the nearest integer  - `sign(x)` - returns the sign of the `x`, indicating whether `x` is positive (`1`), negative (`-1`), or zero (`0`)  - `sin(x)` - returns the sine of `x`  - `sinh(x)` - returns the hyperbolic sine of `x`  - `sqrt(x)` - returns the positive square root of `x`  - `tan(x)` - returns the tangent of `x`  - `tanh(x)` - returns the hyperbolic tangent of `x`  - `trunc(x)` - returns the integer portion of `x`, removing any fractional digits    Examples of supported formulas:    - `min(A * B, B * C, A * C)` - if `A`, `B`, and `C` are 3 different lengths of box edges, then this formula will result in the smallest side surface area of that box  - `min * max` - formula does not have parenthesis after function names, so the `min` and `max` operands are treated as variables (other columns), not as functions. If the Group has columns `min` and `max`, and their values are `2` and `5`, then the result of this formula is `10` for that row  - `2 ** 3` - 2 raised to the power of 3. Result will be 8. This can also be written as `pow(2, 3)`  - `min(cos(X), sin(X))` - function nesting is supported  - `A * (B + C)` - `A` multiplied by the sum of `B` and `C`  - `A * B + C` - same as `(A * B) + C`    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get CustomCalculations
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
   */
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

  /**
   * ---    Gets a CustomCalculation for a Group.    ### CustomCalculations    CustomCalculation is a kind of Group property which has a mathematical formula. CustomCalculation defines a column in the output data which gets filled with a result of the formula evaluation. The formula is evaluated during each extraction for each row of the Group's query result.    The formula supports using other columns (GroupProperty, CalculatedProperty or CustomCalculation entities) as variables. Recursive formulas are not supported, i.e., formula containing a variable `X` is not supported inside a CustomCalculation with a `propertyName` equal to `X`.    Supported operators:    - Unary `-` (negation) has a precedence of 5 and right associativity  - `**` (exponentiation) has a precedence of 4 and right associativity  - `*` (multiplication) has a precedence of 3 and left associativity  - `/` (division) has a precedence of 3 and left associativity  - `%` (remainder) has a precedence of 3 and left associativity  - `+` (addition) has a precedence of 2 and left associativity  - Binary `-` (subtraction) has a precedence of 2 and left associativity    Parenthesis `(` and `)` can be used to change the precedence of operations. Variables, constants, and functions have a precedence of 1 and left associativity.    Supported constants:    - `E` - Euler's constant and the base of natural logarithms (approx. 2.718)  - `LN2` - natural logarithm of 2 (approx. 0.693)  - `LN10` - natural logarithm of 10 (approx. 2.303)  - `LOG2E` - base-2 logarithm of `E` (approx. 1.443)  - `PI` - ratio of a circle's circumference to its diameter (approx. 3.14159)  - `SQRT1_2` - square root of ½ (approx. 0.707)  - `SQRT2` - square root of 2 (approx. 1.414)    Supported numeric constant formats:    - Decimal, e.g., `123` or `1.123`  - Binary (base 2), e.g., `0b1010`  - Octal (base 8), e.g., `0o1234567`  - Hexadecimal (base 16), e.g., `0x123af`  - Scientific notation, e.g., `1.123e+3`    Supported functions:    - `abs(x)` - returns the absolute value of `x`  - `acos(x)` - returns the arccosine of `x`  - `acosh(x)` - returns the hyperbolic arccosine of `x`  - `asin(x)` - returns the arcsine of `x`  - `asinh(x)` - returns the hyperbolic arcsine of `x`  - `atan(x)` - returns the arctangent of `x`  - `atanh(x)` - returns the hyperbolic arctangent of `x`  - `atan2(y, x)` - returns the arctangent of the quotient of `y` divided by `x`  - `cbrt(x)` - returns the cube root of `x`  - `ceil(x)` - returns the smallest integer greater than or equal to `x`  - `clz32(x)` - returns the number of leading zero bits of the 32-bit integer `x`  - `cos(x)` - returns the cosine of `x`  - `cosh(x)` - returns the hyperbolic cosine of `x`  - `exp(x)` - returns `E ** x` or `pow(E, x)`, where `x` is the argument, and `E` is Euler's constant (2.718…, the base of the natural logarithm)  - `expm1(x)` - returns subtracting 1 from `exp(x)`  - `floor(x)` - returns the largest integer less than or equal to `x`  - `fround(x)` - returns the nearest single precision float representation of `x`  - `hypot(x, y[, z[, …]])` - returns the square root of the sum of squares of its arguments  - `imul(x, y)` - returns the result of the 32-bit integer multiplication of `x` and `y`  - `log(x)` - returns the natural logarithm of `x`  - `log1p(x)` - returns the natural logarithm of `1 + x`  - `log10(x)` - returns the base-10 logarithm of `x`  - `log2(x)` - returns the base-2 logarithm of `x`  - `max(x, y[, z[, …]])` - returns the largest of 2 or more numbers  - `min(x, y[, z[, …]])` - returns the smallest of 2 or more numbers  - `pow(x, y)` - returns base `x` to the exponent power `y` (i.e., `x**y`)  - `random()` - returns a pseudo-random number between 0 and 1. The value only changes between different output tables. All rows within a single output table get the same value  - `round(x)` - returns the value of the number `x` rounded to the nearest integer  - `sign(x)` - returns the sign of the `x`, indicating whether `x` is positive (`1`), negative (`-1`), or zero (`0`)  - `sin(x)` - returns the sine of `x`  - `sinh(x)` - returns the hyperbolic sine of `x`  - `sqrt(x)` - returns the positive square root of `x`  - `tan(x)` - returns the tangent of `x`  - `tanh(x)` - returns the hyperbolic tangent of `x`  - `trunc(x)` - returns the integer portion of `x`, removing any fractional digits    Examples of supported formulas:    - `min(A * B, B * C, A * C)` - if `A`, `B`, and `C` are 3 different lengths of box edges, then this formula will result in the smallest side surface area of that box  - `min * max` - formula does not have parenthesis after function names, so the `min` and `max` operands are treated as variables (other columns), not as functions. If the Group has columns `min` and `max`, and their values are `2` and `5`, then the result of this formula is `10` for that row  - `2 ** 3` - 2 raised to the power of 3. Result will be 8. This can also be written as `pow(2, 3)`  - `min(cos(X), sin(X))` - function nesting is supported  - `A * (B + C)` - `A` multiplied by the sum of `B` and `C`  - `A * B + C` - same as `(A * B) + C`    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_read` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Get CustomCalculation
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The CustomCalculation Id.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:read&#x60;
   * @memberof ReportingClient
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
   * ---    Creates a CustomCalculation for a Group. Each CustomCalculation defines a column in the output data which is filled with values calculated using the given formula for each element that is returned by the Group's query.    ### CustomCalculations    CustomCalculation is a kind of Group property which has a mathematical formula. CustomCalculation defines a column in the output data which gets filled with a result of the formula evaluation. The formula is evaluated during each extraction for each row of the Group's query result.    The formula supports using other columns (GroupProperty, CalculatedProperty or CustomCalculation entities) as variables. Recursive formulas are not supported, i.e., formula containing a variable `X` is not supported inside a CustomCalculation with a `propertyName` equal to `X`.    Supported operators:    - Unary `-` (negation) has a precedence of 5 and right associativity  - `**` (exponentiation) has a precedence of 4 and right associativity  - `*` (multiplication) has a precedence of 3 and left associativity  - `/` (division) has a precedence of 3 and left associativity  - `%` (remainder) has a precedence of 3 and left associativity  - `+` (addition) has a precedence of 2 and left associativity  - Binary `-` (subtraction) has a precedence of 2 and left associativity    Parenthesis `(` and `)` can be used to change the precedence of operations. Variables, constants, and functions have a precedence of 1 and left associativity.    Supported constants:    - `E` - Euler's constant and the base of natural logarithms (approx. 2.718)  - `LN2` - natural logarithm of 2 (approx. 0.693)  - `LN10` - natural logarithm of 10 (approx. 2.303)  - `LOG2E` - base-2 logarithm of `E` (approx. 1.443)  - `PI` - ratio of a circle's circumference to its diameter (approx. 3.14159)  - `SQRT1_2` - square root of ½ (approx. 0.707)  - `SQRT2` - square root of 2 (approx. 1.414)    Supported numeric constant formats:    - Decimal, e.g., `123` or `1.123`  - Binary (base 2), e.g., `0b1010`  - Octal (base 8), e.g., `0o1234567`  - Hexadecimal (base 16), e.g., `0x123af`  - Scientific notation, e.g., `1.123e+3`    Supported functions:    - `abs(x)` - returns the absolute value of `x`  - `acos(x)` - returns the arccosine of `x`  - `acosh(x)` - returns the hyperbolic arccosine of `x`  - `asin(x)` - returns the arcsine of `x`  - `asinh(x)` - returns the hyperbolic arcsine of `x`  - `atan(x)` - returns the arctangent of `x`  - `atanh(x)` - returns the hyperbolic arctangent of `x`  - `atan2(y, x)` - returns the arctangent of the quotient of `y` divided by `x`  - `cbrt(x)` - returns the cube root of `x`  - `ceil(x)` - returns the smallest integer greater than or equal to `x`  - `clz32(x)` - returns the number of leading zero bits of the 32-bit integer `x`  - `cos(x)` - returns the cosine of `x`  - `cosh(x)` - returns the hyperbolic cosine of `x`  - `exp(x)` - returns `E ** x` or `pow(E, x)`, where `x` is the argument, and `E` is Euler's constant (2.718…, the base of the natural logarithm)  - `expm1(x)` - returns subtracting 1 from `exp(x)`  - `floor(x)` - returns the largest integer less than or equal to `x`  - `fround(x)` - returns the nearest single precision float representation of `x`  - `hypot(x, y[, z[, …]])` - returns the square root of the sum of squares of its arguments  - `imul(x, y)` - returns the result of the 32-bit integer multiplication of `x` and `y`  - `log(x)` - returns the natural logarithm of `x`  - `log1p(x)` - returns the natural logarithm of `1 + x`  - `log10(x)` - returns the base-10 logarithm of `x`  - `log2(x)` - returns the base-2 logarithm of `x`  - `max(x, y[, z[, …]])` - returns the largest of 2 or more numbers  - `min(x, y[, z[, …]])` - returns the smallest of 2 or more numbers  - `pow(x, y)` - returns base `x` to the exponent power `y` (i.e., `x**y`)  - `random()` - returns a pseudo-random number between 0 and 1. The value only changes between different output tables. All rows within a single output table get the same value  - `round(x)` - returns the value of the number `x` rounded to the nearest integer  - `sign(x)` - returns the sign of the `x`, indicating whether `x` is positive (`1`), negative (`-1`), or zero (`0`)  - `sin(x)` - returns the sine of `x`  - `sinh(x)` - returns the hyperbolic sine of `x`  - `sqrt(x)` - returns the positive square root of `x`  - `tan(x)` - returns the tangent of `x`  - `tanh(x)` - returns the hyperbolic tangent of `x`  - `trunc(x)` - returns the integer portion of `x`, removing any fractional digits    Examples of supported formulas:    - `min(A * B, B * C, A * C)` - if `A`, `B`, and `C` are 3 different lengths of box edges, then this formula will result in the smallest side surface area of that box  - `min * max` - formula does not have parenthesis after function names, so the `min` and `max` operands are treated as variables (other columns), not as functions. If the Group has columns `min` and `max`, and their values are `2` and `5`, then the result of this formula is `10` for that row  - `2 ** 3` - 2 raised to the power of 3. Result will be 8. This can also be written as `pow(2, 3)`  - `min(cos(X), sin(X))` - function nesting is supported  - `A * (B + C)` - `A` multiplied by the sum of `B` and `C`  - `A * B + C` - same as `(A * B) + C`    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Create CustomCalculation
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new CustomCalculation.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {CustomCalculationCreate} property Request body.
   * @memberof ReportingClient
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
   * ---    Updates a CustomCalculation for a Group.    ### CustomCalculations    CustomCalculation is a kind of Group property which has a mathematical formula. CustomCalculation defines a column in the output data which gets filled with a result of the formula evaluation. The formula is evaluated during each extraction for each row of the Group's query result.    The formula supports using other columns (GroupProperty, CalculatedProperty or CustomCalculation entities) as variables. Recursive formulas are not supported, i.e., formula containing a variable `X` is not supported inside a CustomCalculation with a `propertyName` equal to `X`.    Supported operators:    - Unary `-` (negation) has a precedence of 5 and right associativity  - `**` (exponentiation) has a precedence of 4 and right associativity  - `*` (multiplication) has a precedence of 3 and left associativity  - `/` (division) has a precedence of 3 and left associativity  - `%` (remainder) has a precedence of 3 and left associativity  - `+` (addition) has a precedence of 2 and left associativity  - Binary `-` (subtraction) has a precedence of 2 and left associativity    Parenthesis `(` and `)` can be used to change the precedence of operations. Variables, constants, and functions have a precedence of 1 and left associativity.    Supported constants:    - `E` - Euler's constant and the base of natural logarithms (approx. 2.718)  - `LN2` - natural logarithm of 2 (approx. 0.693)  - `LN10` - natural logarithm of 10 (approx. 2.303)  - `LOG2E` - base-2 logarithm of `E` (approx. 1.443)  - `PI` - ratio of a circle's circumference to its diameter (approx. 3.14159)  - `SQRT1_2` - square root of ½ (approx. 0.707)  - `SQRT2` - square root of 2 (approx. 1.414)    Supported numeric constant formats:    - Decimal, e.g., `123` or `1.123`  - Binary (base 2), e.g., `0b1010`  - Octal (base 8), e.g., `0o1234567`  - Hexadecimal (base 16), e.g., `0x123af`  - Scientific notation, e.g., `1.123e+3`    Supported functions:    - `abs(x)` - returns the absolute value of `x`  - `acos(x)` - returns the arccosine of `x`  - `acosh(x)` - returns the hyperbolic arccosine of `x`  - `asin(x)` - returns the arcsine of `x`  - `asinh(x)` - returns the hyperbolic arcsine of `x`  - `atan(x)` - returns the arctangent of `x`  - `atanh(x)` - returns the hyperbolic arctangent of `x`  - `atan2(y, x)` - returns the arctangent of the quotient of `y` divided by `x`  - `cbrt(x)` - returns the cube root of `x`  - `ceil(x)` - returns the smallest integer greater than or equal to `x`  - `clz32(x)` - returns the number of leading zero bits of the 32-bit integer `x`  - `cos(x)` - returns the cosine of `x`  - `cosh(x)` - returns the hyperbolic cosine of `x`  - `exp(x)` - returns `E ** x` or `pow(E, x)`, where `x` is the argument, and `E` is Euler's constant (2.718…, the base of the natural logarithm)  - `expm1(x)` - returns subtracting 1 from `exp(x)`  - `floor(x)` - returns the largest integer less than or equal to `x`  - `fround(x)` - returns the nearest single precision float representation of `x`  - `hypot(x, y[, z[, …]])` - returns the square root of the sum of squares of its arguments  - `imul(x, y)` - returns the result of the 32-bit integer multiplication of `x` and `y`  - `log(x)` - returns the natural logarithm of `x`  - `log1p(x)` - returns the natural logarithm of `1 + x`  - `log10(x)` - returns the base-10 logarithm of `x`  - `log2(x)` - returns the base-2 logarithm of `x`  - `max(x, y[, z[, …]])` - returns the largest of 2 or more numbers  - `min(x, y[, z[, …]])` - returns the smallest of 2 or more numbers  - `pow(x, y)` - returns base `x` to the exponent power `y` (i.e., `x**y`)  - `random()` - returns a pseudo-random number between 0 and 1. The value only changes between different output tables. All rows within a single output table get the same value  - `round(x)` - returns the value of the number `x` rounded to the nearest integer  - `sign(x)` - returns the sign of the `x`, indicating whether `x` is positive (`1`), negative (`-1`), or zero (`0`)  - `sin(x)` - returns the sine of `x`  - `sinh(x)` - returns the hyperbolic sine of `x`  - `sqrt(x)` - returns the positive square root of `x`  - `tan(x)` - returns the tangent of `x`  - `tanh(x)` - returns the hyperbolic tangent of `x`  - `trunc(x)` - returns the integer portion of `x`, removing any fractional digits    Examples of supported formulas:    - `min(A * B, B * C, A * C)` - if `A`, `B`, and `C` are 3 different lengths of box edges, then this formula will result in the smallest side surface area of that box  - `min * max` - formula does not have parenthesis after function names, so the `min` and `max` operands are treated as variables (other columns), not as functions. If the Group has columns `min` and `max`, and their values are `2` and `5`, then the result of this formula is `10` for that row  - `2 ** 3` - 2 raised to the power of 3. Result will be 8. This can also be written as `pow(2, 3)`  - `min(cos(X), sin(X))` - function nesting is supported  - `A * (B + C)` - `A` multiplied by the sum of `B` and `C`  - `A * B + C` - same as `(A * B) + C`    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Update CustomCalculation
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} customCalculationId Id of the CustomCalculation to be updated.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {CustomCalculationUpdate} property Request body.
   * @memberof ReportingClient
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
   * ---    Deletes a CustomCalculation from a Group.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `imodels_write` permission(s) assigned at the Project level. iModel specific permissions may also be applied at the iModel level if iModel level permissions are enabled.    Alternatively the user should be an Organization Administrator for the Organization that owns a given Project or iModel.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ### Rate limits    All iTwin Platform API operations have a rate limit. For more documentation on that visit [Rate limits and quotas](https://developer.bentley.com/apis/overview/rate-limits/) page.    ---
   * @summary Delete CustomCalculation
   * @param {string} imodelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} customCalculationId Id of the CustomCalculation to be deleted.
   * @param {string} accessToken OAuth access token with scope &#x60;insights:modify&#x60;
   * @memberof ReportingClient
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

  //#endregion
}
