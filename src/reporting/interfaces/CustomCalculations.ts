/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { CalculatedPropertyLinks } from "./CalculatedProperties";
import type { PagedResponseLinks } from "../../common/Links";
import type { DataType, QuantityType } from "./GroupProperties";

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
   * The data type of the CustomCalculation.
   * @type {string}
   * @memberof CustomCalculation
   */
  dataType: DataType;
  /**
   * The quantity type of the CustomCalculation.
   * @type {string}
   * @memberof CustomCalculation
   */
  quantityType: QuantityType;
  /**
   *
   * @type {CalculatedPropertyLinks}
   * @memberof CustomCalculation
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
   * The quantity type of the CustomCalculation.
   * @type {string}
   * @memberof CustomCalculationCreate
   */
  quantityType: QuantityType;
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
   * The quantity type of the CustomCalculation.
   * @type {string}
   * @memberof CustomCalculationUpdate
   */
  quantityType?: QuantityType;
}
