/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import { PagedResponseLinks } from "../../common/Links";

/**
 * List of Audit Trail Entries.
 * @export
 * @interface AuditTrailCollection
 */
export interface AuditTrailCollection {
  /**
   * List of Audit Trail Entries.
   * @type {Array<AuditTrailEntry>}
   * @memberof AuditTrailCollection
   */
  auditTrailEntries: Array<AuditTrailEntry>;

  /**
   * Contains the hyperlinks to the current and next pages of results.
   * @type {PagedResponseLinks}
   * @memberof AuditTrailCollection
   */
  _links: PagedResponseLinks;
}

/**
 * Defines Audit Trail Entry of a single change.
 * @export
 * @interface AuditTrailEntry
 */
export interface AuditTrailEntry {
  /**
   * Time of the action.
   * @type {string}
   * @memberof AuditTrailEntry
   */
  timestamp: string;

  /**
   * Defines Audit Trail Entry of a single change.
   * @type {string}
   * @memberof AuditTrailEntry
   */
  path: string;

  /**
   * E-mail address of the user who made this change. null for changes made by services.
   * @type {string}
   * @memberof AuditTrailEntry
   */
  userEmail: string;

  /**
   * The action that was made.
   * @type {string}
   * @memberof AuditTrailEntry
   */
  action: string;

  /**
   * List of Entity Property changes.
   * @type {Array<AuditPropertyChange>}
   * @memberof AuditTrailEntry
   */
  changes: Array<AuditPropertyChange>;
}

/**
 * Defines a single Entity Property change.
 * @export
 * @interface AuditPropertyChange
 */
export interface AuditPropertyChange {
  /**
   * Name of the changed Property.
   * @type {string}
   * @memberof AuditPropertyChange
   */
  property: string;

  /**
   * Original Property value.
   * @type {string}
   * @memberof AuditPropertyChange
   */
  oldValue: string;

  /**
   * New Property value.
   * @type {string}
   * @memberof AuditPropertyChange
   */
  newValue: string;
}
