/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import type { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Properties of the group to be created.
 */
export interface Group {
  /**
    * The group id.
    * @type {string}
    * @memberof Group
    */
  id: string;

  /**
   * Name of the group (OData v4 SimpleIdentifier).
    * @type {string}
    * @memberof Group
    */
  groupName: string;

  /**
   * Description of the group. The default value is empty string.
    * @type {string}
    * @memberof Group
    */
  description: string;

  /**
   * An ECSQL query that represents a collection of iModel elements
    * @type {string}
    * @memberof Group
    */
  query: string;

  /**
   * Contains contextual hyperlinks to related data.
    * @type {string}
    * @memberof Group
    */
  _links: GroupLinks;
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

