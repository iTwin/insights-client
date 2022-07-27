/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { Link, PagedResponseLinks } from "./Links";

/**
 * Contains contextual hyperlinks to related data.
 * @export
 * @interface ExtractionStatusLinks
 */
export interface ExtractionStatusLinks {
  /**
   *
   * @type {Link}
   * @memberof ExtractionStatusLinks
   */
  logs: Link;
}

/**
 * Contains contextual hyperlinks to related data.
 * @export
 * @interface ExtractionRunLinks
 */
 export interface ExtractionRunLinks {
  /**
   *
   * @type {Link}
   * @memberof ExtractionRunLinks
   */
  status: Link;
}

/**
 * Defines a single Extraction Log response.
 * @export
 * @interface ExtractionLog
 */
export interface ExtractionLog {
  /**
   * The state of the Extraction at specific time.
   * @type {string}
   * @memberof ExtractionLog
   */
  state: ExtractorState;
  /**
   * The Reason explaining why state has specific value.
   * @type {string}
   * @memberof ExtractionLog
   */
  reason: string;
  /**
   * Date when Extraction Log entity was created.
   * @type {string}
   * @memberof ExtractionLog
   */
  dateTime: string;
  /**
   * Unique Identifier for the Extraction Run.
   * @type {string}
   * @memberof ExtractionLog
   */
  jobId: string;
  /**
   * The type of the contextId.
   * @type {string}
   * @memberof ExtractionLog
   */
  contextType: string;
  /**
   * The Context Id.
   * @type {string}
   * @memberof ExtractionLog
   */
  contextId: string;
  /**
   * The level of an issue. If Extraction Log entity is not an issue it is marked as \"Information\".
   * @type {string}
   * @memberof ExtractionLog
   */
  level: string;
  /**
   * The issue category. If Extraction Log entity is not an issue this is marked as \"Unknown\".
   * @type {string}
   * @memberof ExtractionLog
   */
  category: string;
  /**
   * Message which specifies why certain issue occured. If Extraction Log entity is not an issue Message is null.
   * @type {string}
   * @memberof ExtractionLog
   */
  message?: string;
  /**
   * If Extraction Log contains an issue, this is marked as true.
   * @type {boolean}
   * @memberof ExtractionLog
   */
  containsIssues: boolean;
}

/**
 * List of Extraction Logs.
 * @export
 * @interface ExtractionLogCollection
 */
export interface ExtractionLogCollection {
  /**
   * List of Extraction Logs.
   * @type {Array<ExtractionLog>}
   * @memberof ExtractionLogCollection
   */
  logs: Array<ExtractionLog>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof ExtractionLogCollection
   */
  _links: PagedResponseLinks;
}

/**
 * Metadata associated with a data extraction run.
 * @export
 * @interface ExtractionRunSingle
 */
export interface ExtractionRunSingle {
  /**
   *
   * @type {ExtractionRun}
   * @memberof ExtractionRunSingle
   */
  run: ExtractionRun;
}

/**
 * Extraction Run properties.
 * @export
 * @interface ExtractionRun
 */
export interface ExtractionRun {
  /**
   * Unique Identifier for the Extraction Run. Use this to check run status.
   * @type {string}
   * @memberof ExtractionRun
   */
  id: string;
  /**
   * 
   * @type {ExtractionRunLinks}
   * @memberof ExtractionRun
   */
  _links: ExtractionRunLinks;
}

/**
 * Status of the specified Extraction Run.
 * @export
 * @interface ExtractionStatusSingle
 */
export interface ExtractionStatusSingle {
  /**
   *
   * @type {ExtractionStatusSingle}
   * @memberof ExtractionStatusSingle
   */
  status: ExtractionStatus;
}

/**
 * Extraction Status properties.
 * @export
 * @interface ExtractionStatus
 */
export interface ExtractionStatus {
  /**
   * Current state of the Extraction Run.
   * @type {string}
   * @memberof ExtractionStatus
   */
  state: ExtractorState;
  /**
   * Additional justification for the current state of the Extraction Run.
   * @type {string}
   * @memberof ExtractionStatus
   */
  reason: string;
  /**
   * Flag indicating whether or not a Report has been marked for deletion.
   * @type {boolean}
   * @memberof ExtractionStatus
   */
  containsIssues: boolean;
  /**
   * 
   * @type {ExtractionLinks}
   * @memberof ExtractionStatus
   */
  _links: ExtractionStatusLinks;
}

export enum ExtractorState {
  Queued = "Queued",
  Running = "Running",
  Succeeded = "Succeeded",
  Failed = "Failed"
}
