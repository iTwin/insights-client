/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import type { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Reference to an ECProperty in an iModel.
 * @export
 * @interface ECPropertyReference
 */
export interface ECPropertyReference {
  /**
    * A case-insensitive name of the ECSchema where the referenced property exists.
    * A wildcard * can be used to search for a property in any ECSchema.
    * @type {string}
    * @memberof ECPropertyReference
    */
  ecSchemaName: string;

  /**
    * A case insensitive name of the ECClass where the referenced property exists.
    * A wildcard * can be used to search for a property in any ECClass.
    * @type {string}
    * @memberof ECPropertyReference
    */
  ecClassName: string;

  /**
    * The name of a referenced property or a path to the referenced property.
    * Path is defined as a list of property names joined by a period (.).
    * Names in the path can be ECProperty names or json property names in an ECProperty that contains a json value
    * @type {string}
    * @memberof ECPropertyReference
    */
  ecPropertyName: string;
}

/**
 * Hyperlinks to related data which complements this entity.
 * @export
 * @interface PropertyLinks
 */
export interface PropertyLinks {
  /**
    * Link to retrieve the related iModel.
    * @type {Link}
    * @memberof PropertyLinks
    */
  iModel: Link;

  /**
    * Link to retrieve the related mapping.
    * @type {Link}
    * @memberof PropertyLinks
    */
  mapping: Link;

  /**
    * Link to retrieve the related group.
    * @type {Link}
    * @memberof PropertyLinks
    */
  group: Link;
}

/**
 * Properties  of a group property configuration
 * @exports
 * @interface Property
 */
export interface Property {
  /**
    * The property Id.
    * @type {string}
    * @memberof Property
    */
  id: string;

  /**
    * Name of the property (OData v4 SimpleIdentifier).
    * @type {string}
    * @memberof Property
    */
  propertyName: string;

  /**
    * The data type of the property. One of 'Boolean', 'Double', 'Integer', or 'String'.
    * @type {string}
    * @memberof Property
    */
  dataType: DataType;

  /**
    * The quantity type of the property. One of 'Area', 'Distance', 'Force', 'Mass', 'Monetary', 'Time', or 'Volume'.
    * @type {string}
    * @memberof Property
    */
  quantityType?: QuantityType ;

  /**
   * A prioritized list of ECProperty references for mapping values
   * of ECProperties from an iModel to this group property.
   * Entries closer to the start of the array have higher priority.
   */
  ecProperties?: ECPropertyReference[];

  /**
    * Type of the calculation.
    * @type {string}
    * @memberof Property
    */
  calculatedPropertyType?: CalculatedPropertyType;

  /**
    * A mathematical formula which will be evaluated for each row returned by the group's query.
    * @type {string}
    * @memberof Property
    */
  formula?: string;

  /**
   * Contains contextual hyperlinks to related data.
   * @type {PropertyLinks}
   * @memberof Property
   */
  _links: PropertyLinks;

}

/**
 * Properties of a group property configuration for update or create operations.
 * @export
 * @interface PropertyModify
 */
export interface PropertyModify {
  /**
    * Name of the property (OData v4 SimpleIdentifier).
    * @type {string}
    * @memberof PropertyModify
    */
  propertyName: string;

  /**
    * The data type of the property. One of 'Boolean', 'Double', 'Integer', or 'String'.
    * @type {string}
    * @memberof PropertyModify
    */
  dataType: DataType;

  /**
    * The quantity type of the property. One of 'Area', 'Distance', 'Force', 'Mass', 'Monetary', 'Time', or 'Volume'.
    * @type {string}
    * @memberof PropertyModify
    */
  quantityType?: QuantityType;

  /**
   * A prioritized list of ECProperty references for mapping values
   * of ECProperties from an iModel to this group property.
   * Entries closer to the start of the array have higher priority.
   */
  ecProperties?: ECPropertyReference[];

  /**
    * Type of the calculation.
    * @type {string}
    * @memberof PropertyModify
    */
  calculatedPropertyType?: CalculatedPropertyType;

  /**
    * A mathematical formula which will be evaluated for each row returned by the group's query.
    * @type {string}
    * @memberof PropertyModify
    */
  formula?: string;
}

/**
 * Container for a property object.
 * @exports
 * @interface PropertyContainer
 */
export interface PropertyContainer{
  /**
    * Property configuration.
    * @type {Property}
    * @memberof PropertyContainer
    */
  property: Property;
}

/**
 * List of properties
 * @exports
 * @interface PropertyList
 */
export interface PropertyList {
  /**
   * List of properties
   * @type {Property[]}
   * @memberof PropertyList
   */
  properties: Property[];

  /**
   * Contains the hyperlinks to the current and next pages of results.
   * @type {PagedResponseLinks}
   * @memberof PagedResponseLinks
   */
  _links: PagedResponseLinks;
}

/**
* The data type of a Property.
* @export
* @enum DataType
*/
export enum DataType {
  // eslint-disable-next-line id-blacklist
  Undefined = "Undefined",
  Boolean = "Boolean",
  Integer = "Integer",
  Double = "Double",
  String = "String"
}

/**
* The quantity type of a Property.
* @export
* @enum QuantityType
*/
export enum QuantityType {
  // eslint-disable-next-line id-blacklist
  Undefined = "Undefined",
  Area = "Area",
  Distance = "Distance",
  Force = "Force",
  Mass = "Mass",
  Monetary = "Monetary",
  Time = "Time",
  Volume = "Volume"
}

export enum CalculatedPropertyType {
  // eslint-disable-next-line id-blacklist
  Undefined = "Undefined",
  Volume = "Volume",
  Length = "Length",
  Area = "Area",
  BoundingBoxLongestEdgeLength = "BoundingBoxLongestEdgeLength",
  BoundingBoxIntermediateEdgeLength = "BoundingBoxIntermediateEdgeLength",
  BoundingBoxShortestEdgeLength = "BoundingBoxShortestEdgeLength",
  BoundingBoxDiagonalLength = "BoundingBoxDiagonalLength",
  BoundingBoxLongestFaceDiagonalLength = "BoundingBoxLongestFaceDiagonalLength",
  BoundingBoxIntermediateFaceDiagonalLength = "BoundingBoxIntermediateFaceDiagonalLength",
  BoundingBoxShortestFaceDiagonalLength = "BoundingBoxShortestFaceDiagonalLength"
}
