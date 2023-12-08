/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import isomorphicFetch from "cross-fetch";

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";
export const REPORTING_BASE_PATH = "https://api.bentley.com/insights/reporting";
export const GROUPING_AND_MAPPING_BASE_PATH =
  "https://api.bentley.com/grouping-and-mapping";
export const CARBON_CALCULATION_BASE_PATH =
  "https://api.bentley.com/insights/carbon-calculation";
const MAX_ATTEMPTS = 3;

export class OperationsBase {
  protected readonly fetch = isomorphicFetch;
  protected readonly basePath;
  protected readonly groupingAndMappingBasePath;

  constructor(basePath?: string, groupingAndMappingBasePath?: string) {
    this.basePath = basePath ?? REPORTING_BASE_PATH;
    this.groupingAndMappingBasePath =
      groupingAndMappingBasePath ?? GROUPING_AND_MAPPING_BASE_PATH;
  }

  /**
   * Creates a request body and headers
   * @param {string} operation string specifying which opperation will be performed
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {string} content request body
   * @memberof OperationsBase
   */
  protected createRequest(
    operation: string,
    accessToken: string,
    content?: string
  ): RequestInit {
    const request: RequestInit = {
      method: operation,
    };
    const header: HeadersInit = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: accessToken,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: ACCEPT,
    };
    if (content) {
      (header["Content-Type"] = "application/json"), (request.body = content);
    }
    request.headers = header;
    return request;
  }

  /**
   * retrieves specified data
   * @param {string} nextUrl url for the fetch
   * @param {RequestInit} requestOptions information about the fetch
   * @memberof OperationsBase
   */
  protected async fetchData(
    nextUrl: string,
    requestOptions: RequestInit
  ): Promise<Response> {
    let response: Response | undefined;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      response = await this.fetch(nextUrl, requestOptions);

      if (response.status >= 200 && response.status < 300) {
        return response;
      } else if (attempt < MAX_ATTEMPTS && 429 === response.status) {
        const retryAfter = response.headers.get("Retry-After");
        if (null === retryAfter) {
          throw response;
        }

        const retryAfterSeconds = parseInt(retryAfter, 10);

        await new Promise((resolve) =>
          setTimeout(resolve, retryAfterSeconds * 1000)
        );
      } else {
        throw response;
      }
    }

    // Should be unreachable, but lint has a hard time understanding that.
    throw response;
  }

  /**
   * retrieves specified data
   * @param {string} nextUrl url for the fetch
   * @param {RequestInit} requestOptions information about the fetch
   * @memberof OperationsBase
   */
  protected async fetchJSON<T>(
    nextUrl: string,
    requestOptions: RequestInit
  ): Promise<T> {
    const response = await this.fetchData(nextUrl, requestOptions);
    return response.status === 204 ? response : response.json();
  }

  /**
   * checks if given string is a simpleIdentifier
   * @param {string} name
   * @memberof OperationsBase
   */
  protected isSimpleIdentifier(name: string | null | undefined): boolean {
    const reg =
      /^[\p{L}\p{Nl}_][\p{L}\p{Nl}\p{Nd}\p{Mn}\p{Mc}\p{Pc}\p{Cf}]{0,}$/u;
    return name ? name.length <= 128 && reg.test(name) : false;
  }

  /**
   * checks if given string is null or whitespace
   * @param {string} input
   * @memberof OperationsBase
   */
  protected isNullOrWhitespace(input: string | null | undefined): boolean {
    return !input || !input.trim();
  }

  /**
   * checks if given number is in a range
   * @param {number | undefined} top
   * @memberof OperationsBase
   */
  protected topIsValid(top: number | undefined): boolean {
    return top !== undefined ? top > 0 && top <= 1000 : true;
  }
}
