/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { CC_BASE_PATH, OneClickLCAApi } from "./generated/api";
import type { JobCreate } from "./generated/api";

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";

const prefixUrl = (baseUrl?: string, prefix?: string) => {
  if (prefix && baseUrl) {
    return baseUrl.replace("api.bentley.com", `${prefix}api.bentley.com`);
  }
  return baseUrl;
};

export class OneClickLCAClient {
  private _oclcaApi: OneClickLCAApi;
  constructor() {
    const baseUrl = prefixUrl(CC_BASE_PATH, process.env.IMJS_URL_PREFIX);
    this._oclcaApi = new OneClickLCAApi(undefined, baseUrl); // TODO: change to baseUrl in deployment
  }

  public async getOneclicklcaAccessToken(username: string, password: string) {
    if (username === undefined || password === undefined) {
      return undefined;
    }

    const response = await fetch("https://oneclicklcaapp.com/app/api/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      return response.json();
    } else {
      return undefined;
    }
  }

  public async createOneclicklcaJob(
    accessToken: AccessToken,
    job: JobCreate
  ) {
    return this._oclcaApi.createOneclicklcaJob(accessToken, job, ACCEPT);
  }

  public async getOneclicklcaJobStatus(
    accessToken: AccessToken,
    jobId: string
  ) {
    return this._oclcaApi.getOneclicklcaJobStatus(jobId, accessToken, ACCEPT);
  }
}
