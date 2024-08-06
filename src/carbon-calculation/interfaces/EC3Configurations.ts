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
   * @memberof EC3Configuration
   */
  id: string;
  /**
   * Name of the EC3 Configuration.
   * @type {string}
   * @memberof EC3Configuration
   */
  displayName: string;
  /**
   * Description of the EC3 Configuration.
   * @type {string}
   * @memberof EC3Configuration
   */
  description?: string;
  /**
   * Date when the EC3 Configuration was created.
   * @type {string}
   * @memberof EC3Configuration
   */
  createdOn: string;
  /**
   * The user who created the EC3 Configuration.
   * @type {string}
   * @memberof EC3Configuration
   */
  createdBy: string;
  /**
   * Date when the EC3 Configuration was last modified.
   * @type {string}
   * @memberof EC3Configuration
   */
  modifiedOn: string;
  /**
   * User who last modified the EC3 Configuration.
   * @type {string}
   * @memberof EC3Configuration
   */
  modifiedBy: string;
  /**
   *
   * @type {EC3ConfigurationLinks}
   * @memberof EC3Configuration
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
 * Properties of the EC3 Configuration to be created.
 * @export
 * @interface EC3ConfigurationCreate
 */
export interface EC3ReportConfigurationCreate extends EC3ConfigurationCreate {
  /**
   * Id of the Report.
   * @type {string}
   * @memberof EC3ConfigurationCreate
   */
  reportId: string;
}

export interface EC3ExtractionConfigurationCreate extends EC3ConfigurationCreate {
  /**
   * Id of the iTwin.
   * @type {string}
   * @memberof EC3ConfigurationCreate
   */
  iTwinId: string;
  /**
   * Id of the iModel.
   * @type {string}
   * @memberof EC3ConfigurationCreate
   */
  iModelId: string;
}

interface EC3ConfigurationCreate {
  /**
   * Name of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ConfigurationCreate
   */
  displayName: string;
  /**
   * Description of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ConfigurationCreate
   */
  description?: string;
  /**
   * List of EC3 Configuration Labels.
   * @type {Array<EC3ConfigurationLabel>}
   * @memberof EC3ConfigurationCreate
   */
  labels: EC3ConfigurationLabel[];
}

/**
 * Contains contextual hyperlinks to related data.
 * @export
 * @interface EC3ConfigurationLinks
 */
export interface EC3ConfigurationLinks extends EC3ReportConfigurationLinks, EC3ExtractionConfigurationLinks { }

export interface EC3ReportConfigurationLinks {
  /**
   *
   * @type {Link}
   * @memberof EC3ConfigurationLinks
   */
  report?: Link;
}

export interface EC3ExtractionConfigurationLinks {
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
 * Properties of the EC3 Configuration to be updated.
 * @export
 * @interface EC3ConfigurationUpdate
 */
export interface EC3ReportConfigurationUpdate extends EC3ConfigurationUpdate {
  /**
   * List of EC3 Configuration Labels.
   * @type {Array<EC3ConfigurationLabel>}
   * @memberof EC3ConfigurationUpdate
   */
  labels: EC3ReportConfigurationLabel[];
}

export interface EC3ExtractionConfigurationUpdate extends EC3ConfigurationUpdate {
  /**
   * List of EC3 Configuration Labels.
   * @type {Array<EC3ConfigurationLabel>}
   * @memberof EC3ConfigurationUpdate
   */
  labels: EC3ExtractionConfigurationLabel[];
}

interface EC3ConfigurationUpdate {
  /**
   * Name of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ConfigurationUpdate
   */
  displayName: string;
  /**
   * Description of the EC3 Configuration.
   * @type {string}
   * @memberof EC3ConfigurationUpdate
   */
  description: string;
}

/**
 * EC3 Configuration Label that contains information about specified elements.
 * @export
 * @interface EC3ConfigurationLabel
 */
export interface EC3ConfigurationLabel extends EC3ReportConfigurationLabel, EC3ExtractionConfigurationLabel { }

export interface EC3ReportConfigurationLabel {
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
}

export interface EC3ExtractionConfigurationLabel {
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
