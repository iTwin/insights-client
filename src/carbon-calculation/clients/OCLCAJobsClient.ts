/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { CARBON_CALCULATION_BASE_PATH, OperationsBase } from "../../common/OperationsBase";
import { IOCLCAJobsClient } from "./IOCLCAJobsClient";
import { OCLCAJob, OCLCAJobCreate, OCLCAJobSingle, OCLCAJobStatus, OCLCAJobStatusSingle, OCLCALoginResponse } from "../interfaces/OCLCAJobs";

export class OCLCAJobsClient extends OperationsBase implements IOCLCAJobsClient {
  constructor(basePath?: string) {
    super(basePath ?? CARBON_CALCULATION_BASE_PATH);
  }
  public async getOCLCAAccessToken(username: string, apiPassword: string) {
    if (username === undefined || apiPassword === undefined) {
      return undefined;
    }
    const requestOptions: RequestInit = {
      method: "POST",
    };
    requestOptions.body = JSON.stringify({
      username,
      password: apiPassword,
    });
    const url = `https://oneclicklcaapp.com/app/api/login`;
    return this.fetchJSON<OCLCALoginResponse>(url, requestOptions);
  }

  public async createJob(accessToken: string, job: OCLCAJobCreate): Promise<OCLCAJob> {
    const url = `${this.basePath}/oneclicklca/jobs`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(job));
    return (await this.fetchJSON<OCLCAJobSingle>(url, requestOptions)).job;
  }

  public async getOCLCAJobStatus(accessToken: string, jobId: string): Promise<OCLCAJobStatus> {
    const url = `${this.basePath}/oneclicklca/jobs/${jobId}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<OCLCAJobStatusSingle>(url, requestOptions)).job;
  }
}
