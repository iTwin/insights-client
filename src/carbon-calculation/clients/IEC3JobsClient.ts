/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { EC3ExtractionJobCreate, EC3Job, EC3JobStatus, EC3ReportJobCreate } from "../interfaces/EC3Jobs";

export interface IEC3JobsClient {
  /**
   * Uploads report data to EC3.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {EC3ReportJobCreate | EC3ExtractionJobCreate} job Request body.
   * @memberof IEC3JobsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/create-ec3-job/
   */
  createJob(
    accessToken: AccessToken,
    job: EC3ReportJobCreate | EC3ExtractionJobCreate
  ): Promise<EC3Job>;

  /**
   * Gets EC3 upload job status.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} jobId Unique Identifier of the EC3 Job.
   * @memberof IEC3JobsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-ec3-job-status/
   */
  getEC3JobStatus(
    accessToken: AccessToken,
    jobId: string
  ): Promise<EC3JobStatus>;
}
