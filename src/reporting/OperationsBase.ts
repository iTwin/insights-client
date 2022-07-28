/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import isomorphicFetch from 'cross-fetch';
import { DataType, ECProperty } from './interfaces/GroupProperties';

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";
export const REPORTING_BASE_PATH = "https://api.bentley.com/insights/reporting";

export class OperationsBase {
  protected readonly fetch = isomorphicFetch;
  protected readonly basePath;

  constructor(basePath?: string) {
    this.basePath = basePath ?? REPORTING_BASE_PATH;
  }

  /**
   * Creates a request body and headers
   * @param {string} operation string specifying which opperation will be performed
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {string} content request body
   * @memberof OperationsBase
   */
  public createRequest(operation: string, accessToken: string, content?: string): RequestInit {
    const request: RequestInit = {
      method: operation,
    };
    const header: HeadersInit = {
      Authorization: accessToken,
      Accept: ACCEPT,
    }
    if (content) {
      header['Content-Type'] = "application/json",
      request.body = content;
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
  public async fetchData(nextUrl: string, requestOptions: RequestInit): Promise<Response> {
    return this.fetch(
      nextUrl,
      requestOptions
    ).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        throw response;
      }
    });
  }

  /**
   * retrieves specified data
   * @param {string} nextUrl url for the fetch
   * @param {RequestInit} requestOptions information about the fetch
   * @memberof OperationsBase
   */
   public async fetchJSON<T>(nextUrl: string, requestOptions: RequestInit): Promise<T> {
    const response = await this.fetchData(nextUrl, requestOptions);
    return response.status === 204 ? response : response.json();
  }

  /**
   * checks if given string is a simpleIdentifier
   * @param {string} name
   * @memberof OperationsBase
   */
  public isSimpleIdentifier(name: string | null | undefined): boolean {
    const reg = /^[\p{L}\p{Nl}_][\p{L}\p{Nl}\p{Nd}\p{Mn}\p{Mc}\p{Pc}\p{Cf}]{0,}$/u;
    return name ? (name.length <= 128 && reg.test(name)) : false;
  }
  
  /**
   * checks if given string is null or whitespace
   * @param {string} input
   * @memberof OperationsBase
   */
  public isNullOrWhitespace(input: string | null | undefined) {
    return !input || !input.trim();
  }
  
  /**
   * checks if given ECProperty is valid
   * @param {ECProperty} prop
   * @memberof OperationsBase
   */
  public isValidECProperty (prop: ECProperty): boolean {
    return !this.isNullOrWhitespace(prop.ecSchemaName) &&
      !this.isNullOrWhitespace(prop.ecClassName) &&
      !this.isNullOrWhitespace(prop.ecPropertyName) &&
      DataType.Undefined != prop.ecPropertyType;
  }

  /**
   * checks if given number is in a range
   * @param {number | undefined} top
   * @memberof OperationsBase
   */
  public topIsValid(top: number | undefined) {
    return top !== undefined ? (top > 0 && top <= 1000) : true;
  }
}