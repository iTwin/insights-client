/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { Link } from "../../common/Links";

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
    * @type {ExtractionMapping[]}
    * @memberof ExtractionRequestDetails
    */
  mappings: ExtractionMapping[];

  /**
    * List of ECInstanceIds to extract during new extraction run.
    * @type {string[]}
    * @memberof ExtractionRequestDetails
    */
  ecInstanceIds?: string[];
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
   */
  startedOn: string;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: ExtractionLinks;
}

/**
 * Hyperlinks to related data which complements this entity.
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
 */
export interface ExtractionContainer {
  /**
   * Extraction status
   * @type {ExtractionStatus}
   * @memberof ExtractionContainer
   */
  extraction: ExtractionStatus;
}

export enum ExtractionState {
  Queued = "Queued",
  Running = "Running",
  Succeeded = "Succeeded",
  Failed = "Failed"
}

