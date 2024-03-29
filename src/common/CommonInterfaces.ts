/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/**
 * Values for return preference used in `Prefer` header. The header value is formed by joining
 * `return=` and the enum value.
 */
export enum PreferReturn {
  /** Instructs the server to return minimal entity representation. */
  Minimal = "minimal",
  /** Instructs the server to return full entity representation. */
  Representation = "representation"
}
