/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import type { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Defines a single Group (collection of iModel elements) in an iModel Mapping.
 */
export interface GroupMinimal {
  /**
    * The group id.
    * @type {string}
    * @memberof GroupMinimal
    */
  id: string;

  /**
    * Name of the group (OData v4 SimpleIdentifier).
    * @type {string}
    * @memberof GroupMinimal
    */
  groupName: string;

  /**
    * Description of the group. The default value is empty string.
    * @type {string}
    * @memberof GroupMinimal
    */
  description: string;

  /**
    * An ECSQL query that represents a collection of iModel elements
    * @type {string}
    * @memberof GroupMinimal
    */
  query: string;

  /**
    * Contains contextual hyperlinks to related data.
    * @type {string}
    * @memberof GroupMinimal
    */
  _links: GroupLinks;
}

export interface Group extends GroupMinimal {
  /**
  * An array of unique key value pairs.
  * @type {Array<GroupMetadata>}
  * @memberof Group
  */
  metadata: Array<GroupMetadata>;
}

/**
 * Container for a group object.
 */
export interface GroupContainer {
  /**
   * Group properties.
   * @type {Group}
   * @memberof GroupContainer
   */
  group: Group;
}

/**
 * Properties of the group to be created.
 */
export interface GroupCreate {
  /**
    * Name of the group (OData v4 SimpleIdentifier).
    * @type {string}
    * @memberof GroupCreate
    */
  groupName: string;

  /**
    * Description of the group. The default value is empty string.
    * @type {string}
    * @memberof GroupCreate
    */
  description?: string;

  /**
    * An ECSQL query that represents a collection of iModel elements.
    * @type {string}
    * @memberof GroupCreate
    */
  query: string;

  /**
  * An array of unique key value pairs.
  * @type {Array<GroupMetadata>}
  * @memberof GroupCreate
  */
  metadata?: Array<GroupMetadata>;

  /**
   * Ids used for copying a group.
   * @type {SourceGroupReference}
   * @memberof GroupCreate
   *
   */
  source?: SourceGroupReference;
}

/**
 * Hyperlinks to related data which complements this entity.
 */
export interface GroupLinks {
  /**
    * Link to retrieve the related iModel.
    * @type {Link}
    * @memberof GroupLinks
    *
    */
  iModel: Link;

  /**
    * Link to retrieve the related mapping.
    * @type {Link}
    * @memberof GroupLinks
    *
    */
  mapping: Link;
}

/**
 * Source ids for copying a group.
 */
export interface SourceGroupReference {
  /**
    * Id of a mapping that contains the group being copied.
    * @type {string}
    * @memberof SourceGroupReference
    */
  mappingId: string;

  /**
    * Id of a group to copy.
    * @type {string}
    * @memberof SourceGroupReference
    */
  groupId: string;
}

/**
 * Updates a group.
 */
export interface GroupUpdate {
  /**
    * Name of the group (OData v4 SimpleIdentifier).
    * @type {string}
    * @memberof GroupCreate
    */
  groupName?: string;

  /**
    * Description of the group. The default value is empty string.
    * @type {string}
    * @memberof GroupCreate
    */
  description?: string;

  /**
    * An ECSQL query that represents a collection of iModel elements.
    * @type {string}
    * @memberof GroupCreate
    */
  query?: string;

  /**
  * An array of unique key value pairs.
  * @type {Array<GroupMetadata>}
  * @memberof GroupCreate
  */
  metadata?: Array<GroupMetadata>;

}

/**
 * List of minimal Groups.
 * @export
 * @interface GroupMinimalList
 */
export interface GroupMinimalList {
  /**
   * List of minimal Groups.
   * @type {Array<GroupMinimal>}
   * @memberof GroupMinimalList
   */

  groups: Array<GroupMinimal>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof GroupMinimalList
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * List of Groups.
 * @export
 * @interface GroupList
 */
export interface GroupList {
  /**
   * List of Groups.
   * @type {Array<Group>}
   * @memberof GroupList
   */
  groups: Array<Group>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof GroupList
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * @export
 * @interface GroupMetadata
 */
export interface GroupMetadata {
  /**
   * Keys must be unique within the Metadata array.
   * @type {string}
   * @memberof GroupMetadata
   */
  key: string;
  /**
   * @type {string}
   * @memberof GroupMetadata
   */
  value?: string | null;
}
