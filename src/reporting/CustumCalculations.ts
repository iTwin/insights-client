/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { CalculatedPropertyLinks } from "./CalculatedProperties";
import { PagedResponseLinks } from "./Links";

/**
 * Defines a CustomCalculation or 'column' for a Group. It is calculated using the given formula for each element returned by the Group's query.
 * @export
 * @interface CustomCalculation
 */
export interface CustomCalculation {
  /**
   * The CustomCalculation Id.
   * @type {string}
   * @memberof CustomCalculation
   */
  id: string;
  /**
   * Name of the Property (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof CustomCalculation
   */
  propertyName: string;
  /**
   * A mathematical formula which will be evaluated for each element returned by the Group's query.
   * @type {string}
   * @memberof CustomCalculation
   */
  formula: string;
  /**
   * The data type of the CustomCalculation. One of 'Boolean', 'Number', 'String', or 'Undefined'.
   * @type {string}
   * @memberof CustomCalculation
   */
  dataType: string;
  /**
   * The quantity type of the CustomCalculation. One of 'Area', 'Distance', 'Force', 'Mass', 'Monetary', 'Time', 'Volume, or 'Undefined'.
   * @type {string}
   * @memberof CustomCalculation
   */
  quantityType: string;
  /**
   *
   * @type {CalculatedPropertyLinks}
   * @memberof CustomCalculation
   */
  _links: CalculatedPropertyLinks;
}

/**
 * List of CustomCalculations.
 * @export
 * @interface CustomCalculationCollection
 */
export interface CustomCalculationCollection {
  /**
   * List of CustomCalculations.
   * @type {Array<CustomCalculation>}
   * @memberof CustomCalculationCollection
   */
  customCalculations: Array<CustomCalculation>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof CustomCalculationCollection
   */
  _links: PagedResponseLinks;
}

/**
 * Properties of the CustomCalculation to be created.
 * @export
 * @interface CustomCalculationCreate
 */
export interface CustomCalculationCreate {
  /**
   * Name of the Property (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof CustomCalculationCreate
   */
  propertyName: string;
  /**
   * A mathematical formula which will be evaluated for each element returned by the Group's query.
   * @type {string}
   * @memberof CustomCalculationCreate
   */
  formula: string;
  /**
   * The quantity type of the CustomCalculation. One of 'Area', 'Distance', 'Force', 'Mass', 'Monetary', 'Time', 'Volume, or 'Undefined'. Default is 'Undefined'.
   * @type {string}
   * @memberof CustomCalculationCreate
   */
  quantityType: string;
}

/**
 * Container for a CustomCalculation object.
 * @export
 * @interface CustomCalculationSingle
 */
export interface CustomCalculationSingle {
  /**
   *
   * @type {CustomCalculation}
   * @memberof CustomCalculationSingle
   */
  customCalculation: CustomCalculation;
}

/**
 * Properties of the CustomCalculation to be updated.
 * @export
 * @interface CustomCalculationUpdate
 */
export interface CustomCalculationUpdate {
  /**
   * Name of the Property (OData v4 SimpleIdentifier).
   * @type {string}
   * @memberof CustomCalculationUpdate
   */
  propertyName?: string;
  /**
   * A mathematical formula which will be evaluated for each element returned by the Group's query.
   * @type {string}
   * @memberof CustomCalculationUpdate
   */
  formula?: string;
  /**
   * The quantity type of the CustomCalculation. One of 'Area', 'Distance', 'Force', 'Mass', 'Monetary', 'Time', 'Volume, or 'Undefined'.
   * @type {string}
   * @memberof CustomCalculationUpdate
   */
  quantityType?: string;
}
