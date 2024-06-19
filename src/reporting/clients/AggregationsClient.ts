/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { RequiredError } from "../../common/Errors";
import type { EntityListIterator } from "../../common/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../../common/iterators/IteratorUtil";
import { OperationsBase } from "../../common/OperationsBase";
import {
  AggregationProperty, AggregationPropertyCollection, AggregationPropertyCreate, AggregationPropertySingle, AggregationPropertyType, AggregationPropertyUpdate,
  AggregationTable, AggregationTableCollection, AggregationTableCreate, AggregationTableSet, AggregationTableSetCollection, AggregationTableSetCreate, AggregationTableSetSingle,
  AggregationTableSetUpdate, AggregationTableSingle, AggregationTableUpdate,
} from "../interfaces/AggregationProperties";
import type { IAggregationsClient } from "./IAggregationsClient";

export class AggregationsClient extends OperationsBase implements IAggregationsClient {
  public async getAggregationProperties(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    top?: number,
  ): Promise<AggregationProperty[]> {
    const properties: Array<AggregationProperty> = [];
    const aggregationPropertyIterator = this.getAggregationPropertiesIterator(accessToken, aggregationTableSetId, aggregationTableId, top);
    for await (const aggregationProperty of aggregationPropertyIterator) {
      properties.push(aggregationProperty);
    }
    return properties;
  }

