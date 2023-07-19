/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Defines a unit of data that can be exposed as an OData feed. The contents of a Report are defined in Report Mappings.
 * @export
 * @interface Report
 */
export interface Report {
  /**
   * The Report Id.
   * @type {string}
   * @memberof Report
   */
  id: string;
  /**
   * Name of the Report.
   * @type {string}
   * @memberof Report
   */
  displayName: string;
  /**
   * Description of the Report.
   * @type {string}
   * @memberof Report
   */
  description?: string;
  /**
   * Flag indicating whether or not a Report has been marked for deletion.
   * @type {boolean}
   * @memberof Report
   */
  deleted: boolean;
  /**
   *
   * @type {ReportLinks}
   * @memberof Report
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: ReportLinks;
}

/**
 * List of Reports.
 * @export
 * @interface ReportCollection
 */
export interface ReportCollection {
  /**
   * List of Reports.
   * @type {Array<Report>}
   * @memberof ReportCollection
   */
  reports: Array<Report>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof ReportCollection
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * Properties of the Report to be created.
 * @export
 * @interface ReportCreate
 */
export interface ReportCreate {
  /**
   * Name of the Report.
   * @type {string}
   * @memberof ReportCreate
   */
  displayName: string;
  /**
   * Description of the Report.
   * @type {string}
   * @memberof ReportCreate
   */
  description?: string;
  /**
   * The project Id this Report will be drawing data from.
   * @type {string}
   * @memberof ReportCreate
   */
  projectId: string;
}

/**
 * Contains contextual hyperlinks to related data.
 * @export
 * @interface ReportLinks
 */
export interface ReportLinks {
  /**
   *
   * @type {Link}
   * @memberof ReportLinks
   */
  project: Link;
}

/**
 * Defines a relationship between Report and Mapping. A Mapping can be associated with more than one Report.
 * @export
 * @interface ReportMapping
 */
export interface ReportMapping {
  /**
   * The Report Id.
   * @type {string}
   * @memberof ReportMapping
   */
  reportId: string;
  /**
   * The Mapping Id.
   * @type {string}
   * @memberof ReportMapping
   */
  mappingId: string;
  /**
   * The iModel Id.
   * @type {string}
   * @memberof ReportMapping
   */
  imodelId: string;
  /**
   *
   * @type {ReportMappingLinks}
   * @memberof ReportMapping
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: ReportMappingLinks;
}

/**
 * List of Report Mappings.
 * @export
 * @interface ReportMappingCollection
 */
export interface ReportMappingCollection {
  /**
   * List of Report Mappings.
   * @type {Array<ReportMapping>}
   * @memberof ReportMappingCollection
   */
  mappings: Array<ReportMapping>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof ReportMappingCollection
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * Properties of the Report Mapping to be created.
 * @export
 * @interface ReportMappingCreate
 */
export interface ReportMappingCreate {
  /**
   * The Mapping Id that should be linked to this Report.
   * @type {string}
   * @memberof ReportMappingCreate
   */
  mappingId: string;
  /**
   * The iModel Id.
   * @type {string}
   * @memberof ReportMappingCreate
   */
  imodelId: string;
}

/**
 * Contains contextual hyperlinks to related data.
 * @export
 * @interface ReportMappingLinks
 */
export interface ReportMappingLinks {
  /**
   *
   * @type {Link}
   * @memberof ReportMappingLinks
   */
  report: Link;
  /**
   *
   * @type {Link}
   * @memberof ReportMappingLinks
   */
  mapping: Link;
  /**
   *
   * @type {Link}
   * @memberof ReportMappingLinks
   */
  imodel: Link;
}

/**
 * Container for a Report Mapping object.
 * @export
 * @interface ReportMappingSingle
 */
export interface ReportMappingSingle {
  /**
   *
   * @type {ReportMapping}
   * @memberof ReportMappingSingle
   */
  mapping: ReportMapping;
}

/**
 * Container for a Report object.
 * @export
 * @interface ReportSingle
 */
export interface ReportSingle {
  /**
   *
   * @type {Report}
   * @memberof ReportSingle
   */
  report: Report;
}

/**
 * Properties of the Report to be updated.
 * @export
 * @interface ReportUpdate
 */
export interface ReportUpdate {
  /**
   * Name of the Report.
   * @type {string}
   * @memberof ReportUpdate
   */
  displayName?: string;
  /**
   * Description of the Report.
   * @type {string}
   * @memberof ReportUpdate
   */
  description?: string;
  /**
   * Flag indicating whether or not a Report has been marked for deletion.
   * @type {boolean}
   * @memberof ReportUpdate
   */
  deleted?: boolean;
}

/**
 * Defines an output property of report aggregation.
 * @export
 * @interface ReportAggregation
 */
export interface ReportAggregation {
  /**
   *
   * @type {string}
   * @memberof ReportAggregation
   */
  reportId: string;
  /**
   *
   * @type {string}
   * @memberof ReportAggregation
   */
  aggregationTableSetId: string;
  /**
   *
   * @type {string}
   * @memberof ReportAggregation
   */
  datasourceId: string;
  /**
   *
   * @type {string}
   * @memberof ReportAggregation
   */
  datasourceType: string;
  /**
   *
   * @type {ReportAggregationLinks}
   * @memberof ReportAggregation
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: ReportAggregationLinks;
}

export interface ReportAggregationCollection {
  /**
   * List of AggregationProperties.
   * @type {Array<ReportAggregation>}
   * @memberof ReportAggregationCollection
   */
  aggregations: Array<ReportAggregation>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof ReportAggregationCollection
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

export interface ReportAggregationLinks {
  /**
   * URL pointing to the related Report.
   * @type {Link}
   * @memberof ReportAggregationLinks
   */
  report: Link;
  /**
   * URL pointing to the related AggregationTableSet.
   * @type {Link}
   * @memberof ReportAggregationLinks
   */
  aggregationTableSet: Link;
  /**
   * URL pointing to the related Datasource.
   * @type {Link}
   * @memberof ReportAggregationLinks
   */
  datasource: Link;
}

export interface ReportAggregationSingle {
  /**
   *
   * @type {ReportAggregation}
   * @memberof ReportAggregationSingle
   */
  reportAggregation: ReportAggregation;
}

export interface ReportAggregationCreate {
  /**
   *
   * @type {string}
   * @memberof ReportAggregationCreate
   */
  aggregationTableSetId?: string;
}
