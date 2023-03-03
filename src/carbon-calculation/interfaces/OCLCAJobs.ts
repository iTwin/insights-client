/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { CarbonUploadState } from "../../common/CarbonCalculation";
import { Link } from "../../common/Links";

export interface OCLCAJobCreate {
  /**
   * Report identifier used to upload report data to One Click LCA.
   * @type {string}
   * @memberof OCLCAJobCreate
   */
  reportId: string;
  /**
   * One Click LCA token. Acquiring a token is possible using One Click LCA APIs. Contact api@oneclicklca.com for support.
   * @type {string}
   * @memberof OCLCAJobCreate
   */
  token: string;
}
/**
* Representation of One Click LCA job.
* @export
* @interface OCLCAJob
*/
export interface OCLCAJob {
  /**
   * One Click LCA job id.
   * @type {string}
   * @memberof OCLCAJob
   */
  id: string;
  /**
   *
   * @type {Links}
   * @memberof OCLCAJob
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: OCLCAJobLinks;
}
/**
* Container for One Click LCA job object.
* @export
* @interface OCLCAJobSingle
*/
export interface OCLCAJobSingle {
  /**
   *
   * @type {OCLCAJob}
   * @memberof OCLCAJobSingle
   */
  job: OCLCAJob;
}
/**
* URLs for getting related data.
* @export
* @interface OCLCAJobLinks
*/
export interface OCLCAJobLinks {
  /**
   *
   * @type {Link}
   * @memberof OCLCAJobLinks
   */
  report: Link;
  /**
   *
   * @type {Link}
   * @memberof OCLCAJobLinks
   */
  job: Link;
}
/**
* Representation of One Click LCA job status.
* @export
* @interface OCLCAJobStatus
*/
export interface OCLCAJobStatus {
  /**
   * Globally Unique Identifier of the One Click LCA job.
   * @type {string}
   * @memberof OCLCAJobStatus
   */
  id: string;
  /**
   * Unique Identifier used in One Click LCA webpage to reach uploaded report data.
   * @type {string}
   * @memberof OCLCAJobStatus
   */
  fileToken: string;
  /**
   * Representation of error message.
   * @type {string}
   * @memberof OCLCAJobStatus
   */
  message: string;
  /**
   * Indicates state of the One Click LCA job.
   * @type {string}
   * @memberof OCLCAJobStatus
   */
  status: CarbonUploadState;
  /**
   *
   * @type {OCLCAJobStatusLinks}
   * @memberof OCLCAJobStatus
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: OCLCAJobStatusLinks;
}
/**
* URLs for getting related data.
* @export
* @interface OCLCAJobStatusLinks
*/
export interface OCLCAJobStatusLinks {
  /**
   *
   * @type {Link}
   * @memberof OCLCAJobStatusLinks
   */
  report: Link;
  /**
   *
   * @type {Link}
   * @memberof OCLCAJobStatusLinks
   */
  oneclicklca: Link;
}
/**
* Container for One Click LCA job object.
* @export
* @interface OCLCAJobStatusSingle
*/
export interface OCLCAJobStatusSingle {
  /**
   *
   * @type {OCLCAJobStatus}
   * @memberof OCLCAJobStatusSingle
   */
  job: OCLCAJobStatus;
}

/* eslint-disable @typescript-eslint/naming-convention */
export interface OCLCALoginResponse {
  username: string;
  roles: string[];
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
}
