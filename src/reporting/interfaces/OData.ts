/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
export interface ODataItem {
  /**
   *
   * @type {string}
   * @memberof ODataItem
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ODataItem
   */
  url: string;
}

/**
 * OData response.
 * @export
 * @interface ODataResponse
 */
export interface ODataResponse {
  /**
   * OData Schema
   * @type {string}
   * @memberof ODataResponse
   */
  "@odata.context": string;
  /**
   *
   * @type {Array<ODataItem>}
   * @memberof ODataResponseStatus
   */
  value: Array<ODataItem>;
}

/**
 * OData Entity response.
 * @export
 * @interface ODataEntityResponse
 */
export interface ODataEntityResponse {
  /**
   * OData Schema
   * @type {string}
   * @memberof ODataResponse
   */
  "@odata.context": string;
  /**
   *
   * @type {Array<[key: string]: string>}
   * @memberof ODataResponseStatus
   */
  value: Array<ODataEntityValue>;
  /**
   *
   * @type {string}
   * @memberof ODataResponse
   */
  "@odata.nextLink"?: string;
}

export interface ODataEntityValue { [key: string]: string | number | boolean | null}

/**
 * OData MetaData table.
 * @export
 * @interface ODataTable
 */
export interface ODataTable {
  /**
   * Table name
   * @type {string}
   * @memberof ODataTable
   */
  name: string;
  /**
   * Table columns
   * @type {string}
   * @memberof ODataTable
   */
  columns: ODataColumn[];
}

/**
 * OData MetaData property.
 * @export
 * @interface ODataColumn
 */
export interface ODataColumn {
  /**
   * Property name
   * @type {string}
   * @memberof ODataColumn
   */
  name: string;
  /**
   * Property type
   * @type {string}
   * @memberof ODataColumn
   */
  type: string;
}
