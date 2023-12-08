/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { PagedResponseLinks } from "../../common/Links";

/**
 * Defines a single Group (collection of iModel elements) in an iModel Mapping.
 * @export
 * @interface Group
 */
export interface Group {
  /**
   * The Group Id.
   * @type {string}
   * @memberof Group
   */
  id: string;
  /**
   * Name of the Group (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof Group
   */
  groupName: string;
  /**
   * Description of the Group.
   * @type {string}
   * @memberof Group
   */
  description?: string;
  /**
   * Query string that will be executed against the target iModel to build this Group.
   * @type {string}
   * @memberof Group
   */
  query: string;
}

/**
 * List of Groups.
 * @export
 * @interface GroupCollection
 */
export interface GroupCollection {
  /**
   * List of Groups.
   * @type {Array<Group>}
   * @memberof GroupCollection
   */
  groups: Array<Group>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof GroupCollection
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * Properties of the Group to be created.
 * @export
 * @interface GroupCreate
 */
export interface GroupCreate {
  /**
   * Name of the Group (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof GroupCreate
   */
  groupName: string;
  /**
   * Description of the Group.
   * @type {string}
   * @memberof GroupCreate
   */
  description?: string;
  /**
   * Query string that will be executed against the target iModel to build this Group.
   * @type {string}
   * @memberof GroupCreate
   */
  query: string;
}

/**
 * Properties of the GroupCopy to be created.
 * @export
 * @interface GroupCreateCopy
 */
export interface GroupCreateCopy extends GroupCreate {
  /**
   * Ids used for copying a group.
   * @type {SourceGroupReference}
   * @memberof GroupCreateCopy
   */
  source: SourceGroupReference;
}

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
 * Container for a Group object.
 * @export
 * @interface GroupSingle
 */
export interface GroupSingle {
  /**
   *
   * @type {Group}
   * @memberof GroupSingle
   */
  group: Group;
}

/**
 * Properties of the Group to be updated.
 * @export
 * @interface GroupUpdate
 */
export interface GroupUpdate {
  /**
   * Name of the Group (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof GroupUpdate
   */
  groupName?: string;
  /**
   * Description of the Group.
   * @type {string}
   * @memberof GroupUpdate
   */
  description?: string;
  /**
   * Query string that will be executed against the target iModel to build this Group.
   * @type {string}
   * @memberof GroupUpdate
   */
  query?: string;
}
