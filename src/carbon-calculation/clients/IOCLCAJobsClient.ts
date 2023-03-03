import { AccessToken } from "@itwin/core-bentley";
import { OCLCAJob, OCLCAJobCreate, OCLCAJobStatus } from "../interfaces/OCLCAJobs";

export interface IOCLCAJobsClient {
  /**
   * Uploads report data to OCLCA.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {OCCLAJobCreate} job Request body.
   * @memberof IOCLCAJobsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/create-oneclicklca-job/
   */
  createJob(
    accessToken: AccessToken,
    job: OCLCAJobCreate
  ): Promise<OCLCAJob>;

  /**
   * Gets OCLCA upload job status.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} jobId Unique Identifier of the OCLCA Job.
   * @memberof IOCLCAJobsClient
   * @link https://developer.bentley.com/apis/carbon-calculation/operations/get-oneclicklca-job-status/
   */
  getOCLCAJobStatus(
    accessToken: AccessToken,
    jobId: string
  ): Promise<OCLCAJobStatus>;
}
