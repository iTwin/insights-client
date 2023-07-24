/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { decorate, inject, injectable } from "inversify";
import type { AuthorizationParam } from "@itwin/imodels-client-authoring";
import { ITwinsClientConfig } from "./ITwinsClientConfig";
import { ITwin, ITwinClass, ITwinsAccessClient, ITwinsAPIResponse, ITwinSubClass } from "@itwin/itwins-client";

decorate(injectable(), ITwinsAccessClient);

@injectable()
export class TestITwinsClient extends ITwinsAccessClient {
  constructor(
  @inject(ITwinsClientConfig)
    config: ITwinsClientConfig
  ) {
    super(config.baseUrl);
  }

  public async getOrCreateITwin(params: AuthorizationParam & { iTwinName: string }): Promise<string> {
    const authorizationInfo = await params.authorization();
    const accessToken = `${authorizationInfo.scheme} ${authorizationInfo.token}`;

    const iTwinsResponse: ITwinsAPIResponse<ITwin[]> = await this.queryAsync(accessToken, ITwinSubClass.Project, { displayName: params.iTwinName });
    const iTwinsData: ITwin[] = iTwinsResponse.data!;
    if (iTwinsData.length > 0) {
      return iTwinsData[0].id!;
    }

    const iTwinResponse: ITwinsAPIResponse<ITwin> = await this.createiTwin(accessToken, {
      class: ITwinClass.Endeavor,
      subClass: ITwinSubClass.Project,
      displayName: params.iTwinName,
    });
    const iTwin: ITwin = iTwinResponse.data!;
    return iTwin.id!;
  }
}
