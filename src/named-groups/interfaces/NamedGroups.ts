/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import type { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Defines a single NamedGroup (collection of iModel elements) in an iTwin.
 */
export interface NamedGroupMinimal {
  /**
    * The group id.
    * @type {string}
    * @memberof NamedGroupMinimal
    */
  id: string;

  /**
    * Name of the group.
    * @type {string}
    * @memberof NamedGroupMinimal
    */
  displayName: string;

  /**
    * Description of the group. The default value is empty string.
    * @type {string}
    * @memberof NamedGroupMinimal
    */
  description: string;

  /**
    * An ECSQL query that represents a collection of iModel elements
    * @type {string}
    * @memberof NamedGroupMinimal
    */
  query: string;

  /**
   * Date when the named group was modified.
   * @type {string}
   * @memberof NamedGroupMinimal
   */
  createdDateTime: string;

  /**
   * Date and time when the group was last modified..
   * @type {string}
   * @memberof NamedGroupMinimal
   */
  modifiedDateTime: string;

  /**
  * Contains contextual hyperlinks to related data.
  * @type {string}
  * @memberof NamedGroupMinimal
  */
  _links: NamedGroupLinks;
}

export interface NamedGroup extends NamedGroupMinimal {
  /**
  * An array of unique key value pairs.
  * @type {Array<NamedGroupMetadata>}
  * @memberof NamedGroup
  */
  metadata: Array<NamedGroupMetadata>;
}

/**
 * Container for a group object.
 */
export interface NamedGroupContainer {
  /**
   * NamedGroup properties.
   * @type {NamedGroup}
   * @memberof NamedGroupContainer
   */
  group: NamedGroup;
}

/**
 * Properties of the group to be created.
 */
export interface NamedGroupCreate {
  /**
   * The iTwinId of the iTwin in which the group is to be created.
   * @type {string}
   * @memberof NamedGroupCreate
   */
  iTwinId: string;

  /**
    * Name of the group.
    * @type {string}
    * @memberof NamedGroupCreate
    */
  displayName: string;

  /**
    * Description of the group. The default value is empty string.
    * @type {string}
    * @memberof NamedGroupCreate
    */
  description?: string;

  /**
    * An ECSQL query that represents a collection of iModel elements.
    * @type {string}
    * @memberof NamedGroupCreate
    */
  query: string;

  /**
  * An array of unique key value pairs.
  * @type {Array<NamedGroupMetadata>}
  * @memberof NamedGroupCreate
  */
  metadata?: Array<NamedGroupMetadata>;
}

/**
 * Hyperlinks to related data which complements this entity.
 */
export interface NamedGroupLinks {
  /**
    * Link to retrieve the related iTwin.
    * @type {Link}
    * @memberof NamedGroupLinks
    *
    */
  iTwin: Link;
}

/**
 * Updates a group.
 */
export interface NamedGroupUpdate {
  /**
    * Name of the group.
    * @type {string}
    * @memberof NamedGroupCreate
    */
  displayName?: string;

  /**
    * Description of the group. The default value is empty string.
    * @type {string}
    * @memberof NamedGroupCreate
    */
  description?: string;

  /**
    * An ECSQL query that represents a collection of iModel elements.
    * @type {string}
    * @memberof NamedGroupCreate
    */
  query?: string;

  /**
  * An array of unique key value pairs.
  * @type {Array<NamedGroupMetadata>}
  * @memberof NamedGroupCreate
  */
  metadata?: Array<NamedGroupMetadata>;
}

/**
 * List of minimal NamedGroups.
 * @export
 * @interface NamedGroupMinimalList
 */
export interface NamedGroupMinimalList {
  /**
   * List of minimal NamedGroups.
   * @type {Array<NamedGroupMinimal>}
   * @memberof NamedGroupMinimalList
   */

  groups: Array<NamedGroupMinimal>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof NamedGroupMinimalList
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * List of NamedGroups.
 * @export
 * @interface NamedGroupList
 */
export interface NamedGroupList {
  /**
   * List of NamedGroups.
   * @type {Array<NamedGroup>}
   * @memberof NamedGroupList
   */
  groups: Array<NamedGroup>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof NamedGroupList
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * @export
 * @interface NamedGroupMetadata
 */
export interface NamedGroupMetadata {
  /**
   * Keys must be unique within the Metadata array.
   * @type {string}
   * @memberof NamedGroupMetadata
   */
  key: string;
  /**
   * @type {string}
   * @memberof NamedGroupMetadata
   */
  value?: string | null;
}
