/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { CalculatedProperty, CalculatedPropertyCreate, CalculatedPropertyUpdate } from "../interfaces/CalculatedProperties";
import type { CustomCalculation, CustomCalculationCreate, CustomCalculationUpdate } from "../interfaces/CustomCalculations";
import type { GroupProperty, GroupPropertyCreate, GroupPropertyUpdate } from "../interfaces/GroupProperties";
import type { Group, GroupCreate, GroupCreateCopy, GroupUpdate } from "../interfaces/Groups";
import type { Mapping, MappingCopy, MappingCreate, MappingUpdate } from "../interfaces/Mappings";
import type { EntityListIterator } from "../../common/iterators/EntityListIterator";

export interface IMappingsClient {
  /**
   * Gets all Mappings for an iModel. This method returns the full list of mappings.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
  getMappings(
    accessToken: AccessToken,
    iModelId: string,
    top?: number
  ): Promise<Mapping[]>;

  /**
   * Gets an async paged iterator of Mappings for an iModel.
   * This method returns an iterator which loads pages of mappings as it is being iterated over.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
  getMappingsIterator(
    accessToken: AccessToken,
    iModelId: string,
    top?: number
  ): EntityListIterator<Mapping>;

  /**
   * Gets a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mapping/
   */
  getMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ): Promise<Mapping>;

  /**
   * Creates a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {MappingCreate} mapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-mapping/
   */
  createMapping(
    accessToken: AccessToken,
    iModelId: string,
    mapping: MappingCreate
  ): Promise<Mapping>;

  /**
   * Updates a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {MappingUpdate} mapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-mapping/
   */
  updateMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    mapping: MappingUpdate
  ): Promise<Mapping>;

  /**
   * Deletes a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-mapping/
   */
  deleteMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ): Promise<Response>;

  /**
   * Copies a Mapping and all its Groups, GroupProperties, CalculatedProperties, and CustomCalculations to a target iModel.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId Id of the source Mapping's iModel.
   * @param {string} mappingId Id of the source Mapping.
   * @param {MappingCopy} mappingCopy Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/copy-mapping/
   */
  copyMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    mappingCopy: MappingCopy
  ): Promise<Mapping>;

  /**
   * Gets all Groups for a Mapping. This method returns the full list of groups.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groups/
   */
  getGroups(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    top?: number
  ): Promise<Group[]>;

  /**
   * Gets an async paged iterator of Groups for a Mapping.
   * This method returns an iterator which loads pages of groups as it is being iterated over.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groups/
   */
  getGroupsIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    top?: number
  ): EntityListIterator<Group>;

  /**
   * Creates a Group for a Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {GroupCreate} group Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-group/
   */
  createGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    group: GroupCreate
  ): Promise<Group>;

  /**
   * Copy a Group for a Mapping.
   * @param {string} accessToken OAuth access token with scope `imodels:modify`.
   * @param {string} mappingId The Mapping Id.
   * @param {GroupCreateCopy} group Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/create-group/
   */
  copyGroup(
    accessToken: AccessToken,
    mappingId: string,
    group: GroupCreateCopy
  ): Promise<Group>;

  /**
   * Gets a Group for a Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-group/
   */
  getGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Group>;

  /**
   * Updates a Group for a Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {GroupUpdate} group Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-group/
   */
  updateGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    group: GroupUpdate
  ): Promise<Group>;

  /**
   * Deletes a Group for a Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-group/
   */
  deleteGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Response>;

  /**
   * Gets all GroupProperties for a Group. This method returns the full list of group properties.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperties/
   */
  getGroupProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<GroupProperty[]>;

  /**
   * Gets an async paged iterator of GroupProperties for a Group.
   * This method returns an iterator which loads pages of group properties as it is being iterated over.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperties/
   */
  getGroupPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<GroupProperty>;

  /**
   * Gets a GroupProperty for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The GroupProperty Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperty/
   */
  getGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<GroupProperty>;

  /**
   * Creates a GroupProperty for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {GroupPropertyCreate} groupProperty Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-groupproperty/
   */
  createGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    groupProperty: GroupPropertyCreate
  ): Promise<GroupProperty>;

  /**
   * Updates a GroupProperty for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The Group Property Id.
   * @param {GroupPropertyUpdate} groupProperty Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-groupproperty/
   */
  updateGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    groupProperty: GroupPropertyUpdate
  ): Promise<GroupProperty>;

  /**
   * Deletes a GroupProperty from a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The Group Property Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-groupproperty/
   */
  deleteGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>;

  /**
   * Gets all CalculatedProperties for a Group. This method returns the full list of calculated properties.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperties/
   */
  getCalculatedProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<CalculatedProperty[]>;

  /**
   * Gets an async paged iterator of CalculatedProperties for a Group.
   * This method returns an iterator which loads pages of calculated properties as it is being iterated over.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperties/
   */
  getCalculatedPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CalculatedProperty>;

  /**
   * Gets a CalculatedProperty for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The CalculatedProperty Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperty/
   */
  getCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CalculatedProperty>;

  /**
   * Creates a CalculatedProperty for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {CalculatedPropertyCreate} property Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-calculatedproperty/
   */
  createCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    property: CalculatedPropertyCreate
  ): Promise<CalculatedProperty>;

  /**
   * Updates a CalculatedProperty for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The Calculated Property Id.
   * @param {CalculatedPropertyUpdate} property Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-calculatedproperty/
   */
  updateCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    property: CalculatedPropertyUpdate
  ): Promise<CalculatedProperty>;

  /**
   * Deletes a CalculatedProperty from a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The Calculated Property Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-calculatedproperty/
   */
  deleteCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>;

  /**
   * Gets all CustomCalculations for a Group. This method returns the full list of custom calculations.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculations/
   */
  getCustomCalculations(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<CustomCalculation[]>;

  /**
   * Gets an async paged iterator of CustomCalculations for a Group.
   * This method returns an iterator which loads pages of custom calculations as it is being iterated over.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {number} top The number of entities to load per page.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculations/
   */
  getCustomCalculationsIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CustomCalculation>;

  /**
   * Gets a CustomCalculation for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:read`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The CustomCalculation Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculation/
   */
  getCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CustomCalculation>;

  /**
   * Creates a CustomCalculation for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {CustomCalculationCreate} property Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-customcalculation/
   */
  createCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    property: CustomCalculationCreate
  ): Promise<CustomCalculation>;

  /**
   * Updates a CustomCalculation for a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The Custom Calculation Id.
   * @param {CustomCalculationUpdate} property Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-customcalculation/
   */
  updateCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    property: CustomCalculationUpdate
  ): Promise<CustomCalculation>;

  /**
   * Deletes a CustomCalculation from a Group.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The Custom Calculation Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-customcalculation/
   */
  deleteCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>;
}
