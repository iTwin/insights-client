/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { Link, PagedResponseLinks } from "./Links";

/**
 * Defines a Mapping for an iModel. Each mapping represents a collection of 'Groups', sets of iModel elements, and their properties of interest.
 * @export
 * @interface Mapping
 */
export interface Mapping {
  /**
   * The Mapping Id.
   * @type {string}
   * @memberof Mapping
   */
  id: string;
  /**
   * Name of the Mapping (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof Mapping
   */
  mappingName: string;
  /**
   * Description of the Mapping.
   * @type {string}
   * @memberof Mapping
   */
  description: string;
  /**
   * Value of `false` excludes a `Mapping` from the `Run Extraction` operation and automatic execution after the `Create iModel Named Version` operation.
   * @type {boolean}
   * @memberof Mapping
   */
  extractionEnabled: boolean;
  /**
   * Date when the Mapping was created.
   * @type {string}
   * @memberof Mapping
   */
  createdOn: string;
  /**
   * Email of the user who created the Mapping.
   * @type {string}
   * @memberof Mapping
   */
  createdBy: string;
  /**
   * Date when the Mapping was last modified.
   * @type {string}
   * @memberof Mapping
   */
  modifiedOn: string;
  /**
   * Email of the user who last modified the Mapping.
   * @type {string}
   * @memberof Mapping
   */
  modifiedBy: string;
  /**
   *
   * @type {MappingLinks}
   * @memberof Mapping
   */
  _links: MappingLinks;
}

/**
 * List of Mappings.
 * @export
 * @interface MappingCollection
 */
export interface MappingCollection {
  /**
   * List of Mappings.
   * @type {Array<Mapping>}
   * @memberof MappingCollection
   */
  mappings: Array<Mapping>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof MappingCollection
   */
  _links: PagedResponseLinks;
}

/**
 * Properties for the copied Mapping.
 * @export
 * @interface MappingCopy
 */
export interface MappingCopy {
  /**
   * The target iModel Id.
   * @type {string}
   * @memberof MappingCopy
   */
  targetIModelId: string;
  /**
   * Name of the target Mapping (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof MappingCopy
   */
  mappingName: string;
}

/**
 * Properties of the Mapping to be created.
 * @export
 * @interface MappingCreate
 */
export interface MappingCreate {
  /**
   * Name of the Mapping (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof MappingCreate
   */
  mappingName: string;
  /**
   * Description of the Mapping.
   * @type {string}
   * @memberof MappingCreate
   */
  description: string;
  /**
   * Value of `false` excludes a `Mapping` from the `Run Extraction` operation and automatic execution after the `Create iModel Named Version` operation. The default value is `true`.
   * @type {boolean}
   * @memberof MappingCreate
   */
  extractionEnabled: boolean;
}

/**
 * Contains contextual hyperlinks to related data.
 * @export
 * @interface MappingLinks
 */
export interface MappingLinks {
  /**
   *
   * @type {Link}
   * @memberof MappingLinks
   */
  imodel: Link;
}

/**
 * Container for a Mapping object.
 * @export
 * @interface MappingSingle
 */
export interface MappingSingle {
  /**
   *
   * @type {Mapping}
   * @memberof MappingSingle
   */
  mapping: Mapping;
}

/**
 * Properties of the Mapping to be updated.
 * @export
 * @interface MappingUpdate
 */
export interface MappingUpdate {
  /**
   * Name of the Mapping (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof MappingUpdate
   */
  mappingName?: string;
  /**
   * Description of the Mapping.
   * @type {string}
   * @memberof MappingUpdate
   */
  description?: string;
  /**
   * Value of `false` excludes a `Mapping` from the `Run Extraction` operation and automatic execution after the `Create iModel Named Version` operation.
   * @type {boolean}
   * @memberof MappingUpdate
   */
  extractionEnabled?: boolean;
}
