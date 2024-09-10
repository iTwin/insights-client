/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { OCLCAJob, OCLCAJobCreate, OCLCAJobStatus } from "../interfaces/OCLCAJobs";

export interface IOCLCAJobsClient {
  /**
   * Uploads report data to One Click LCA.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {OCCLAJobCreate} job Request body.
   * @memberof IOCLCAJobsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/create-oneclicklca-job/
   */
  createJob(
    accessToken: AccessToken,
    job: OCLCAJobCreate
  ): Promise<OCLCAJob>;

  /**
   * Queries One Click LCA job status.
   * @param {AccessToken} accessToken OAuth access token with scope `itwin-platform`.
   * @param {string} jobId Unique Identifier of the OCLCA Job.
   * @memberof IOCLCAJobsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-oneclicklca-job-status/
   */
  getOCLCAJobStatus(
    accessToken: AccessToken,
    jobId: string
  ): Promise<OCLCAJobStatus>;
}
