/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import isomorphicFetch from 'cross-fetch';
import { ECProperty } from './interfaces/mappingInterfaces/GroupProperties';

export const BASE_PATH = 'https://api.bentley.com/insights/reporting';
const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";

export class OperationsBase {
  /**
   * Creates a request body and headers
   * @param {string} operation string specifying which opperation will be performed
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {string} content request body
   * @memberof OperationsBase
   */
  public createRequest(operation: string, accessToken: string, content?: string): RequestInit {
    const request: any = {
      method: operation,
      headers: {
        Authorization: String(accessToken),
        Accept: String(ACCEPT),
      }
    };
    if (content) {
      request.headers['Content-Type'] = "application/json";
      request.body = content;
    }
    return request;
  }

  /**
   * retrieves specified data
   * @param {string} nextUrl url for the fetch
   * @param {RequestInit} requestOptions information about the fetch
   * @memberof OperationsBase
   */
  public async fetch<T>(nextUrl: string, requestOptions: RequestInit): Promise<T> {
    return isomorphicFetch(
      nextUrl,
      requestOptions
    ).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        if(response.status === 204)
          return response;
        return response.json();
      } else {
        throw response;
      }
    });
  }

  /**
   * checks if given string is a simpleIdentifier
   * @param {string} name
   * @memberof OperationsBase
   */
  public isSimpleIdentifier(name: string): boolean {
    const reg = /^[a-zA-Z_][0-9a-zA-Z _]*$/;
    return (name? true : false) && name.length <= 128 && reg.test(name);
  }
  
  /**
   * checks if given string is null or whitespace
   * @param {string} input
   * @memberof OperationsBase
   */
  public isNullOrWhitespace(input: string) {
    return !input || !input.trim();
  }
  
  /**
   * checks if given ECProperty is valid
   * @param {ECProperty} prop
   * @memberof OperationsBase
   */
  public IsValid (prop: ECProperty): boolean {
    return !this.isNullOrWhitespace(prop.ecSchemaName) &&
    !this.isNullOrWhitespace(prop.ecClassName) &&
    !this.isNullOrWhitespace(prop.ecPropertyName) &&
    undefined != prop.ecPropertyType;
  }
}