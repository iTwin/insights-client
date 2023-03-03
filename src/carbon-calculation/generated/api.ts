/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable */
//@ts-nocheck
// tslint:disable
/**
 * Carbon Calculation
 * Access iTwin data integrations with various Carbon Calculation solutions for Embodied Carbon, Life Cycle Assesments, and more.
 *
 * OpenAPI spec version: v1
 *
 *
 * NOTE: This file is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the file manually.
 */

import * as url from 'url';
import isomorphicFetch from 'cross-fetch';
import { Configuration } from './configuration';

const BASE_PATH = 'https://api.bentley.com/insights/carbon-calculation'.replace(
  /\/+$/,
  '',
);
export const CC_BASE_PATH = BASE_PATH;

/**
 *
 */
const COLLECTION_FORMATS = {
  csv: ',',
  ssv: ' ',
  tsv: '\t',
  pipes: '|',
};

/**
 *
 * @interface FetchAPI
 */
interface FetchAPI {
  (url: string, init?: any): Promise<Response>;
}

/**
 *
 * @interface FetchArgs
 */
interface FetchArgs {
  url: string;
  options: any;
}

/**
 *
 * @class BaseAPI
 */
class BaseAPI {
  protected configuration: Configuration;

  constructor(
    configuration?: Configuration,
    protected basePath: string = BASE_PATH,
    protected fetch: FetchAPI = isomorphicFetch,
  ) {
    if (configuration) {
      this.configuration = configuration;
      this.basePath = configuration.basePath || this.basePath;
    }
  }
}

/**
 *
 * @class RequiredError
 * @extends {Error}
 */
class RequiredError extends Error {
  name: 'RequiredError';
  constructor(public field: string, msg?: string) {
    super(msg);
  }
}

/**
 * Gives details for an error that occurred while handling the request. Note that clients MUST NOT assume that every failed request will produce an object of this schema, or that all of the properties in the response will be non-null, as the error may have prevented this response from being constructed.
 * @export
 * @interface ErrorContainer
 */
export interface ErrorContainer {
  /**
   *
   * @type {ModelError}
   * @memberof ErrorContainer
   */
  error: ModelError;
}
/**
 * Contains error information.
 * @interface ErrorDetails
 */
interface ErrorDetails {
  /**
   * One of a server-defined set of error codes.
   * @type {string}
   * @memberof ErrorDetails
   */
  code: string;
  /**
   * A human-readable representation of the error.
   * @type {string}
   * @memberof ErrorDetails
   */
  message: string;
}
/**
 * Gives details for an error that occurred while handling the request. Note that clients MUST NOT assume that every failed request will produce an object of this schema, or that all of the properties in the response will be non-null, as the error may have prevented this response from being constructed.
 * @interface ErrorResponse
 */
interface ErrorResponse {
  /**
   *
   * @type {ModelError}
   * @memberof ErrorResponse
   */
  error: ModelError;
}
/**
 * Properties of One Click LCA job to be created.
 * @export
 * @interface JobCreate
 */
export interface JobCreate {
  /**
   * Report identifier used to upload report data to One Click LCA.
   * @type {string}
   * @memberof JobCreate
   */
  reportId: string;
  /**
   * One Click LCA token. Acquiring a token is possible using One Click LCA APIs. Contact api@oneclicklca.com for support.
   * @type {string}
   * @memberof JobCreate
   */
  token: string;
}
/**
 * Representation of One Click LCA job.
 * @export
 * @interface JobCreation
 */
