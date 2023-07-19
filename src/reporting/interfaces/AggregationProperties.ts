/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Defines an output property of aggregation.
 * @export
 * @interface AggregationProperty
 */
export interface AggregationProperty {
  /**
     * The aggregation property's id.
     * @type {string}
     * @memberof AggregationProperty
     */
  id: string;
  /**
     * Name of the aggregation property (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationProperty
     */
  propertyName: string;
  /**
     * Name of a property in data source table to run the aggregation against.
     * @type {string}
     * @memberof AggregationProperty
     */
  sourcePropertyName: string;
  /**
     * Type of aggregation to run for this property
     * @type {string}
     * @memberof AggregationProperty
     */
  type: AggregationPropertyType;
  /**
     *
     * @type {AggregationPropertyLinks}
     * @memberof AggregationProperty
     */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: AggregationPropertyLinks;
}

/**
 * List of AggregationProperties.
 * @export
 * @interface AggregationPropertyCollection
 */
export interface AggregationPropertyCollection {
  /**
     * List of AggregationProperties.
     * @type {Array<AggregationProperty>}
     * @memberof AggregationPropertyCollection
     */
  aggregationProperties: Array<AggregationProperty>;
  /**
     *
     * @type {PagedResponseLinks}
     * @memberof AggregationPropertyCollection
     */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

export interface AggregationPropertyLinks {
  /**
     *
     * @type {Link}
     * @memberof AggregationPropertyLinks
     */
  datasource: Link;
  /**
     *
     * @type {Link}
     * @memberof AggregationPropertyLinks
     */
  aggregationTableSet: Link;
  /**
     *
     * @type {Link}
     * @memberof AggregationPropertyLinks
     */
  aggregationTable: Link;
}

export interface AggregationPropertySingle {
  /**
     *
     * @type {AggregationProperty}
     * @memberof AggregationPropertySingle
     */
  aggregationProperty: AggregationProperty;
}

export interface AggregationPropertyUpdate {
  /**
     * Name of the aggregation property (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationPropertyUpdate
     */
  propertyName?: string;
  /**
     * Name of a property in data source table to run the aggregation against.
     * @type {string}
     * @memberof AggregationPropertyUpdate
     */
  sourcePropertyName?: string;
  /**
     * Type of aggregation to run for this property.
     * @type {string}
     * @memberof AggregationPropertyUpdate
     */
  type?: AggregationPropertyType;
}

export interface AggregationPropertyCreate {
  /**
     * Name of the aggregation property (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationPropertyCreate
     */
  propertyName: string;
  /**
     * Name of a property in data source table to run the aggregation against.
     * @type {string}
     * @memberof AggregationPropertyCreate
     */
  sourcePropertyName: string;
  /**
     * Type of aggregation to run for this property.
     * @type {string}
     * @memberof AggregationPropertyCreate
     */
  type: AggregationPropertyType;
}

export enum AggregationPropertyType {
  // eslint-disable-next-line id-blacklist
  Undefined = "Undefined",
  GroupBy = "GroupBy",
  Count = "Count",
  Sum = "Sum"
}

/**
 * Defines an output of Aggregation Table Set.
 * @export
 * @interface AggregationTableSet
 */
export interface AggregationTableSet {
  /**
     * The aggregation table set's id.
     * @type {string}
     * @memberof AggregationTableSet
     */
  id: string;
  /**
     * Name of the aggregation table set (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationTableSet
     */
  tableSetName: string;
  /**
     * Description of the aggregation table set.
     * @type {string}
     * @memberof AggregationTableSet
     */
  description: string;
  /**
     * Type of the data source that this aggregation table set works with.
     * @type {string}
     * @memberof AggregationTableSet
     */
  datasourceType: string;
  /**
     * Date when the aggregation table set was created.
     * @type {string}
     * @memberof AggregationTableSet
     */
  createdOn: string;
  /**
     * Email of the user who created the aggregation table set.
     * @type {string}
     * @memberof AggregationTableSet
     */
  createdBy: string;
  /**
     * Date when the aggregation table set was last modified.
     * @type {string}
     * @memberof AggregationTableSet
     */
  modifiedOn: string;
  /**
     * Email of the user who last modified the aggregation table set.
     * @type {string}
     * @memberof AggregationTableSet
     */
  modifiedBy: string;
  /**
     *
     * @type {AggregationTableSetLinks}
     * @memberof AggregationTableSet
     */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: AggregationTableSetLinks;
}

/**
 * List of AggregationTableSets.
 * @export
 * @interface AggregationTableSetCollection
 */
export interface AggregationTableSetCollection {
  /**
     * List of AggregationTableSets.
     * @type {Array<AggregationTableSet>}
     * @memberof AggregationTableSetCollection
     */
  aggregationTableSets: Array<AggregationTableSet>;
  /**
     *
     * @type {PagedResponseLinks}
     * @memberof AggregationTableSetCollection
     */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

export interface AggregationTableSetLinks {
  /**
     *
     * @type {Link}
     * @memberof AggregationTableSetLinks
     */
  datasource: Link;
}

export interface AggregationTableSetSingle {
  /**
     *
     * @type {AggregationTableSet}
     * @memberof AggregationTableSetSingle
     */
  aggregationTableSet: AggregationTableSet;
}

export interface AggregationTableSetUpdate {
  /**
     * Name of the aggregation table set (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationTableSetUpdate
     */
  tableSetName?: string;
  /**
     * Description of the aggregation table set.
     * @type {string}
     * @memberof AggregationTableSetUpdate
     */
  description?: string;
}

export interface AggregationTableSetCreate {
  /**
     * Name of the aggregation table set (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationTableSetCreate
     */
  tableSetName: string;
  /**
     * Description of the aggregation table set.
     * @type {string}
     * @memberof AggregationTableSetCreate
     */
  description?: string;
  /**
     * Id of the data source that this aggregation table set works with.
     * @type {string}
     * @memberof AggregationTableSetCreate
     */
  datasourceId: string;
  /**
     * Id of the data source that this aggregation table set works with.
     * @type {string}
     * @memberof AggregationTableSetCreate
     */
  datasourceType: string;
}

/**
 * Defines an output of Aggregation Tables.
 * @export
 * @interface AggregationTable
 */
export interface AggregationTable {
  /**
     * The aggregation table's id.
     * @type {string}
     * @memberof AggregationTable
     */
  id: string;
  /**
     * Name of the aggregation table (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationTable
     */
  tableName: string;
  /**
     * Description of the aggregation table.
     * @type {string}
     * @memberof AggregationTable
     */
  description: string;
  /**
     * Name of the data source table to aggregate.
     * @type {string}
     * @memberof AggregationTable
     */
  sourceTableName: string;
  /**
     *
     * @type {AggregationTableLinks}
     * @memberof AggregationTable
     */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: AggregationTableLinks;
}

/**
 * List of AggregationTables.
 * @export
 * @interface AggregationTableCollection
 */
export interface AggregationTableCollection {
  /**
     * List of AggregationTables.
     * @type {Array<AggregationTable>}
     * @memberof AggregationTableCollection
     */
  aggregationTables: Array<AggregationTable>;
  /**
     *
     * @type {PagedResponseLinks}
     * @memberof AggregationTableCollection
     */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

export interface AggregationTableLinks {
  /**
     *
     * @type {Link}
     * @memberof AggregationTableLinks
     */
  datasource: Link;
  /**
     *
     * @type {Link}
     * @memberof AggregationTableLinks
     */
  aggregationTableSet: Link;
}

export interface AggregationTableSingle {
  /**
     *
     * @type {AggregationTable}
     * @memberof AggregationTableSingle
     */
  aggregationTable: AggregationTable;
}

export interface AggregationTableUpdate {
  /**
     * Name of the aggregation table (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationTableUpdate
     */
  tableName?: string;
  /**
     * Description of the aggregation table.
     * @type {string}
     * @memberof AggregationTableUpdate
     */
  description?: string;
  /**
     * Name of the data source table to aggregate.
     * @type {string}
     * @memberof AggregationTableUpdate
     */
  sourceTableName?: string;
}

export interface AggregationTableCreate {
  /**
     * Name of the aggregation table (OData v4 SimpleIdentifier).
     * @type {string}
     * @memberof AggregationTableUpdate
     */
  tableName: string;
  /**
     * Description of the aggregation table.
     * @type {string}
     * @memberof AggregationTableUpdate
     */
  description?: string;
  /**
     * Name of the data source table to aggregate.
     * @type {string}
     * @memberof AggregationTableUpdate
     */
  sourceTableName: string;
}
