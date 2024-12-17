/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { fetch } from "cross-fetch";
import { PreferReturn } from "./Common";
import { delay } from "./Utils";

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";
export const REPORTING_BASE_PATH = "https://api.bentley.com/insights/reporting";
export const GROUPING_AND_MAPPING_BASE_PATH = "https://api.bentley.com/grouping-and-mapping";
export const CARBON_CALCULATION_BASE_PATH = "https://api.bentley.com/insights/carbon-calculation";
export const NAMED_GROUPS_BASE_PATH = "https://api.bentley.com/named-groups";
const MAX_ATTEMPTS = 3;

export class OperationsBase {
  constructor(protected readonly basePath: string) { }

  /**
   * Creates a request body and headers
   * @param {string} operation string specifying which operation will be performed
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {string} content request body
   * @memberof OperationsBase
   */
  protected createRequest(operation: string, accessToken: string, content?: string, preferReturn?: PreferReturn): RequestInit {
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
      header["Content-Type"] = "application/json";
      request.body = content;
    }
    if (preferReturn)
      // eslint-disable-next-line @typescript-eslint/dot-notation
      header["Prefer"] = `return=${preferReturn}`;
    request.headers = header;
    return request;
  }

  /**
   * retrieves specified data
   * @param {string} nextUrl url for the fetch
   * @param {RequestInit} requestOptions information about the fetch
   * @memberof OperationsBase
   */
  protected async fetchData(nextUrl: string, requestOptions: RequestInit): Promise<Response> {
    let response: Response | undefined;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        response = await fetch(
          nextUrl,
          requestOptions,
        );
      } catch (error) {
        if ("code" in (error as any)) {
          switch ((error as any).code) {
            case "ETIMEDOUT":
            case "ECONNRESET":
            case "EADDRINUSE":
            case "ECONNREFUSED":
            case "EPIPE":
            case "ENOTFOUND":
            case "ENETUNREACH":
            case "EAI_AGAIN":
            case "ECONNABORTED":
              await delay((2 ** attempt) * 1000);
              continue;
            default: throw error;
          }
        }

        throw error;
      }

      if (undefined === response)
        throw new Error("Unknown error has occurred while executed the request.");

      if (response.status >= 200 && response.status < 300) {
        return response;
      } else if (attempt < MAX_ATTEMPTS) {
        switch (response.status) {
          case 429:
            const retryAfter = response.headers.get("Retry-After");

            if (!retryAfter) {
              await delay((2 ** attempt) * 1000);
            } else {
              const parsedRetryAfter = parseInt(retryAfter, 10);
              const retryAfterSeconds = !Number.isNaN(parsedRetryAfter) ? parsedRetryAfter : (2 ** attempt);
              await delay(retryAfterSeconds * 1000);
            }
            break;
          case 408:
          case 500:
          case 502:
          case 503:
          case 504:
          case 521:
          case 522:
          case 524:
            await delay((2 ** attempt) * 1000);
            break;
          default:
            throw response;
        }
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
  protected async fetchJSON<T>(nextUrl: string, requestOptions: RequestInit): Promise<T> {
    const response = await this.fetchData(nextUrl, requestOptions);
    return response.status === 204 ? response : response.json();
  }

  /**
  * Checks if a given string is within the maximum allowed characters
  * @param {string} input The string to check
  * @param {number} maxLength The maximum allowed length
  * @memberof OperationsBase
  */
  protected isWithinMaxAllowedCharacters(input: string, maxLength: number): boolean {
    return input.length <= maxLength;
  }

  /**
   * checks if given string is a simpleIdentifier
   * @param {string} name
   * @memberof OperationsBase
   */
  protected isSimpleIdentifier(name: string | null | undefined): boolean {
    const reg = /^[\p{L}\p{Nl}_][\p{L}\p{Nl}\p{Nd}\p{Mn}\p{Mc}\p{Pc}\p{Cf}]{0,}$/u;
    return name ? (this.isWithinMaxAllowedCharacters(name, 128) && reg.test(name)) : false;
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
    return top !== undefined ? (top > 0 && top <= 1000) : true;
  }
}
