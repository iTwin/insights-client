/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { Link, PagedResponseLinks } from "../../common/Links";

/**
 * Defines a minimal EC3 configuration. Each configuration holds information required to start an EC3 Job.
 * @export
 * @interface EC3ConfigurationMinimal
 */
export interface EC3ConfigurationMinimal {
  /**
   * The EC3 Configuration Id.
   * @type {string}
   * @memberof EC3ConfigurationMinimal
   */
  id: string;
  /**
   * Name of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ConfigurationMinimal
   */
  displayName: string;
  /**
   * Description of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ConfigurationMinimal
   */
  description?: string;
  /**
   * Date when the EC3 Configuration was created.
   * @type {string}
   * @memberof EC3ConfigurationMinimal
   */
  createdOn: string;
  /**
   * The user who created the EC3 Configuration.
   * @type {string}
   * @memberof EC3ConfigurationMinimal
   */
  createdBy: string;
  /**
   * Date when the EC3 Configuration was last modified.
   * @type {string}
   * @memberof EC3ConfigurationMinimal
   */
  modifiedOn: string;
  /**
   * User who last modified the EC3 Configuration.
   * @type {string}
   * @memberof EC3ConfigurationMinimal
   */
  modifiedBy: string;
  /**
   *
   * @type {EC3ConfigurationLinks}
   * @memberof EC3ConfigurationMinimal
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: EC3ConfigurationLinks;
}

/**
 * Defines an EC3 configuration. Each configuration holds information required to start an EC3 Job.
 * @export
 * @interface EC3Configuration
 */
export interface EC3Configuration extends EC3ConfigurationMinimal {
  /**
 * List of EC3 Configuration Labels.
 * @type {Array<EC3ConfigurationLabel>}
 * @memberof EC3Configuration
 */
  labels: EC3ConfigurationLabel[];
}

/**
 * List of EC3 Configurations.
 * @export
 * @interface EC3ConfigurationCollection
 */
export interface EC3ConfigurationCollection {
  /**
   * List of EC3Configurations.
   * @type {Array<EC3Configuration>}
   * @memberof EC3ConfigurationCollection
   */
  configurations: Array<EC3ConfigurationMinimal>;
  /**
   *
   * @type {PagedResponseLinks}
   * @memberof EC3ConfigurationCollection
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: PagedResponseLinks;
}

/**
 * Properties of the EC3 Configuration to be created. Part of Carbon Calculation EC3 API report schema.
 * @export
 * @interface EC3ReportConfigurationCreate
 */
export interface EC3ReportConfigurationCreate {
  /**
 * Name of the EC3 Configuration.
 * @type {string}
 * @memberof EC3ReportConfigurationCreate
 */
  displayName: string;
  /**
   * Description of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ReportConfigurationCreate
   */
  description?: string;
  /**
* List of EC3 Configuration Labels.
* @type {Array<EC3ReportConfigurationLabel>}
* @memberof EC3ReportConfigurationCreate
*/
  labels: EC3ReportConfigurationLabel[];
  /**
   * Id of the Report.
   * @type {string}
   * @memberof EC3ReportConfigurationCreate
   */
  reportId: string;
}

/**
 * Properties of the EC3 Configuration to be created. Part of Carbon Calculation EC3 API extraction schema.
 * @export
 * @interface EC3ExtractionConfigurationCreate
 */
export interface EC3ExtractionConfigurationCreate {
  /**
 * Name of the EC3 Configuration.
 * @type {string}
 * @memberof EC3ExtractionConfigurationCreate
 */
  displayName: string;
  /**
   * Description of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ExtractionConfigurationCreate
   */
  description?: string;
  /**
 * List of EC3 Configuration Labels.
 * @type {Array<EC3ExtractionConfigurationLabel>}
 * @memberof EC3ExtractionConfigurationCreate
 */
  labels: EC3ExtractionConfigurationLabel[];
  /**
   * Id of the iTwin.
   * @type {string}
   * @memberof EC3ExtractionConfigurationCreate
   */
  iTwinId: string;
  /**
   * Id of the iModel.
   * @type {string}
   * @memberof EC3ExtractionConfigurationCreate
   */
  iModelId: string;
}

/**
 * Contains contextual hyperlinks to related data.
 * @export
 * @interface EC3ConfigurationLinks
 */
export interface EC3ConfigurationLinks {
  /**
     *
     * @type {Link}
     * @memberof EC3ConfigurationLinks
     */
  report?: Link;
  /**
   *
   * @type {Link}
   * @memberof EC3ConfigurationLinks
   */
  iTwin?: Link;
  /**
   *
   * @type {Link}
   * @memberof EC3ConfigurationLinks
   */
  iModel?: Link;
}

/**
 * Container for an EC3Configuration object.
 * @export
 * @interface EC3ConfigurationSingle
 */
export interface EC3ConfigurationSingle {
  /**
   *
   * @type {EC3Configuration}
   * @memberof EC3ConfigurationSingle
   */
  configuration: EC3Configuration;
}

/**
 * Properties of the EC3 Configuration to be updated. Part of Carbon Calculation EC3 API report schema.
 * @export
 * @interface EC3ReportConfigurationUpdate
 */
export interface EC3ReportConfigurationUpdate {
  /**
* Name of the EC3 Configuration.
* @type {string}
* @memberof EC3ReportConfigurationUpdate
*/
  displayName: string;
  /**
   * Description of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ReportConfigurationUpdate
   */
  description: string;
  /**
   * List of EC3 Configuration Labels.
   * @type {Array<EC3ReportConfigurationLabel>}
   * @memberof EC3ConfigurationUpdate
   */
  labels: EC3ReportConfigurationLabel[];
}

/**
 * Properties of the EC3 Configuration to be updated. Part of Carbon Calculation EC3 API extraction schema.
 * @export
 * @interface EC3ExtractionConfigurationUpdate
 */
export interface EC3ExtractionConfigurationUpdate {
  /**
 * Name of the EC3 Configuration.
 * @type {string}
 * @memberof EC3ExtractionConfigurationUpdate
 */
  displayName: string;
  /**
   * Description of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ExtractionConfigurationUpdate
   */
  description: string;
  /**
   * List of EC3 Configuration Labels.
   * @type {Array<EC3ExtractionConfigurationLabel>}
   * @memberof EC3ExtractionConfigurationUpdate
   */
  labels: EC3ExtractionConfigurationLabel[];
}

/**
 * EC3 Configuration Label that contains information about specified elements. Includes properties from both Carbon Calculation EC3 API schemas.
 * @export
 * @interface EC3ConfigurationLabel
 */
export interface EC3ConfigurationLabel {
  /**
   * Name of the Label.
   * @type {string}
   * @memberof EC3ConfigurationLabel
   */
  name: string;
  /**
   * Column containing the element name.
   * @type {string}
   * @memberof EC3ConfigurationLabel
   */
  elementNameColumn: string;
  /**
   * Column containing the element quantity type.
   * @type {string}
   * @memberof EC3ConfigurationLabel
   */
  elementQuantityColumn: string;
  /**
   * List of materials.
   * @type {Array<EC3ConfigurationMaterial>}
   * @memberof EC3ConfigurationLabel
   */
  materials: EC3ConfigurationMaterial[];
  /**
   * Name of the Report Table that contains Label data.
   * @type {string}
   * @memberof EC3ConfigurationLabel
   */
  reportTable?: string;
  /**
   * Id of the mapping, that contains Label data.
    * @type {string}
    * @memberof EC3ConfigurationLabel
    */
  mappingId?: string;
  /**
   * Name of the group, that contains Label data.
   * @type {string}
   * @memberof EC3ConfigurationLabel
   */
  groupName?: string;
}

/**
 * EC3 Configuration Label that contains information about specified elements. Part of Carbon Calculation EC3 API report schema.
 * @export
 * @interface EC3ReportConfigurationLabel
 */
export interface EC3ReportConfigurationLabel {
  /**
   * Name of the Label.
   * @type {string}
   * @memberof EC3ReportConfigurationLabel
   */
  name: string;
  /**
   * Column containing the element name.
   * @type {string}
   * @memberof EC3ReportConfigurationLabel
   */
  elementNameColumn: string;
  /**
   * Column containing the element quantity type.
   * @type {string}
   * @memberof EC3ReportConfigurationLabel
   */
  elementQuantityColumn: string;
  /**
   * List of materials.
   * @type {Array<EC3ConfigurationMaterial>}
   * @memberof EC3ReportConfigurationLabel
   */
  materials: EC3ConfigurationMaterial[];
  /**
   * Name of the Report Table that contains Label data.
   * @type {string}
   * @memberof EC3ReportConfigurationLabel
   */
  reportTable: string;
}

/**
 * EC3 Configuration Label that contains information about specified elements. Part of Carbon Calculation EC3 API extraction schema.
 * @export
 * @interface EC3ExtractionConfigurationLabel
 */
export interface EC3ExtractionConfigurationLabel {
  /**
   * Name of the Label.
   * @type {string}
   * @memberof EC3ExtractionConfigurationLabel
   */
  name: string;
  /**
   * Column containing the element name.
   * @type {string}
   * @memberof EC3ExtractionConfigurationLabel
   */
  elementNameColumn: string;
  /**
   * Column containing the element quantity type.
   * @type {string}
   * @memberof EC3ExtractionConfigurationLabel
   */
  elementQuantityColumn: string;
  /**
   * List of materials.
   * @type {Array<EC3ConfigurationMaterial>}
   * @memberof EC3ExtractionConfigurationLabel
   */
  materials: EC3ConfigurationMaterial[];
  /**
   * Id of the mapping, that contains Label data.
    * @type {string}
    * @memberof EC3ExtractionConfigurationLabel
    */
  mappingId: string;
  /**
   * Name of the group, that contains Label data.
   * @type {string}
   * @memberof EC3ExtractionConfigurationLabel
   */
  groupName: string;
}

/**
 * EC3 Configuration Materials.
 * @export
 * @interface EC3ConfigurationMaterial
 */
export interface EC3ConfigurationMaterial {
  /**
   * Name of the Material.
   * @type {string}
   * @memberof EC3ConfigurationMaterial
   */
  nameColumn: string;
}
