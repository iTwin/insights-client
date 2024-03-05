/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/**
 * Contains error information.
 * @export
 * @interface ErrorInfo
 */
export interface ErrorInfo {
  /**
   * One of a server-defined set of error codes.
   * @type {string}
   * @memberof ErrorInfo
   */
  code: string;

  /**
   * A human-readable representation of the error.
   * @type {string}
   * @memberof ErrorInfo
   */
  message: string;

  /**
   * The target of the error
   * @type {string}
   * @memberof ErrorInfo
   */
  target?: string;
}

/**
 * Gives details for an error that occurred while handling the request.
 * @export
 * @interface ErrorResponse
 */
export interface ErrorResponse {
  /**
   *
   * @type {Error}
   * @memberof ErrorResponse
   */
  error: ErrorInfo;
}

/**
* Contains error information and an optional array of more specific errors.
* @export
* @interface DetailedError
*/
export interface DetailedError {
  /**
   * One of a server-defined set of error codes.
   * @type {string}
   * @memberof DetailedError
   */
  code: string;

  /**
   * A human-readable representation of the error.
   * @type {string}
   * @memberof DetailedError
   */
  message: string;

  /**
   * The target of the error
   * @type {string}
   * @memberof DetailedError
   */
  target?: string;

  /**
   * Optional array of more specific errors.
   * @type {Array<ErrorInfo>}
   * @memberof DetailedError
   */
  details: Array<ErrorInfo>;
}

/**
 * Gives a detailed error that occurred while handling the request.
 */
export interface DetailedErrorResponse {
  /**
   * Error detailed information.
   * @type {DetailedError}
   * @memberof DetailedErrorResponse
   */
  error: DetailedError;
}

export class RequiredError extends Error {
  constructor(public field: string, msg?: string) {
    super(msg);
  }
}
