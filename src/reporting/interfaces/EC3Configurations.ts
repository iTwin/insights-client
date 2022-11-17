/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { Link, PagedResponseLinks } from "./Links";

/**
 * Defines an EC3 configuration. Each configuration holds information required to start an EC3 Job.
 * @export
 * @interface EC3Configuration
 */
export interface EC3Configuration {
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
   * List of EC3 Configuration Labels.
   * @type {Array<EC3ConfigurationLabel>}
   * @memberof EC3Configuration
   */
  labels: EC3ConfigurationLabel[];
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
   * @memberof Mapping
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: EC3ConfigurationLinks;
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
  configurations: Array<EC3Configuration>;
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
export interface EC3ConfigurationCreate {
  /**
   * Id of the Report.
   * @type {string}
   * @memberof EC3ConfigurationCreate
   */
  reportId: string;
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
export interface EC3ConfigurationLinks {
  /**
   *
   * @type {Link}
   * @memberof EC3ConfigurationLinks
   */
  report: Link;
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
export interface EC3ConfigurationUpdate {
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
  /**
   * List of EC3 Configuration Labels.
   * @type {Array<EC3ConfigurationLabel>}
   * @memberof EC3ConfigurationUpdate
   */
  labels: EC3ConfigurationLabel[];
}

/**
 * EC3 Configuration Label that contains information about specified elements.
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
   * Name of the Report Table that contains Label data.
   * @type {string}
   * @memberof EC3ConfigurationLabel
   */
  reportTable: string;
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
