/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Mapping configuration for a manual extraction run.
 * @export
 * @interface ExtractionRequestMapping
 */
export interface ExtractionRequestMapping {
  /**
  * Mapping Id.
  * @type {string}
  * @memberof ExtractionRequestMapping
  */
  id: string;
}

/**
 * Properties of the Extraction Run to be started.
 * @export
 * @interface ExtractionRunRequest
 */
export interface ExtractionRunRequest {
  /**
   * ChangesetId to run the new extraction run against.
   * @type {string}
   * @memberof ExtractionRunRequest
   */
  changesetId?: string;
  /**
   * List of Mappings to extract during new extraction run.
   * @type {ExtractionRequestMapping[]}
   * @memberof ExtractionRunRequest
   */
  mappings?: ExtractionRequestMapping[];
  /**
   * List of ECInstanceIds to extract during new extraction run.
   * @type {string[]}
   * @memberof ExtractionRunRequest
   */
  ecInstanceIds?: string[];
}

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
 * Contains contextual hyperlinks to related data.
 * @export
 * @interface ExtractionHistoryLinks
 */
export interface ExtractionHistoryLinks {
  /**
   *
   * @type {Link}
   * @memberof ExtractionHistoryLinks
   */
  status: Link;
  /**
   *
   * @type {Link}
   * @memberof ExtractionHistoryLinks
   */
  logs: Link;
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: ExtractionStatusLinks;
}

/**
 * List of Extractions.
 * @export
 * @interface ExtractionCollection
 */
export interface ExtractionCollection {
  /**
   * List of Extractions.
   * @type {Array<ExtractionLog>}
   * @memberof ExtractionCollection
   */
  extractions: Array<Extraction>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof ExtractionCollection
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * Extraction properties.
 * @export
 * @interface Extraction
 */
export interface Extraction {
  /**
   * Unique Identifier for the Extraction Run. Use this to check run status.
   * @type {string}
   * @memberof Extraction
   */
  jobId: ExtractorState;
  /**
   * Date when the Extraction was started.
   * @type {string}
   * @memberof Extraction
   */
  startedOn: string;
  /**
   *
   * @type {ExtractionHistoryLinks}
   * @memberof Extraction
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: ExtractionHistoryLinks;
}

export enum ExtractorState {
  Queued = "Queued",
  Running = "Running",
  Succeeded = "Succeeded",
  Failed = "Failed"
}
