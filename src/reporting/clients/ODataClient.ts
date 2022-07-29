/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { RequiredError } from "../interfaces/Errors";
import type { PagedResponseLinks } from "../interfaces/Links";
import type { ODataEntityResponse, ODataEntityValue, ODataItem, ODataResponse } from "../interfaces/OData";
import type { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { OperationsBase } from "../OperationsBase";
import type { IOdataClient } from "./IODataClient";

export class ODataClient extends OperationsBase implements IOdataClient{
  public async getODataReport(accessToken: AccessToken, reportId: string): Promise<ODataResponse> {
    const url = `${this.basePath}/odata/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return this.fetchJSON<ODataResponse>(url, requestOptions);
  }

  public async getODataReportEntityPage(accessToken: AccessToken, reportId: string, odataItem: ODataItem, sequence: number): Promise<ODataEntityResponse> {
    const segments = odataItem.url.split("/");  // region, manifestId, entityType
    if (segments.length !== 3) {
      throw new RequiredError(
        "odataItem",
        "odata item was invalid when calling getODataReportEntityPage.",
      );
    }
    const url = `${this.basePath}/odata/${encodeURIComponent(reportId)}/${odataItem.url}?sequence=${encodeURIComponent(sequence)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return this.fetchJSON(url, requestOptions);
  }

  public async getODataReportEntities(accessToken: AccessToken, reportId: string, odataItem: ODataItem): Promise<Array<ODataEntityValue>> {
    const segments = odataItem.url.split("/");  // region, manifestId, entityType
    if (segments.length !== 3) {
      throw new RequiredError(
        "odataItem",
        "odata item was invalid when calling getODataReportEntities.",
      );
    }
    const reportData: Array<ODataEntityValue> = [];
    const oDataReportEntitiesIt = this.getODataReportEntitiesIterator(accessToken, reportId, odataItem);
    for await(const oDataReportEntity of oDataReportEntitiesIt) {
      reportData.push(oDataReportEntity);
    }
    return reportData;
  }

  public getODataReportEntitiesIterator(accessToken: AccessToken, reportId: string, odataItem: ODataItem): EntityListIterator<ODataEntityValue> {
    const segments = odataItem.url.split("/");  // region, manifestId, entityType
    if (segments.length !== 3) {
      throw new RequiredError(
        "odataItem",
        "odata item was invalid when calling getODataReportEntitiesIterator.",
      );
    }
    const url = `${this.basePath}/odata/${encodeURIComponent(reportId)}/${odataItem.url}`;
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ODataEntityValue>(
      url,
      async (nextUrl: string): Promise<Collection<ODataEntityValue>> => {
        const response: ODataEntityResponse = await this.fetchJSON<ODataEntityResponse>(nextUrl, request);
        const link: PagedResponseLinks = {
          self: {
            href: url,
          },
        };
        if(response["@odata.nextLink"]) {
          link.next = {
            href: response["@odata.nextLink"],
          };
        }
        return {
          values: response.value,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: link,
        };
      }));
  }

  public async getODataReportMetadata(accessToken: AccessToken, reportId: string): Promise<Response> {
    const url = `${this.basePath}/odata/${encodeURIComponent(reportId)}/$metadata`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return this.fetchData(url, requestOptions);
  }
}
