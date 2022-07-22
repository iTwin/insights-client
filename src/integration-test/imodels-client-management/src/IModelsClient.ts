/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ApiOptions, AxiosRestClient, RecursiveRequired, RestClient } from "./base";
import { Constants } from "./Constants";
import { BriefcaseOperations, ChangesetOperations, IModelOperations, NamedVersionOperations } from "./operations";
import { CheckpointOperations } from "./operations/checkpoint/CheckpointOperations";
import { IModelsApiUrlFormatter } from "./operations/IModelsApiUrlFormatter";
import { OperationOptions } from "./operations/OperationOptions";

/** User-configurable iModels client options. */
export interface IModelsClientOptions {
  /**
   * Rest client that is used for making HTTP requests. If `undefined` the default client is used which is implemented
   * using `axios` library. See {@link AxiosRestClient}.
   */
  restClient?: RestClient;
  /** iModels API options. See {@link ApiOptions}. */
  api?: ApiOptions;
}

/**
 * iModels API client for iModel management workflows. For more information on the API visit the
 * {@link https://developer.bentley.com/apis/imodels/ iModels API documentation page}.
 */
export class IModelsClient {
  /**
   * Creates a required configuration instance from user provided options and applying default ones for not specified
   * options. See {@link iModelsClientOptions}.
   * @param {iModelsClientOptions} options user-passed client options.
   * @returns {RecursiveRequired<iModelsClientOptions>} required iModels client configuration options.
   */
  public static fillConfiguration(options?: IModelsClientOptions): RecursiveRequired<IModelsClientOptions> {
    return {
      restClient: options?.restClient ?? new AxiosRestClient(),
      api: {
        baseUrl: options?.api?.baseUrl ?? Constants.api.baseUrl,
        version: options?.api?.version ?? Constants.api.version
      }
    };
  }
}
