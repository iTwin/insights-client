/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { RequiredError } from "../interfaces/Errors";
import { PagedResponseLinks } from "../interfaces/Links";
import { ODataResponse, ODataItem, ODataEntityResponse, ODataEntityValue } from "../interfaces/OData";
import { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { getEntityCollectionPage, Collection } from "../iterators/IteratorUtil";
import { OperationsBase } from "../OperationsBase";
import { IOdataClient } from "./IODataClient";

export class ODataClient extends OperationsBase implements IOdataClient{
  public async getODataReport(accessToken: AccessToken, reportId: string): Promise<ODataResponse> {
    const url = `${this.basePath}/odata/${encodeURIComponent(reportId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return this.fetchData<ODataResponse>(url, requestOptions);
  }

  public async getODataReportEntityPage(accessToken: AccessToken, reportId: string, odataItem: ODataItem, sequence: number) : Promise<ODataEntityResponse> {
    const segments = odataItem.url.split('/');  // region, manifestId, entityType
    if (segments.length !== 3) {
      throw new RequiredError(
        'odataItem',
        'odata item was invalid when calling updateCalculatedProperty.',
      );
    }
    let response: ODataEntityResponse;
    let url = `${this.basePath}/odata/${encodeURIComponent(reportId)}/${odataItem.url}?sequence=${encodeURIComponent(sequence)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    response = await this.fetchData(url, requestOptions);
    return response;
  }

  public async getODataReportEntities(accessToken: AccessToken, reportId: string, odataItem: ODataItem): Promise<Array<ODataEntityValue>> {
    const segments = odataItem.url.split('/');  // region, manifestId, entityType
    if (segments.length !== 3) {
      throw new RequiredError(
        'odataItem',
        'odata item was invalid when calling updateCalculatedProperty.',
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
    let url = `${this.basePath}/odata/${encodeURIComponent(reportId)}/${odataItem.url}`;
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<ODataEntityValue>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<Collection<ODataEntityValue>> => {
        const response: ODataEntityResponse = await this.fetchData<ODataEntityResponse>(url, requestOptions);
        const link: PagedResponseLinks = {
          self: {
            href: ""
          }
        };
        if(response["@odata.nextLink"]) {
          link.next = {
            href: response["@odata.nextLink"]
          }
        }
        return {
          values: response.value,
          _links: link,
        }
    }));
  }

  public async getODataReportMetadata(accessToken: AccessToken, reportId: string): Promise<Response> {
    const url = `${this.basePath}/odata/${encodeURIComponent(reportId)}/$metadata`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return this.fetch(url, requestOptions).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        throw response;
      }
    });
  }
}