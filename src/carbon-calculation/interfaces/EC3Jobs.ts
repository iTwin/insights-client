/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { CarbonUploadState } from "../../common/CarbonCalculation";
import { Link } from "../../common/Links";

/**
 * Container for an EC3Job object.
 * @export
 * @interface EC3JobSingle
 */
export interface EC3JobSingle {
  /**
   *
   * @type {EC3Job}
   * @memberof EC3JobSingle
   */
  job: EC3Job;
}

/**
 * Defines a single EC3 Job.
 * @export
 * @interface EC3Job
 */
export interface EC3Job {
  /**
   * The Job Id.
   * @type {string}
   * @memberof EC3Job
   */
  id: string;
  /**
   *
   * @type {EC3JobLinks}
   * @memberof EC3Job
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: EC3JobLinks;
}

/**
 *
 * @export
 * @interface EC3JobLinks
 */
export interface EC3JobLinks {
  /**
   *
   * @type {Link}
   * @memberof EC3JobLinks
   */
  status: Link;
}

/**
 * Properties of the EC3Job to be created.
 * @export
 * @interface EC3JobCreate
 */
export interface EC3ReportJobCreate {
  /**
   * EC3 Bearer token with `read write` scope. Acquiring a token is possible using EC3 APIs.
   * @type {string}
   * @memberof EC3JobCreate
   */
  ec3BearerToken: string;
  /**
   * Unique Identifier of the target EC3 Configuration.
   * @type {string}
   * @memberof EC3JobCreate
   */
  configurationId: string;
  /**
   * The name of the project to be created in EC3.
   * @type {string}
   * @memberof EC3JobCreate
   */
  projectName: string;
}

export interface EC3ExtractionJobCreate extends EC3ReportJobCreate {
  /**
   * Unique Identifier of the extraction to export data from.
   * @type {string}
   * @memberof EC3JobCreate
   */
  extractionId?: string;
}

/**
 * Container for an EC3JobStatus object.
 * @export
 * @interface EC3JobStatusSingle
 */
export interface EC3JobStatusSingle {
  /**
   *
   * @type {EC3JobStatus}
   * @memberof EC3JobStatusSingle
   */
  job: EC3JobStatus;
}

/**
 * Defines a status of an EC3 Job.
 * @export
 * @interface EC3JobStatus
 */
export interface EC3JobStatus {
  /**
   * The status of the EC3 Job.
   * @type {CarbonUploadState}
   * @memberof EC3JobStatus
   */
  status: CarbonUploadState;
  /**
   * Message which specifies why an issue has occured. Null if no issue has occured.
   * @type {string}
   * @memberof EC3JobStatus
   */
  message?: string;
  /**
   *
   * @type {EC3JobStatusLinks}
   * @memberof EC3JobStatus
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: EC3JobStatusLinks;
}

/**
 *
 * @export
 * @interface EC3JobStatusLinks
 */
export interface EC3JobStatusLinks {
  /**
   *
   * @type {Link}
   * @memberof EC3JobStatusLinks
   */
  ec3Project: Link;
}
