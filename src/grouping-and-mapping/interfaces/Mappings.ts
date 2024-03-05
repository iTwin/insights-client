/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import { Link, PagedResponseLinks } from "../../common/Links";

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
  iModel: Link;
}

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
 * Properties of the Mapping to be created.
 * @export
 * @interface MappingCreate
 */
export interface MappingCreate {
  /**
    * Id of the iModel for which to create a new mapping.
    * @type {string}
    * @memberof MappingCreate
    */
  iModelId: string;

  /**
    * Name of the Mapping (OData v4 SimpleIdentifier).
    * @type {string}
    * @memberof MappingCreate
    */
  mappingName: string;

  /**
    * Description of the mapping. The default value is empty string.
    * @type {string}
    * @memberof MappingCreate
    */
  description?: string;

  /**
    * Value of false excludes the mapping from the Run Extraction operation and automatic Data Extraction execution after new changes to the iModel are ready to be processed.
    * The default value is false.
    * @type {boolean}
    * @memberof MappingCreate
    */
  extractionEnabled?: boolean;

  /**
    * Id of a mapping to copy. Copying a mapping will cause all of its groups and properties to be copied to the target iModel.
    * @type {string}
    * @memberof MappingCreate
    */
  sourceMappingId?: string;
}

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
    * Value of false excludes the mapping from the Run Extraction operation and automatic Data Extraction execution after new changes to the iModel are ready to be processed.
    * @type {boolean}
    * @memberof MappingUpdate
    */
  extractionEnabled?: boolean;
}

/**
 * Container for a Mapping object.
 * @export
 * @interface MappingContainer
 */
export interface MappingContainer {
  /**
     *
     * @type {Mapping}
     * @memberof MappingSingle
     */
  mapping: Mapping;
}

/**
 * List of Mappings.
 * @export
 * @interface MappingList
 */
export interface MappingList {
  /**
    * List of Mappings.
    * @type {Array<Mapping>}
    * @memberof MappingList
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
 * @export
 * @interface MappingExtraction
 * Information about a completed extraction of a mapping.
 */
export interface MappingExtraction {
  /**
   * The extraction Id.
   * @type {string}
   * @memberof MappingExtraction
   */
  extractionId: string;

  /**
   * End of the extraction.
   * @type {string}
   * @memberof MappingExtraction
   */
  extractionTimeStamp: string;

  /**
   * Index of the iModel Changeset that the mapping was extracted from.
   * @type {number}
   * @memberof MappingExtraction
   */
  changesetIndex: number;

  /**
   * Time of last modification done to the mapping before it was extracted.
   * @type {string}
   * @memberof MappingExtraction
   */
  mappingTimestamp: string;

  /**
   * Contains contextual hyperlinks to related data.
   * @type {MappingExtractionLinks}
   * @memberof MappingExtraction
   */
  _links: MappingExtractionLinks;
}

/**
 * @export
 * @interface MappingExtractionLinks
 */
export interface MappingExtractionLinks {
  /**
   * Hyperlinks to related data which complements this entity.
   * @type {Link}
   * @memberof MappingExtractionLinks
   */
  cdm: Link;
}

/**
 * @export
 * @interface MappingExtractionCollection
 */
export interface MappingExtractionCollection {
  /**
   * List of mapping extractions.
   * @type {Array<MappingExtraction>}
   * @memberof MappingExtractionCollection
   */
  extractions: Array<MappingExtraction>;
  _links: PagedResponseLinks;
}