  public getAggregationPropertiesIterator(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    top?: number,
  ): EntityListIterator<AggregationProperty> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }
    let url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables/${encodeURIComponent(aggregationTableId)}/properties`;
    url += top ? `/?$top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<AggregationProperty>(
      url,
      async (nextUrl: string): Promise<Collection<AggregationProperty>> => {
        const response: AggregationPropertyCollection = await this.fetchJSON<AggregationPropertyCollection>(nextUrl, request);
        return {
          values: response.aggregationProperties,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: response._links,
        };
      }));
  }

  public async getAggregationProperty(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    aggregationPropertyId: string,
  ): Promise<AggregationProperty> {
    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables/${encodeURIComponent(aggregationTableId)}/properties/${encodeURIComponent(aggregationPropertyId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<AggregationPropertySingle>(url, requestOptions)).aggregationProperty;
  }

  public async updateAggregationProperty(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    aggregationPropertyId: string,
    property: AggregationPropertyUpdate,
  ): Promise<AggregationProperty> {
    if (null == property.propertyName && null == property.sourcePropertyName && null == property.type) {
      throw new RequiredError(
        "property",
        "All properties of property were missing.",
      );
    }
    if (null != property.propertyName && !this.isSimpleIdentifier(property.propertyName)) {
      throw new RequiredError(
        "propertyName",
        "Field propertyName was invalid.",
      );
    }
    if (null != property.sourcePropertyName && !this.isSimpleIdentifier(property.sourcePropertyName)) {
      throw new RequiredError(
        "sourcePropertyName",
        "Field sourcePropertyName was invalid.",
      );
    }
    if (null != property.type && property.type === AggregationPropertyType.Undefined) {
      throw new RequiredError(
        "type",
        "Required field type was null or undefined.",
      );
    }

    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables/${encodeURIComponent(aggregationTableId)}/properties/${encodeURIComponent(aggregationPropertyId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(property));
    return (await this.fetchJSON<AggregationPropertySingle>(url, requestOptions)).aggregationProperty;
  }

  public async createAggregationProperty(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    property: AggregationPropertyCreate,
  ): Promise<AggregationProperty> {
    if (!this.isSimpleIdentifier(property.propertyName)) {
      throw new RequiredError(
        "propertyName",
        "Field propertyName was invalid.",
      );
    }
    if (!this.isSimpleIdentifier(property.sourcePropertyName)) {
      throw new RequiredError(
        "sourcePropertyName",
        "Field sourcePropertyName was invalid.",
      );
    }
    if (property.type === AggregationPropertyType.Undefined) {
      throw new RequiredError(
        "type",
        "Required field type was null or undefined.",
      );
    }
    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables/${encodeURIComponent(aggregationTableId)}/properties`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(property));
    return (await this.fetchJSON<AggregationPropertySingle>(url, requestOptions)).aggregationProperty;
  }

  public async deleteAggregationProperty(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    aggregationPropertyId: string,
  ): Promise<Response> {
    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables/${encodeURIComponent(aggregationTableId)}/properties/${encodeURIComponent(aggregationPropertyId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async getAggregationTableSets(
    accessToken: AccessToken,
    datasourceId: string,
    datasourceType: string,
    top?: number,
  ): Promise<AggregationTableSet[]> {
    const tablesets: Array<AggregationTableSet> = [];
    const aggregationTableSetsIterator = this.getAggregationTableSetsIterator(accessToken, datasourceId, datasourceType, top);
    for await (const aggregationTableSet of aggregationTableSetsIterator) {
      tablesets.push(aggregationTableSet);
    }
    return tablesets;
  }

  public getAggregationTableSetsIterator(
    accessToken: AccessToken,
    datasourceId: string,
    datasourceType: string,
    top?: number,
  ): EntityListIterator<AggregationTableSet> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }
    let url = `${this.basePath}/datasources/aggregations?datasourceId=${encodeURIComponent(datasourceId)}&datasourceType=${encodeURIComponent(datasourceType)}`;
    url += top ? `&$top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<AggregationTableSet>(
      url,
      async (nextUrl: string): Promise<Collection<AggregationTableSet>> => {
        const response: AggregationTableSetCollection = await this.fetchJSON<AggregationTableSetCollection>(nextUrl, request);
        return {
          values: response.aggregationTableSets,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: response._links,
        };
      }));
  }

  public async getAggregationTableSet(
    accessToken: AccessToken,
    aggregationTableSetId: string,
  ): Promise<AggregationTableSet> {
    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<AggregationTableSetSingle>(url, requestOptions)).aggregationTableSet;
  }

  public async updateAggregationTableSet(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    tableset: AggregationTableSetUpdate,
  ): Promise<AggregationTableSet> {
    if (null == tableset.tableSetName && null == tableset.description) {
      throw new RequiredError(
        "tableset",
        "All properties of tableset were missing.",
      );
    }
    if (null != tableset.tableSetName && !this.isSimpleIdentifier(tableset.tableSetName)) {
      throw new RequiredError(
        "tableSetName",
        "Field tableSetName was invalid.",
      );
    }

    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(tableset));
    return (await this.fetchJSON<AggregationTableSetSingle>(url, requestOptions)).aggregationTableSet;
  }

  public async createAggregationTableSet(
    accessToken: AccessToken,
    tableset: AggregationTableSetCreate,
  ): Promise<AggregationTableSet> {
    if (!this.isSimpleIdentifier(tableset.tableSetName)) {
      throw new RequiredError(
        "tableSetName",
        "Field tableSetName was invalid.",
      );
    }
    if (!this.isSimpleIdentifier(tableset.datasourceType)) {
      throw new RequiredError(
        "datasourceType",
        "Field datasourceType was invalid.",
      );
    }
    if (!tableset.datasourceId) {
      throw new RequiredError(
        "datasourceId",
        "Required field datasourceId was null or undefined.",
      );
    }
    const url = `${this.basePath}/datasources/aggregations`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(tableset));
    return (await this.fetchJSON<AggregationTableSetSingle>(url, requestOptions)).aggregationTableSet;
  }

  public async deleteAggregationTableSet(
    accessToken: AccessToken,
    aggregationTableSetId: string,
  ): Promise<Response> {
    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async getAggregationTables(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    top?: number,
  ): Promise<AggregationTable[]> {
    const tables: Array<AggregationTable> = [];
    const aggregationTablesIterator = this.getAggregationTablesIterator(accessToken, aggregationTableSetId, top);
    for await (const aggregationTable of aggregationTablesIterator) {
      tables.push(aggregationTable);
    }
    return tables;
  }

  public getAggregationTablesIterator(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    top?: number,
  ): EntityListIterator<AggregationTable> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }
    let url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables`;
    url += top ? `?$top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<AggregationTable>(
      url,
      async (nextUrl: string): Promise<Collection<AggregationTable>> => {
        const response: AggregationTableCollection = await this.fetchJSON<AggregationTableCollection>(nextUrl, request);
        return {
          values: response.aggregationTables,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: response._links,
        };
      }));
  }

  public async getAggregationTable(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
  ): Promise<AggregationTable> {
    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables/${encodeURIComponent(aggregationTableId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<AggregationTableSingle>(url, requestOptions)).aggregationTable;
  }

  public async updateAggregationTable(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    table: AggregationTableUpdate,
  ): Promise<AggregationTable> {
    if (null == table.tableName && null == table.description && null == table.sourceTableName) {
      throw new RequiredError(
        "table",
        "All properties of table were missing.",
      );
    }
    if (null != table.tableName && !this.isSimpleIdentifier(table.tableName)) {
      throw new RequiredError(
        "tableName",
        "Field tableName was invalid.",
      );
    }
    if (null != table.sourceTableName && !this.isSimpleIdentifier(table.sourceTableName)) {
      throw new RequiredError(
        "sourceTableName",
        "Field sourceTableName was invalid.",
      );
    }

    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables/${encodeURIComponent(aggregationTableId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(table));
    return (await this.fetchJSON<AggregationTableSingle>(url, requestOptions)).aggregationTable;
  }

  public async createAggregationTable(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    table: AggregationTableCreate,
  ): Promise<AggregationTable> {
    if (!this.isSimpleIdentifier(table.tableName)) {
      throw new RequiredError(
        "tableName",
        "Field tableName was invalid.",
      );
    }
    if (!this.isSimpleIdentifier(table.sourceTableName)) {
      throw new RequiredError(
        "sourceTableName",
        "Field sourceTableName was invalid.",
      );
    }
    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(table));
    return (await this.fetchJSON<AggregationTableSingle>(url, requestOptions)).aggregationTable;
  }

  public async deleteAggregationTable(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
  ): Promise<Response> {
    const url = `${this.basePath}/datasources/aggregations/${encodeURIComponent(aggregationTableSetId)}/tables/${encodeURIComponent(aggregationTableId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }
}
