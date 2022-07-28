/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { CalculatedProperty, CalculatedPropertyCreate, CalculatedPropertyUpdate } from "../interfaces/CalculatedProperties";
import { CustomCalculation, CustomCalculationCreate, CustomCalculationUpdate } from "../interfaces/CustomCalculations";
import { GroupProperty, GroupPropertyCreate, GroupPropertyUpdate } from "../interfaces/GroupProperties";
import { Group, GroupCreate, GroupUpdate } from "../interfaces/Groups";
import { Mapping, MappingCreate, MappingUpdate, MappingCopy } from "../interfaces/Mappings";
import { EntityListIterator } from "../iterators/EntityListIterator";

export interface IMappingsClient {
  /**
   * Gets all Mappings for an iModel. This method returns the full list of mappings.
   * @param {string} iModelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
  getMappings(
    accessToken: AccessToken, 
    iModelId: string,
    top?: number
  ): Promise<Mapping[]>,
  
  /**
   * Gets an async paged iterator of Mappings for an iModel.
   * This method returns an iterator which loads pages of mappings as it is being iterated over.
   * @param {string} iModelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
  getMappingsIterator(
    accessToken: AccessToken, 
    iModelId: string,
    top?: number
  ): EntityListIterator<Mapping>,
  
  /**
   * Gets a Mapping for an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mapping/
   */
  getMapping(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string
  ): Promise<Mapping>,
  
  /**
   * Creates a Mapping for an iModel.
   * @param {string} iModelId Id of the iModel for which to create a new Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingCreate} mapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-mapping/
   */
  createMapping(accessToken: AccessToken, 
    iModelId: string,
    mapping: MappingCreate
  ): Promise<Mapping>,
  
  /**
   * Updates a Mapping for an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId Id of the Mapping to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingUpdate} mapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-mapping/
   */
  updateMapping(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string, 
    mapping: MappingUpdate
  ): Promise<Mapping>,
  
  /**
   * Deletes a Mapping for an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId Id of the Mapping to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-mapping/
   */
  deleteMapping(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string
  ): Promise<Response>,
  
  /**
   * Copies a Mapping and all its Groups, GroupProperties, CalculatedProperties, and CustomCalculations to a target iModel.
   * @param {string} iModelId Id of the source Mapping&#x27;s iModel.
   * @param {string} mappingId Id of the source Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingCopy} mappingCopy Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/copy-mapping/
   */
  copyMapping(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    mappingCopy: MappingCopy
  ): Promise<Mapping>,
  
  /**
   * Gets all Groups for a Mapping. This method returns the full list of groups.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groups/
   */
  getGroups(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    top?: number
  ): Promise<Group[]>,
  
  /**
   * Gets an async paged iterator of Groups for a Mapping.
   * This method returns an iterator which loads pages of groups as it is being iterated over.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groups/
   */
  getGroupsIterator(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    top?: number
  ): EntityListIterator<Group>,
  
  /**
   * Creates a Group for an iModel data source Mapping.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId Id of the Mapping for which to create a new Group.
   * @param {string} AccessToken OAuth access token with scope `insights:modify`
   * @param {GroupCreate} group Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-group/
   */
   createGroup(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    group: GroupCreate
  ): Promise<Group>,
  
  /**
   * Gets a Group for a Mapping.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-group/
   */
   getGroup(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Group>,
  
  /**
   * Updates a Group for a Mapping.
   * @param {string} iModelId Globally Unique Identifier of the target iModel.
   * @param {string} mappingId Globally Unique Identifier of the target Mapping.
   * @param {string} groupId Id of the Group to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {GroupUpdate} group Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-group/
   */
  updateGroup(accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    group: GroupUpdate
  ): Promise<Group>,
  
  /**
   * Deletes a Group for a Mapping.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-group/
   */
  deleteGroup(accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Response>,
  
  /**
   * Gets all GroupProperties for a Group. This method returns the full list of group properties.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperties/
   */
  getGroupProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<GroupProperty[]>,
  
  /**
   * Gets an async paged iterator of GroupProperties for a Group.
   * This method returns an iterator which loads pages of group properties as it is being iterated over.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperties/
   */
  getGroupPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<GroupProperty>,
  
  /**
   * Gets a GroupProperty for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The GroupProperty Id.
   * @param {string} accessToken access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperty/
   */
  getGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<GroupProperty>,
  
  /**
   * Creates a GroupProperty for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new GroupProperty.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
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
  ): Promise<GroupProperty>,
  
  /**
   * Updates a GroupProperty for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the GroupProperty to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
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
  ): Promise<GroupProperty>,
  
  /**
   * Deletes a GroupProperty from a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the GroupProperty to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-groupproperty/
   */
  deleteGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>,
  
  /**
   * Gets all CalculatedProperties for a Group. This method returns the full list of calculated properties.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperties/
   */
  getCalculatedProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<CalculatedProperty[]>,
  
  /**
   * Gets an async paged iterator of CalculatedProperties for a Group.
   * This method returns an iterator which loads pages of calculated properties as it is being iterated over.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperties/
   */
  getCalculatedPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CalculatedProperty>,
  
  /**
   * Gets a CalculatedProperty for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The CalculatedProperty Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperty/
   */
  getCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CalculatedProperty>,
  
  /**
   * Creates a CalculatedProperty for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new CalculatedProperty.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
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
  ): Promise<CalculatedProperty>,
  
  /**
   * Updates a CalculatedProperty for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the CalculatedProperty to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
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
  ): Promise<CalculatedProperty>,
  
  /**
   * Deletes a CalculatedProperty from a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId Id of the CalculatedProperty to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-calculatedproperty/
   */
  deleteCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>,
  
  /**
   * Gets all CustomCalculations for a Group. This method returns the full list of custom calculations.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculations/
   */
  getCustomCalculations(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<CustomCalculation[]>,
  
  /**
   * Gets an async paged iterator of CustomCalculations for a Group.
   * This method returns an iterator which loads pages of custom calculations as it is being iterated over.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculations/
   */
  getCustomCalculationsIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CustomCalculation>,
  
  /**
   * Gets a CustomCalculation for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} propertyId The CustomCalculation Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculation/
   */
  getCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CustomCalculation>,
  
  /**
   * Creates a CustomCalculation for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group for which to create a new CustomCalculation.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
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
  ): Promise<CustomCalculation>,
  
  /**
   * Updates a CustomCalculation for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} customCalculationId Id of the CustomCalculation to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
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
  ): Promise<CustomCalculation>,
  
  /**
   * Deletes a CustomCalculation from a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} customCalculationId Id of the CustomCalculation to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-customcalculation/
   */
  deleteCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>
}