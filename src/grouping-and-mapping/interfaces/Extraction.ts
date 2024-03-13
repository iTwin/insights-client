/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Properties of the Extraction Run to be started.
 * @export
 * @interface ExtractionRequestDetails
 */
export interface ExtractionRequestDetails {
  /**
    * Id of the iModel for which to run the extraction.
    * @type {string}
    * @memberof ExtractionRequestDetails
    */
  iModelId: string;

  /**
    * ChangesetId to run the new extraction run against.
    * @type {string}
    * @memberof ExtractionRequestDetails
    */
  changesetId?: string;

  /**
    * List of mappings to extract.
    * @type {Array<ExtractionMapping>}
    * @memberof ExtractionRequestDetails
    */
  mappings: Array<ExtractionMapping>;

  /**
    * List of ECInstanceIds to extract during new extraction run.
    * @type {Array<string>}
    * @memberof ExtractionRequestDetails
    */
  ecInstanceIds?: Array<string>;
}

/**
 * A mapping reference for extraction.
 * @export
 * @interface ExtractionMapping
 */
export interface ExtractionMapping {
  /**
    * The mapping id.
    */
  id: string;
}

/**
 * Current status of an extraction.
 * @export
 * @interface ExtractionStatus
 */
export interface ExtractionStatus {
  /**
    * The extraction Id.
    * @type {string}
    * @memberof ExtractionStatus
    */
  id: string;

  /**
    * Current state of the extraction.
    * One of `Queued`, `Running`, `Succeeded`,
    * `PartiallySucceeded`, `Failed`.
    * @type {ExtractionState}
    * @memberof ExtractionStatus
    */
  state: ExtractionState;

  /**
   * Start time of the extraction.
   * @type {string}
   * @memberof ExtractionStatus
   */
  startedOn: string;

  /**
   * Contains contextual hyperlinks to related data.
   * @type {ExtractionLinks}
   * @memberof ExtractionStatus
   */
  _links: ExtractionLinks;
}

/**
 * Hyperlinks to related data which complements this entity.
 * @export
 * @interface ExtractionLinks
 */
export interface ExtractionLinks {
  /**
   * Link to retrieve the extraction status.
   * @type {Link}
   * @memberof ExtractionLinks
   */
  status: Link;
}

/**
 * Container for an extraction status object.
 * @export
 * @interface ExtractionContainer
 */
export interface ExtractionContainer {
  /**
   * Extraction status
   * @type {ExtractionStatus}
   * @memberof ExtractionContainer
   */
  extraction: ExtractionStatus;
}

/**
 * Collection of extractions.
 * @export
 * @interface ExtractionsResponse
 */
export interface ExtractionsResponse {
  /**
   * List of extractions
   * @type {Array<ExtractionStatus>}
   * @memberof ExtractionsResponse
   */
  extractions: Array<ExtractionStatus>;

  /**
   * Contains the hyperlinks to the current and next pages of results.
   * @type {PagedResponseLinks}
   * @memberof ExtractionsResponse
   */
  _links: PagedResponseLinks;
}

/**
 * A single extraction log entry.
 * @export
 * @interface ExtractionLogEntry
 */
export interface ExtractionLogEntry {

  /**
   * Current state of the extraction.
   * One of `Queued`, `Running`, `Succeeded`,
   * `PartiallySucceeded`, `Failed`.
   * @type {ExtractionState}
   * @memberof ExtractionLogEntry
   */
  state: ExtractionState;

  /**
   * Time when this log entry was created.
   * @type {string}
   * @memberof ExtractionLogEntry
   */
  dateTime: string;

  /**
   * Type of context for which this log
   * entry was created, e.g, 'IModel', 'Mapping'
   * @type {string}
   * @memberof ExtractionLogEntry
   */
  contextType: string;

  /**
   * Id of the context that this log entry is related to.
   * @type {string}
   * @memberof ExtractionLogEntry.
   */
  contextId: string;

  /**
   * Level of the log entry. One of 'Information', 'Warning', 'Error'.
   * @type {LogLevelEntry}
   * @memberof ExtractionLogEntry.
   */
  level: LogLevelEntry;

  /**
   * Category of the log entry, e.g., 'GroupQuery', 'QueryTranslation', 'QueryExecution', 'StateChange'.
   * @type {string}
   * @memberof ExtractionLogEntry.
   */
  category: string;

  /**
   * Message of the log entry.
   * @type {string}
   * @memberof ExtractionLogEntry.
   */
  message: string;
}

/**
 * Collection of extraction logs.
 * @export
 * @interface ExtractionLogsResponse
 */
export interface ExtractionLogsResponse {
  /**
   * List of extraction logs.
   * @type {Array<ExtractionLogEntry>}
   * @memberof ExtractionLogsResponse
   */
  logs: Array<ExtractionLogEntry>;

  /**
   * Contains the hyperlinks to the current and next pages of results.
   * @type {PagedResponseLinks}
   * @memberof ExtractionLogsResponse
   */
  _links: PagedResponseLinks;

}

/**
 * Allowed current state of extraction.
 * @export
 * @interface ExtractionState
 */
export enum ExtractionState {
  Queued = "Queued",
  Running = "Running",
  Succeeded = "Succeeded",
  PartiallySucceeded = "PartiallySucceeded",
  Failed = "Failed"
}

/**
 * Level of the log entry.
 * @export
 * @interface LogLevelEntry
 */
export enum LogLevelEntry {
  Information = "Information",
  Warning = "Warning",
  Error = "Error"
}

