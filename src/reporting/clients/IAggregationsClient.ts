/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { AggregationProperty, AggregationPropertyCreate, AggregationPropertyUpdate, AggregationTable, AggregationTableCreate, AggregationTableSet, AggregationTableSetCreate, AggregationTableSetUpdate, AggregationTableUpdate } from "../interfaces/AggregationProperties";
import type { EntityListIterator } from "../../common/iterators/EntityListIterator";

export interface IAggregationsClient {
  /**
     * Gets all AggregationProperties in a given aggregation table. This method returns the full list of Aggregation Properties.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @param {number} top The number of entities to load per page.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationproperties/
     */
  getAggregationProperties(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    top?: number
  ): Promise<AggregationProperty[]>;

  /**
     * Gets an async paged iterator of AggregationProperties in a given aggregation table.
     * This method returns an iterator which loads pages of Aggregation Properties as it is being iterated over.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @param {number} top The number of entities to load per page.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationproperties/
     */
  getAggregationPropertiesIterator(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    top?: number
  ): EntityListIterator<AggregationProperty>;

  /**
     * Retrieves an aggregation property.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @param {string} aggregationPropertyId Id of the aggregation property.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationproperty/
     */
  getAggregationProperty(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    aggregationPropertyId: string,
  ): Promise<AggregationProperty>;

  /**
     * Updates an aggregation property.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @param {string} aggregationPropertyId Id of the aggregation property.
     * @param {AggregationPropertyUpdate} property Request body.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/update-aggregationproperty/
     */
  updateAggregationProperty(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    aggregationPropertyId: string,
    property: AggregationPropertyUpdate
  ): Promise<AggregationProperty>;

  /**
     * Creates an aggregation property.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @param {AggregationPropertyCreate} property Request body.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/create-aggregationproperty/
     */
  createAggregationProperty(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    property: AggregationPropertyCreate
  ): Promise<AggregationProperty>;

  /**
     * Deletes an aggregation property.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @param {string} aggregationPropertyId Id of the aggregation property.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/delete-aggregationproperty/
     */
  deleteAggregationProperty(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    aggregationPropertyId: string,
  ): Promise<Response>;

  /**
     * Get all aggregation table sets for a given data source id.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} datasourceId Id of the data source to query for all its aggregation table sets.
     * @param {string} datasourceType Type of the data source that this aggregation table set works with.
     * @param {number} top Optional max items to be sent in response.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationtablesets/
     */
  getAggregationTableSets(
    accessToken: AccessToken,
    datasourceId: string,
    datasourceType: string,
    top?: number
  ): Promise<AggregationTableSet[]>;

  /**
     * Gets an async paged iterator of AggregationTableSets in a given aggregation table.
     * This method returns an iterator which loads pages of AggregationTableSets as it is being iterated over.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} datasourceId Id of the data source to query for all its aggregation table sets.
     * @param {string} datasourceType Type of the data source that this aggregation table set works with.
     * @param {number} top Optional max items to be sent in response.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationtablesets/
     */
  getAggregationTableSetsIterator(
    accessToken: AccessToken,
    datasourceId: string,
    datasourceType: string,
    top?: number
  ): EntityListIterator<AggregationTableSet>;

  /**
     * Retrieves an aggregation table set.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationtableset/
     */
  getAggregationTableSet(
    accessToken: AccessToken,
    aggregationTableSetId: string,
  ): Promise<AggregationTableSet>;

  /**
     * Update an aggregation table set.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {AggregationTableSetUpdate} tableset Request body.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/update-aggregationtableset/
     */
  updateAggregationTableSet(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    tableset: AggregationTableSetUpdate
  ): Promise<AggregationTableSet>;

  /**
     * Creates an aggregation table set for a data source.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {AggregationTableSetCreate} tableset Request body.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/create-aggregationproperty/
     */
  createAggregationTableSet(
    accessToken: AccessToken,
    tableset: AggregationTableSetCreate
  ): Promise<AggregationTableSet>;

  /**
     * Deletes an aggregation table set.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/delete-aggregationtableset/
     */
  deleteAggregationTableSet(
    accessToken: AccessToken,
    aggregationTableSetId: string,
  ): Promise<Response>;

  /**
     * Get all aggregation tables for a given aggregation table set id.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {number} top Optional max items to be sent in response.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationtables/
     */
  getAggregationTables(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    top?: number
  ): Promise<AggregationTable[]>;

  /**
     * Gets an async paged iterator of AggregationTables in a given aggregation table.
     * This method returns an iterator which loads pages of AggregationTables as it is being iterated over.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {number} top Optional max items to be sent in response.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationtables/
     */
  getAggregationTablesIterator(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    top?: number
  ): EntityListIterator<AggregationTable>;

  /**
     * Retrieves an aggregation table.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/get-aggregationtable/
     */
  getAggregationTable(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string
  ): Promise<AggregationTable>;

  /**
     * Update an aggregation table.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @param {AggregationTableUpdate} table Request body.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/update-aggregationtable/
     */
  updateAggregationTable(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string,
    table: AggregationTableUpdate
  ): Promise<AggregationTable>;

  /**
     * Creates an aggregation table.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {AggregationTableCreate} table Request body.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/create-aggregationtable/
     */
  createAggregationTable(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    table: AggregationTableCreate
  ): Promise<AggregationTable>;

  /**
     * Deletes an aggregation table.
     * @param {string} accessToken OAuth access token with scope `insights:read`.
     * @param {string} aggregationTableSetId Id of the aggregation table set.
     * @param {string} aggregationTableId Id of the aggregation table.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/insights/operations/delete-aggregationtable/
     */
  deleteAggregationTable(
    accessToken: AccessToken,
    aggregationTableSetId: string,
    aggregationTableId: string
  ): Promise<Response>;
}
