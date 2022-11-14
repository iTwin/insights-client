/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { CARBON_CALCULATION_BASE_PATH, OperationsBase } from "../OperationsBase";
import { IEC3JobClient } from "./IEC3JobClient";
import { EC3Job, EC3JobCreate, EC3JobSingle, EC3JobStatus, EC3JobStatusSingle } from "../interfaces/EC3Jobs";

export class EC3JobClient extends OperationsBase implements IEC3JobClient {
  constructor(basePath?: string) {
    super(basePath ?? CARBON_CALCULATION_BASE_PATH);
  }

  public async createJob(accessToken: string, job: EC3JobCreate): Promise<EC3Job> {
    const url = `${this.basePath}/ec3/jobs`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(job));
    return (await this.fetchJSON<EC3JobSingle>(url, requestOptions)).job;
  }

  public async getEC3JobStatus(accessToken: string, jobId: string): Promise<EC3JobStatus> {
    const url = `${this.basePath}/ec3/jobs/${jobId}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<EC3JobStatusSingle>(url, requestOptions)).job;
  }
}
