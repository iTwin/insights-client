/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/**
 * A Common Data Model (CDM) which describes the extracted data, metadata and locations.
 * @export
 * @interface CDM
 */
export interface CDM {
  /**
   * The model name.
   * @type {string}
   * @memberof CDM
   */
  name: string;

  /**
   * The model schema version (currently must be 1.0).
   * @type {string}
   * @memberof CDM
   */
  version: string;

  /**
   * The model entities
   * @type {Array<CDMEntity>}
   * @memberof CDM
   */
  entities: Array<CDMEntity>;
}

/**
 * An entity is a collection of attributes and metadata that defines a concept.
 * @export
 * @interface CDMEntity
 */
export interface CDMEntity {
  /**
   * Type of entity being defined in this model. Always set to LocalEntity.
   * @type {string}
   * @memberof CDMEntity
   */
  $type: string;

  /**
   * The entity name.
   * @type {string}
   * @memberof CDMEntity
   */
  name: string;

  /**
   * The attributes within the entity. Each entity must have at least one.
   * @type {Array<CDMAttribute>}
   * @memberof CDMEntity
   */
  attributes: Array<CDMAttribute>;

  /**
   * The entity physical partitions (data files).
   * @type {Array<CDMPartition>}
   * @memberof CDMEntity
   */
  partitions: Array<CDMPartition>;
}

/**
 * Attributes are the fields within an entity that correspond to data values within the data file.
 * @export
 * @interface CDMAttribute
 */
export interface CDMAttribute {
  /**
   * The attribute name.
   * @type {string}
   * @memberof CDMAttribute
   */
  name: string;

  /**
   * The data type of the attribute.
   * One of 'string', 'int64', 'double',
   * 'dateTime', 'dateTimeOffset', 'decimal', 'boolean', 'GUID', or 'JSON'.
   * @type {AttributeDataType}
   * @memberof CDMAttribute
   */
  dataType: AttributeDataType;

  /**
   * Array of optional model annotations -
   * non-essential key/value pairs that contain contextual information that can be used to store additional context.
   * @type {Array<CDMAnnotation>}
   * @memberof CDMAttribute
   */
  annotations?: Array<CDMAnnotation>;
}

/**
 * Optional, non-essential contextual information (key/value pairs) that can be used to store additional context about a property in the model.
 */
export interface CDMAnnotation {
  /**
   * Name of the annotation
   * @type {string}
   * @memberof CDMAnnotation
   */
  name: string;

  /**
   * Value of the annotation
   * @type {string}
   * @memberof CDMAnnotation
   */
  value?: string;
}

/**
 * The partition array indicates the name and location of the actual data that correspond to the entity definition.
 * Currently all partitions store data in CSV format.
 */
export interface CDMPartition {
  /**
   * The partition name.
   * @type {string}
   * @memberof CDMPartition
   */
  name: string;

  /**
   * The partition location.
   * @type {string}
   * @memberof CDMPartition
   */
  location: string;
}

export enum AttributeDataType {
  String = "string",
  Int64 = "int64",
  Double = "double",
  DateTime = "dateTime",
  DateTimeOffset = "dateTimeOffset",
  Decimal = "decimal",
  Boolean = "boolean",
  Guid = "GUID",
  Json = "JSON"
}
