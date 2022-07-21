/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { PagedResponseLinks } from "../Links";

/**
 * Defines a target ECProperty for a Group. This is used to determine what properties will be read from the query response of a Group.
 * @export
 * @interface ECProperty
 */
export interface ECProperty {
  /**
   * The target ECSchema.
   * @type {string}
   * @memberof ECProperty
   */
  ecSchemaName: string;
  /**
   * The target ECClass.
   * @type {string}
   * @memberof ECProperty
   */
  ecClassName: string;
  /**
   * The target ECProperty.
   * @type {string}
   * @memberof ECProperty
   */
  ecPropertyName: string;
  /**
   * The type of the target ECProperty.
   * @type {string}
   * @memberof ECProperty
   */
  ecPropertyType: DataType;
}

/**
 * Defines a one-to-many property mapping to a set of ECProperties for a Group - to be used when a Group query will return data from multiple ECClasses.
 * @export
 * @interface GroupProperty
 */
export interface GroupProperty {
  /**
   * The GroupProperty Id.
   * @type {string}
   * @memberof GroupProperty
   */
  id: string;
  /**
   * Name of the Property (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof GroupProperty
   */
  propertyName: string;
  /**
   * The data type of the GroupProperty. One of 'Boolean', 'Number', 'String', or 'Undefined'.
   * @type {string}
   * @memberof GroupProperty
   */
  dataType: DataType;
  /**
   * The quantity type of the GroupProperty. One of 'Area', 'Distance', 'Force', 'Mass', 'Monetary', 'Time', 'Volume, or 'Undefined'.
   * @type {string}
   * @memberof GroupProperty
   */
  quantityType: QuantityType;
  /**
   * List of ECProperties that map to this GroupProperty.
   * @type {Array<ECProperty>}
   * @memberof GroupProperty
   */
  ecProperties: Array<ECProperty>;
}

/**
* List of GroupProperties.
* @export
* @interface GroupPropertyCollection
*/
export interface GroupPropertyCollection {
  /**
   * List of GroupProperties.
   * @type {Array<GroupProperty>}
   * @memberof GroupPropertyCollection
   */
  properties: Array<GroupProperty>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof GroupPropertyCollection
   */
  _links: PagedResponseLinks;
}

/**
* Properties of the GroupProperty to be created.
* @export
* @interface GroupPropertyCreate
*/
export interface GroupPropertyCreate {
  /**
   * Name of the Property (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof GroupPropertyCreate
   */
  propertyName: string;
  /**
   * The data type of the GroupProperty. One of 'Boolean', 'Number', 'String', or 'Undefined'.
   * @type {string}
   * @memberof GroupPropertyCreate
   */
  dataType: DataType;
  /**
   * The quantity type of the GroupProperty. One of 'Area', 'Distance', 'Force', 'Mass', 'Monetary', 'Time', 'Volume, or 'Undefined'.
   * @type {string}
   * @memberof GroupPropertyCreate
   */
  quantityType: QuantityType;
  /**
   * List of ECProperties that map to this GroupProperty.
   * @type {Array<ECProperty>}
   * @memberof GroupPropertyCreate
   */
  ecProperties: Array<ECProperty>;
}

/**
* Container for a GroupProperty object.
* @export
* @interface GroupPropertySingle
*/
export interface GroupPropertySingle {
  /**
   *
   * @type {GroupProperty}
   * @memberof GroupPropertySingle
   */
  property: GroupProperty;
}

/**
* Properties of the GroupProperty to be updated.
* @export
* @interface GroupPropertyUpdate
*/
export interface GroupPropertyUpdate {
  /**
   * Name of the Property (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof GroupPropertyUpdate
   */
  propertyName: string;
  /**
   * The data type of the GroupProperty. One of 'Boolean', 'Number', 'String', or 'Undefined'.
   * @type {string}
   * @memberof GroupPropertyUpdate
   */
  dataType: DataType;
  /**
   * The quantity type of the GroupProperty. One of 'Area', 'Distance', 'Force', 'Mass', 'Monetary', 'Time', 'Volume, or 'Undefined'.
   * @type {string}
   * @memberof GroupPropertyUpdate
   */
  quantityType: QuantityType;
  /**
   * List of ECProperties that map to this GroupProperty.
   * @type {Array<ECProperty>}
   * @memberof GroupPropertyUpdate
   */
  ecProperties: Array<ECProperty>;
}

/**
* The data type of a GroupProperty
* @export
* @enum DataType
*/
export enum DataType {
  Undefined = "Undefined",
  Boolean = "Boolean",
  Number = "Number", // Deprecated - treated as Double by the extractor.
  Integer = "Integer",
  Double = "Double",
  String = "String"
}

/**
* The type of data
* @export
* @enum QuantityType
*/
export enum QuantityType{
  Undefined = "Undefined",
  Area = "Area",
  Distance = "Distance",
  Force = "Force",
  Mass = "Mass",
  Monetary = "Monetary",
  Time = "Time",
  Volume = "Volume"
}