export interface JobCreation {
  /**
   * One Click LCA job id.
   * @type {string}
   * @memberof JobCreation
   */
  id?: string;
  /**
   *
   * @type {JobLinks}
   * @memberof JobCreation
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links?: JobLinks;
}
/**
 * Container for One Click LCA job object.
 * @export
 * @interface JobCreationResponse
 */
export interface JobCreationResponse {
  /**
   *
   * @type {JobCreation}
   * @memberof JobCreationResponse
   */
  job?: JobCreation;
}
/**
 * URLs for getting related data.
 * @export
 * @interface JobLinks
 */
export interface JobLinks {
  /**
   *
   * @type {Link}
   * @memberof JobLinks
   */
  report?: Link;
  /**
   *
   * @type {Link}
   * @memberof JobLinks
   */
  job?: Link;
}
/**
 * Representation of One Click LCA job status.
 * @export
 * @interface JobStatus
 */
export interface JobStatus {
  /**
   * Globally Unique Identifier of the One Click LCA job.
   * @type {string}
   * @memberof JobStatus
   */
  id?: string;
  /**
   * Unique Identifier used in One Click LCA webpage to reach uploaded report data.
   * @type {string}
   * @memberof JobStatus
   */
  fileToken?: string;
  /**
   * Representation of error message.
   * @type {string}
   * @memberof JobStatus
   */
  message?: string;
  /**
   * Indicates state of the One Click LCA job.
   * @type {string}
   * @memberof JobStatus
   */
  status?: JobStatus.StatusEnum;
  /**
   *
   * @type {JobStatusLinks}
   * @memberof JobStatus
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links?: JobStatusLinks;
}

/**
 * @export
 * @namespace JobStatus
 */
export namespace JobStatus {
  /**
   * @export
   * @enum {string}
   */
  export enum StatusEnum {
    Queued = <any>'Queued',
    Running = <any>'Running',
    Succeeded = <any>'Succeeded',
    Failed = <any>'Failed',
  }
}
/**
 * URLs for getting related data.
 * @export
 * @interface JobStatusLinks
 */
export interface JobStatusLinks {
  /**
   *
   * @type {Link}
   * @memberof JobStatusLinks
   */
  report?: Link;
  /**
   *
   * @type {Link}
   * @memberof JobStatusLinks
   */
  oneclicklca?: Link;
}
/**
 * Container for One Click LCA job object.
 * @export
 * @interface JobStatusResponse
 */
export interface JobStatusResponse {
  /**
   *
   * @type {JobStatus}
   * @memberof JobStatusResponse
   */
  job?: JobStatus;
}
/**
 * Hyperlink container.
 * @interface Link
 */
interface Link {
  /**
   * Hyperlink to the specific entity.
   * @type {string}
   * @memberof Link
   */
  href?: string;
}
/**
 * Contains error information and an optional array of more specific errors.
 * @interface ModelError
 */
interface ModelError {
  /**
   * One of a server-defined set of error codes.
   * @type {string}
   * @memberof ModelError
   */
  code: string;
  /**
   * A human-readable representation of the error.
   * @type {string}
   * @memberof ModelError
   */
  message: string;
  /**
   * Optional array of more specific errors.
   * @type {Array<ErrorDetails>}
   * @memberof ModelError
   */
  details?: Array<ErrorDetails>;
}
/**
 * OneClickLCAApi - fetch parameter creator
 * @export
 */
export const OneClickLCAApiFetchParamCreator = function (
  configuration?: Configuration,
) {
  return {
    /**
     * ---    Uploads report data to One Click LCA.    ### One Click LCA    [One Click LCA](https://www.oneclicklca.com) is a third-party construction LCA and EPD software company. Bentley's iTwin Platform integration with One Click LCA allows you to take Quantity Takeoff Reports created using the iTwin Reporting Platform and export them to One Click LCA for convenient Life Cycle Analysis. iTwin Platform enables the incorporation of engineering data created by diverse design tools, which is exported through this integration, allowing you to gain insights into the environmental impacts of your infrastructure projects.    See [iTwin Reporting Platform documentation](https://developer.bentley.com/apis/insights) for guidance on how to create a Report.    An account with One Click LCA is required.    Bentley is not responsible or liable for third-party resources' content, products, services, or practices and does not make any representations regarding their quality, availability or accuracy. Access and use of One Click LCA resources are subject to the terms and conditions set forth by One Click LCA.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level.     Alternatively the user should be an Organization Administrator for the Organization that owns a given Project.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ---
     * @summary Create One Click LCA job
     * @param {string} Authorization OAuth access token with scope &#x60;insights:modify&#x60;
     * @param {JobCreate} [body]
     * @param {string} [Accept] Setting to &#x60;application/vnd.bentley.itwin-platform.v1+json&#x60; is recommended.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createOneclicklcaJob(
      Authorization: string,
      body?: JobCreate,
      Accept?: string,
      options: any = {},
    ): FetchArgs {
      // verify required parameter 'Authorization' is not null or undefined
      if (Authorization === null || Authorization === undefined) {
        throw new RequiredError(
          'Authorization',
          'Required parameter Authorization was null or undefined when calling createOneclicklcaJob.',
        );
      }
      const localVarPath = `/oneclicklca/jobs`;
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication apiKeyHeader required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('X-Api-Subscription-Key')
            : configuration.apiKey;
        localVarHeaderParameter['X-Api-Subscription-Key'] = localVarApiKeyValue;
      }

      // authentication apiKeyQuery required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('subscription-key')
            : configuration.apiKey;
        localVarQueryParameter['subscription-key'] = localVarApiKeyValue;
      }

      // authentication oauth2Bentley OAuth2 Service required
      // oauth required
      if (configuration && configuration.accessToken) {
        const localVarAccessTokenValue =
          typeof configuration.accessToken === 'function'
            ? configuration.accessToken('oauth2Bentley OAuth2 Service', [
                'insights:read insights:modify',
              ])
            : configuration.accessToken;
        localVarHeaderParameter['Authorization'] =
          'Bearer ' + localVarAccessTokenValue;
      }

      if (Authorization !== undefined && Authorization !== null) {
        localVarHeaderParameter['Authorization'] = String(Authorization);
      }

      if (Accept !== undefined && Accept !== null) {
        localVarHeaderParameter['Accept'] = String(Accept);
      }

      localVarHeaderParameter['Content-Type'] = 'application/json';

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query,
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers,
      );
      const needsSerialization =
        <any>'JobCreate' !== 'string' ||
        localVarRequestOptions.headers['Content-Type'] === 'application/json';
      localVarRequestOptions.body = needsSerialization
        ? JSON.stringify(body || {})
        : body || '';

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * ---    Queries One Click LCA job status.    ### One Click LCA    [One Click LCA](https://www.oneclicklca.com) is a third-party construction LCA and EPD software company. Bentley's iTwin Platform integration with One Click LCA allows you to take Quantity Takeoff Reports created using the iTwin Reporting Platform and export them to One Click LCA for convenient Life Cycle Analysis. iTwin Platform enables the incorporation of engineering data created by diverse design tools, which is exported through this integration, allowing you to gain insights into the environmental impacts of your infrastructure projects.    See [iTwin Reporting Platform documentation](https://developer.bentley.com/apis/insights) for guidance on how to create a Report.    An account with One Click LCA is required.    Bentley is not responsible or liable for third-party resources' content, products, services, or practices and does not make any representations regarding their quality, availability or accuracy. Access and use of One Click LCA resources are subject to the terms and conditions set forth by One Click LCA.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level.     Alternatively the user should be an Organization Administrator for the Organization that owns a given Project.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ---
     * @summary Get One Click LCA job status
     * @param {string} jobId The Job Id.
     * @param {string} Authorization OAuth access token with scope &#x60;insights:read&#x60;
     * @param {string} [Accept] Setting to &#x60;application/vnd.bentley.itwin-platform.v1+json&#x60; is recommended.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getOneclicklcaJobStatus(
      jobId: string,
      Authorization: string,
      Accept?: string,
      options: any = {},
    ): FetchArgs {
      // verify required parameter 'jobId' is not null or undefined
      if (jobId === null || jobId === undefined) {
        throw new RequiredError(
          'jobId',
          'Required parameter jobId was null or undefined when calling getOneclicklcaJobStatus.',
        );
      }
      // verify required parameter 'Authorization' is not null or undefined
      if (Authorization === null || Authorization === undefined) {
        throw new RequiredError(
          'Authorization',
          'Required parameter Authorization was null or undefined when calling getOneclicklcaJobStatus.',
        );
      }
      const localVarPath = `/oneclicklca/jobs/{jobId}`.replace(
        `{${'jobId'}}`,
        encodeURIComponent(String(jobId)),
      );
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication apiKeyHeader required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('X-Api-Subscription-Key')
            : configuration.apiKey;
        localVarHeaderParameter['X-Api-Subscription-Key'] = localVarApiKeyValue;
      }

      // authentication apiKeyQuery required
      if (configuration && configuration.apiKey) {
        const localVarApiKeyValue =
          typeof configuration.apiKey === 'function'
            ? configuration.apiKey('subscription-key')
            : configuration.apiKey;
        localVarQueryParameter['subscription-key'] = localVarApiKeyValue;
      }

      // authentication oauth2Bentley OAuth2 Service required
      // oauth required
      if (configuration && configuration.accessToken) {
        const localVarAccessTokenValue =
          typeof configuration.accessToken === 'function'
            ? configuration.accessToken('oauth2Bentley OAuth2 Service', [
                'insights:read insights:modify',
              ])
            : configuration.accessToken;
        localVarHeaderParameter['Authorization'] =
          'Bearer ' + localVarAccessTokenValue;
      }

      if (Authorization !== undefined && Authorization !== null) {
        localVarHeaderParameter['Authorization'] = String(Authorization);
      }

      if (Accept !== undefined && Accept !== null) {
        localVarHeaderParameter['Accept'] = String(Accept);
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query,
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign(
        {},
        localVarHeaderParameter,
        options.headers,
      );

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * OneClickLCAApi - functional programming interface
 * @export
 */
export const OneClickLCAApiFp = function (configuration?: Configuration) {
  return {
    /**
     * ---    Uploads report data to One Click LCA.    ### One Click LCA    [One Click LCA](https://www.oneclicklca.com) is a third-party construction LCA and EPD software company. Bentley's iTwin Platform integration with One Click LCA allows you to take Quantity Takeoff Reports created using the iTwin Reporting Platform and export them to One Click LCA for convenient Life Cycle Analysis. iTwin Platform enables the incorporation of engineering data created by diverse design tools, which is exported through this integration, allowing you to gain insights into the environmental impacts of your infrastructure projects.    See [iTwin Reporting Platform documentation](https://developer.bentley.com/apis/insights) for guidance on how to create a Report.    An account with One Click LCA is required.    Bentley is not responsible or liable for third-party resources' content, products, services, or practices and does not make any representations regarding their quality, availability or accuracy. Access and use of One Click LCA resources are subject to the terms and conditions set forth by One Click LCA.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level.     Alternatively the user should be an Organization Administrator for the Organization that owns a given Project.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ---
     * @summary Create One Click LCA job
     * @param {string} Authorization OAuth access token with scope &#x60;insights:modify&#x60;
     * @param {JobCreate} [body]
     * @param {string} [Accept] Setting to &#x60;application/vnd.bentley.itwin-platform.v1+json&#x60; is recommended.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createOneclicklcaJob(
      Authorization: string,
      body?: JobCreate,
      Accept?: string,
      options?: any,
    ): (fetch?: FetchAPI, basePath?: string) => Promise<JobCreationResponse> {
      const localVarFetchArgs = OneClickLCAApiFetchParamCreator(
        configuration,
      ).createOneclicklcaJob(Authorization, body, Accept, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH,
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options,
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
    /**
     * ---    Queries One Click LCA job status.    ### One Click LCA    [One Click LCA](https://www.oneclicklca.com) is a third-party construction LCA and EPD software company. Bentley's iTwin Platform integration with One Click LCA allows you to take Quantity Takeoff Reports created using the iTwin Reporting Platform and export them to One Click LCA for convenient Life Cycle Analysis. iTwin Platform enables the incorporation of engineering data created by diverse design tools, which is exported through this integration, allowing you to gain insights into the environmental impacts of your infrastructure projects.    See [iTwin Reporting Platform documentation](https://developer.bentley.com/apis/insights) for guidance on how to create a Report.    An account with One Click LCA is required.    Bentley is not responsible or liable for third-party resources' content, products, services, or practices and does not make any representations regarding their quality, availability or accuracy. Access and use of One Click LCA resources are subject to the terms and conditions set forth by One Click LCA.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level.     Alternatively the user should be an Organization Administrator for the Organization that owns a given Project.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ---
     * @summary Get One Click LCA job status
     * @param {string} jobId The Job Id.
     * @param {string} Authorization OAuth access token with scope &#x60;insights:read&#x60;
     * @param {string} [Accept] Setting to &#x60;application/vnd.bentley.itwin-platform.v1+json&#x60; is recommended.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getOneclicklcaJobStatus(
      jobId: string,
      Authorization: string,
      Accept?: string,
      options?: any,
    ): (fetch?: FetchAPI, basePath?: string) => Promise<JobStatusResponse> {
      const localVarFetchArgs = OneClickLCAApiFetchParamCreator(
        configuration,
      ).getOneclicklcaJobStatus(jobId, Authorization, Accept, options);
      return (
        fetch: FetchAPI = isomorphicFetch,
        basePath: string = BASE_PATH,
      ) => {
        return fetch(
          basePath + localVarFetchArgs.url,
          localVarFetchArgs.options,
        ).then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            throw response;
          }
        });
      };
    },
  };
};

/**
 * OneClickLCAApi - factory interface
 * @export
 */
export const OneClickLCAApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string,
) {
  return {
    /**
     * ---    Uploads report data to One Click LCA.    ### One Click LCA    [One Click LCA](https://www.oneclicklca.com) is a third-party construction LCA and EPD software company. Bentley's iTwin Platform integration with One Click LCA allows you to take Quantity Takeoff Reports created using the iTwin Reporting Platform and export them to One Click LCA for convenient Life Cycle Analysis. iTwin Platform enables the incorporation of engineering data created by diverse design tools, which is exported through this integration, allowing you to gain insights into the environmental impacts of your infrastructure projects.    See [iTwin Reporting Platform documentation](https://developer.bentley.com/apis/insights) for guidance on how to create a Report.    An account with One Click LCA is required.    Bentley is not responsible or liable for third-party resources' content, products, services, or practices and does not make any representations regarding their quality, availability or accuracy. Access and use of One Click LCA resources are subject to the terms and conditions set forth by One Click LCA.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level.     Alternatively the user should be an Organization Administrator for the Organization that owns a given Project.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ---
     * @summary Create One Click LCA job
     * @param {string} Authorization OAuth access token with scope &#x60;insights:modify&#x60;
     * @param {JobCreate} [body]
     * @param {string} [Accept] Setting to &#x60;application/vnd.bentley.itwin-platform.v1+json&#x60; is recommended.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createOneclicklcaJob(
      Authorization: string,
      body?: JobCreate,
      Accept?: string,
      options?: any,
    ) {
      return OneClickLCAApiFp(configuration).createOneclicklcaJob(
        Authorization,
        body,
        Accept,
        options,
      )(fetch, basePath);
    },
    /**
     * ---    Queries One Click LCA job status.    ### One Click LCA    [One Click LCA](https://www.oneclicklca.com) is a third-party construction LCA and EPD software company. Bentley's iTwin Platform integration with One Click LCA allows you to take Quantity Takeoff Reports created using the iTwin Reporting Platform and export them to One Click LCA for convenient Life Cycle Analysis. iTwin Platform enables the incorporation of engineering data created by diverse design tools, which is exported through this integration, allowing you to gain insights into the environmental impacts of your infrastructure projects.    See [iTwin Reporting Platform documentation](https://developer.bentley.com/apis/insights) for guidance on how to create a Report.    An account with One Click LCA is required.    Bentley is not responsible or liable for third-party resources' content, products, services, or practices and does not make any representations regarding their quality, availability or accuracy. Access and use of One Click LCA resources are subject to the terms and conditions set forth by One Click LCA.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level.     Alternatively the user should be an Organization Administrator for the Organization that owns a given Project.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ---
     * @summary Get One Click LCA job status
     * @param {string} jobId The Job Id.
     * @param {string} Authorization OAuth access token with scope &#x60;insights:read&#x60;
     * @param {string} [Accept] Setting to &#x60;application/vnd.bentley.itwin-platform.v1+json&#x60; is recommended.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getOneclicklcaJobStatus(
      jobId: string,
      Authorization: string,
      Accept?: string,
      options?: any,
    ) {
      return OneClickLCAApiFp(configuration).getOneclicklcaJobStatus(
        jobId,
        Authorization,
        Accept,
        options,
      )(fetch, basePath);
    },
  };
};

/**
 * OneClickLCAApi - object-oriented interface
 * @export
 * @class OneClickLCAApi
 * @extends {BaseAPI}
 */
export class OneClickLCAApi extends BaseAPI {
  /**
   * ---    Uploads report data to One Click LCA.    ### One Click LCA    [One Click LCA](https://www.oneclicklca.com) is a third-party construction LCA and EPD software company. Bentley's iTwin Platform integration with One Click LCA allows you to take Quantity Takeoff Reports created using the iTwin Reporting Platform and export them to One Click LCA for convenient Life Cycle Analysis. iTwin Platform enables the incorporation of engineering data created by diverse design tools, which is exported through this integration, allowing you to gain insights into the environmental impacts of your infrastructure projects.    See [iTwin Reporting Platform documentation](https://developer.bentley.com/apis/insights) for guidance on how to create a Report.    An account with One Click LCA is required.    Bentley is not responsible or liable for third-party resources' content, products, services, or practices and does not make any representations regarding their quality, availability or accuracy. Access and use of One Click LCA resources are subject to the terms and conditions set forth by One Click LCA.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:modify`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level.     Alternatively the user should be an Organization Administrator for the Organization that owns a given Project.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ---
   * @summary Create One Click LCA job
   * @param {string} Authorization OAuth access token with scope &#x60;insights:modify&#x60;
   * @param {JobCreate} [body]
   * @param {string} [Accept] Setting to &#x60;application/vnd.bentley.itwin-platform.v1+json&#x60; is recommended.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof OneClickLCAApi
   */
  public createOneclicklcaJob(
    Authorization: string,
    body?: JobCreate,
    Accept?: string,
    options?: any,
  ) {
    return OneClickLCAApiFp(this.configuration).createOneclicklcaJob(
      Authorization,
      body,
      Accept,
      options,
    )(this.fetch, this.basePath);
  }

  /**
   * ---    Queries One Click LCA job status.    ### One Click LCA    [One Click LCA](https://www.oneclicklca.com) is a third-party construction LCA and EPD software company. Bentley's iTwin Platform integration with One Click LCA allows you to take Quantity Takeoff Reports created using the iTwin Reporting Platform and export them to One Click LCA for convenient Life Cycle Analysis. iTwin Platform enables the incorporation of engineering data created by diverse design tools, which is exported through this integration, allowing you to gain insights into the environmental impacts of your infrastructure projects.    See [iTwin Reporting Platform documentation](https://developer.bentley.com/apis/insights) for guidance on how to create a Report.    An account with One Click LCA is required.    Bentley is not responsible or liable for third-party resources' content, products, services, or practices and does not make any representations regarding their quality, availability or accuracy. Access and use of One Click LCA resources are subject to the terms and conditions set forth by One Click LCA.    ### Authentication    Requires `Authorization` header with valid Bearer token for scope `insights:read`.    For more documentation on authorization and how to get access token visit [OAUTH2 Authorization](https://developer.bentley.com/apis/overview/authorization/) page.    ### Authorization    User must have `insights_view` permission(s) assigned at the Project level.     Alternatively the user should be an Organization Administrator for the Organization that owns a given Project.    An Organization Administrator must have at least one of the following roles assigned in User Management: Account Administrator, Co-Administrator, or CONNECT Services Administrator. For more information about User Management please visit our Bentley Communities [Licensing, Cloud, and Web Services](https://communities.bentley.com/communities/other_communities/licensing_cloud_and_web_services/w/wiki/50711/user-management-2-0) wiki page.    ---
   * @summary Get One Click LCA job status
   * @param {string} jobId The Job Id.
   * @param {string} Authorization OAuth access token with scope &#x60;insights:read&#x60;
   * @param {string} [Accept] Setting to &#x60;application/vnd.bentley.itwin-platform.v1+json&#x60; is recommended.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof OneClickLCAApi
   */
  public getOneclicklcaJobStatus(
    jobId: string,
    Authorization: string,
    Accept?: string,
    options?: any,
  ) {
    return OneClickLCAApiFp(this.configuration).getOneclicklcaJobStatus(
      jobId,
      Authorization,
      Accept,
      options,
    )(this.fetch, this.basePath);
  }
}