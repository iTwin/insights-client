/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { RequiredError } from "../interfaces/Errors";
import { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { BASE_PATH, OperationsBase } from "../OperationsBase";
import { CalculatedProperty, CalculatedPropertyCollection, CalculatedPropertySingle, CalculatedPropertyCreate, CalculatedPropertyUpdate } from "../interfaces/mappingInterfaces/CalculatedProperties";
import { CustomCalculation, CustomCalculationCollection, CustomCalculationSingle, CustomCalculationCreate, CustomCalculationUpdate } from "../interfaces/mappingInterfaces/CustumCalculations";
import { GroupProperty, GroupPropertyCollection, GroupPropertySingle, GroupPropertyCreate, GroupPropertyUpdate } from "../interfaces/mappingInterfaces/GroupProperties";
import { Group, GroupCollection, GroupCreate, GroupSingle, GroupUpdate } from "../interfaces/mappingInterfaces/Groups";
import { Mapping, MappingCollection, MappingSingle, MappingCreate, MappingUpdate, MappingCopy } from "../interfaces/mappingInterfaces/Mappings";

export interface MappingsClientInterface {
  getMappings(
    accessToken: AccessToken, 
    iModelId: string,
    top?: number
  ): Promise<Mapping[]>,
  getMappingsIterator(
    accessToken: AccessToken, 
    iModelId: string,
    top?: number
  ): EntityListIterator<Mapping>,
  getMapping(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string
  ): Promise<Mapping>,
  createMapping(accessToken: AccessToken, 
    iModelId: string,
    mapping: MappingCreate
  ): Promise<Mapping>,
  updateMapping(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string, 
    mapping: MappingUpdate
  ): Promise<Mapping>,
  deleteMapping(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string
  ): Promise<Response>,
  copyMapping(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    mappingCopy: MappingCopy
  ): Promise<Mapping>,
  getGroups(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    top?: number
  ): Promise<Group[]>,
  getGroupsIterator(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    top?: number
  ): EntityListIterator<Group>,
  getGroup(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Group>,
  createGroup(accessToken: AccessToken, 
    iModelId: string,
    mappingId: string,
    group: GroupCreate
  ): Promise<Group>,
  updateGroup(accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    group: GroupUpdate
  ): Promise<Group>,
  deleteGroup(accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Response>,
  getGroupProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<GroupProperty[]>,
  getGroupPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<GroupProperty>,
  getGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<GroupProperty>,
  createGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    groupProperty: GroupPropertyCreate
  ): Promise<GroupProperty>,
  updateGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    groupProperty: GroupPropertyUpdate
  ): Promise<GroupProperty>,
  deleteGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>,
  getCalculatedProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<CalculatedProperty[]>,
  getCalculatedPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CalculatedProperty>,
  getCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CalculatedProperty>,
  createCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    property: CalculatedPropertyCreate
  ): Promise<CalculatedProperty>,
  updateCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    property: CalculatedPropertyUpdate
  ): Promise<CalculatedProperty>,
  deleteCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>,
  getCustomCalculations(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<CustomCalculation[]>,
  getCustomCalculationsIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CustomCalculation>,
  getCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CustomCalculation>,
  createCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    property: CustomCalculationCreate
  ): Promise<CustomCalculation>,
  updateCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    property: CustomCalculationUpdate
  ): Promise<CustomCalculation>,
  deleteCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response>,
}

export class MappingsClient extends OperationsBase implements MappingsClientInterface{
  /**
   * Gets all Mappings for an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
   public async getMappings(accessToken: AccessToken, iModelId: string, top?: number): Promise<Mapping[]> {
    const mappings: Array<Mapping> = [];
    const mapIterator = this.getMappingsIterator(accessToken, iModelId, top);
    for await(const map of mapIterator) {
      mappings.push(map);
    }
    return mappings;
  }

  /**
   * Gets an async paged iterator of Mappings for an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mappings/
   */
  public getMappingsIterator(accessToken: AccessToken, iModelId: string, top?: number): EntityListIterator<Mapping> {
    let url: string = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings`;
    url += top ?  `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Mapping>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<collection> => {
        let response: MappingCollection = await this.fetch<MappingCollection>(url, requestOptions);
        return {
          values: response.mappings,
          _links: response._links,
        }
    }));
  }

  /**
   * Gets a Mapping for an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-mapping/
   */
  public async getMapping(accessToken: AccessToken, iModelId: string, mappingId: string): Promise<Mapping> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetch<MappingSingle>(url, requestOptions)).mapping;
  }

  /**
   * Creates a Mapping for an iModel.
   * @param {string} iModelId Id of the iModel for which to create a new Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingCreate} mapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-mapping/
   */
  public async createMapping(
    accessToken: AccessToken,
    iModelId: string,
    mapping: MappingCreate
  ): Promise<Mapping> {
    if (!this.isSimpleIdentifier(mapping.mappingName)) {
      throw new RequiredError(
        'mappingName',
        'Required field mappingName of mapping was missing or invalid when calling createMapping.',
      );
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(mapping || {}));
    return (await this.fetch<MappingSingle>(url, requestOptions)).mapping;
  }

  /**
   * Updates a Mapping for an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId Id of the Mapping to be updated.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingUpdate} mapping Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/update-mapping/
   */
  public async updateMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    mapping: MappingUpdate
  ): Promise<Mapping> {
    if (mapping.description == null && mapping.extractionEnabled == null && mapping.mappingName == null) {
      throw new RequiredError(
        'mapping',
        'All properties of mapping were missing when calling updateMapping.',
      );
    }
    if (mapping.mappingName != null && !this.isSimpleIdentifier(mapping.mappingName)) {
      throw new RequiredError(
        'mappingName',
        'Required field mappingName of mapping was invalid when calling createMapping.',
      );
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(mapping || {}));
    return (await this.fetch<MappingSingle>(url, requestOptions)).mapping;;
  }

  /**
   * Deletes a Mapping for an iModel.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId Id of the Mapping to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-mapping/
   */
  public async deleteMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ): Promise<Response> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetch<Response>(url, requestOptions);
  }

  /**
   * Copies a Mapping and all its Groups, GroupProperties, CalculatedProperties, and CustomCalculations to a target iModel.
   * @param {string} iModelId Id of the source Mapping&#x27;s iModel.
   * @param {string} mappingId Id of the source Mapping.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @param {MappingCopy} mappingCopy Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/copy-mapping/
   */
  public async copyMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    mappingCopy: MappingCopy
  ): Promise<Mapping> {
    if (null != mappingCopy.mappingName && !this.isSimpleIdentifier(mappingCopy.mappingName)) {
      throw new RequiredError(
        'mappingName',
        'Field mappingName of mappingCopy was invalid when calling copyMapping.',
      );
    }
    if(this.isNullOrWhitespace(mappingCopy.targetIModelId)) {
      throw new RequiredError(
        'targetiModelId',
        'Required field targetiModelId of mappingCopy was missing when calling copyMapping.',
      );
    }

    const url = `/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/copy`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(mappingCopy || {}));
    return (await this.fetch<MappingSingle>(url, requestOptions)).mapping;
  }

  /**
   * Gets all Groups for a Mapping.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groups/
   */
  public async getGroups(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    top?: number
  ): Promise<Group[]> {
    const groups: Array<Group> = [];
    const groupIterator = this.getGroupsIterator(accessToken, iModelId, mappingId, top);
    for await(const group of groupIterator) {
      groups.push(group);
    }
    return groups;
  }

  /**
   * Gets an async paged iterator of Groups for a Mapping.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groups/
   */
  public getGroupsIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    top?: number
  ): EntityListIterator<Group> {
    let url: string = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Group>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<collection> => {
        let response: GroupCollection = await this.fetch<GroupCollection>(url, requestOptions);
        return {
          values: response.groups,
          _links: response._links,
        }
    }));


  }

  /**
   * Creates a Group for an iModel data source Mapping.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId Id of the Mapping for which to create a new Group.
   * @param {string} AccessToken OAuth access token with scope `insights:modify`
   * @param {GroupCreate} group Request body.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/create-group/
   */
  public async createGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    group: GroupCreate
  ): Promise<Group> {
    if(!this.isSimpleIdentifier(group.groupName)) {
      throw new RequiredError(
        'groupName',
        'Required field mappingName of group was null or undefined when calling createGroup.',
      );
    }
    if(this.isNullOrWhitespace(group.query)) {
      throw new RequiredError(
        'query',
        'Required field query of group was null or undefined when calling createGroup.',
      );
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups`;
    const requestOptions: RequestInit =  this.createRequest("POST", accessToken, JSON.stringify(group || {}));
    return (await this.fetch<GroupSingle>(url, requestOptions)).group;
  }

  /**
   * Gets a Group for a Mapping.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-group/
   */
  public async getGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Group> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetch<GroupSingle>(url, requestOptions)).group;
  }

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
  public async updateGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    group: GroupUpdate
  ): Promise<Group> {
    if(null == group.groupName && null == group.description && null == group.query) {
      throw new RequiredError(
        'group',
        'All properties of group were missing when calling updateGroup.',
      );
    }
    if (null != group.groupName && this.isSimpleIdentifier(group.groupName)) {
      throw new RequiredError(
        'groupName',
        'Field groupName of group was invalid when calling copyGroup.',
      );
    }
    if (null != group.query && this.isNullOrWhitespace(group.query)) {
      throw new RequiredError(
        'query',
        'Required field query of group was null or undefined when calling updateGroup.',
      );
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(group || {}));
    return (await this.fetch<GroupSingle>(url, requestOptions)).group;
  }

  /**
   * Deletes a Group for a Mapping.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId Id of the Group to be deleted.
   * @param {string} accessToken OAuth access token with scope `insights:modify`
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/delete-group/
   */
  public async deleteGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Response> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetch<Response>(url, requestOptions);
  }

  /**
   * Gets all GroupProperties for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperties/
   */
  public async getGroupProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<GroupProperty[]> {
    const properties: Array<GroupProperty> = [];
    const groupPropertyIterator = this.getGroupPropertiesIterator(accessToken, iModelId, mappingId, groupId, top);
    for await(const groupProperty of groupPropertyIterator) {
      properties.push(groupProperty);
    }
    return properties;
  }

  /**
   * Gets an async paged iterator of GroupProperties for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-groupproperties/
   */
  public getGroupPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<GroupProperty> {
    let url: string = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<GroupProperty>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<collection> => {
        let response: GroupPropertyCollection = await this.fetch<GroupPropertyCollection>(url, requestOptions);
        return {
          values: response.properties,
          _links: response._links,
        }
    }));
  }

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
  public async getGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<GroupProperty> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetch<GroupPropertySingle>(url, requestOptions)).property;
  }

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
  public async createGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    groupProperty: GroupPropertyCreate
  ): Promise<GroupProperty> {
    if (!this.isSimpleIdentifier(groupProperty.propertyName)) {
      throw new RequiredError(
        'propertyName',
        'Field propertyName of groupProperty was invalid when calling createGroupProperty.',
      );
    }
    if (groupProperty.dataType == undefined) {
      throw new RequiredError(
        'dataType',
        'Required field dataType of groupProperty was null or undefined when calling createGroupProperty.',
      );
    }
    if (groupProperty.ecProperties == null || groupProperty.ecProperties.length == 0) {
      throw new RequiredError(
        'ecProperties',
        'Required field ecProperties of groupProperty was null or undefined when calling createGroupProperty.',
      );
    }
    for(const i of groupProperty.ecProperties) {
      if (!this.IsValid(i)) {
        throw new RequiredError(
          'ecProperties',
          'Field ecProperties of groupProperty was invalid when calling updateGroupProperty.',
        );
      }
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(groupProperty || {}));
    return (await this.fetch<GroupPropertySingle>(url, requestOptions)).property;
  }

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
  public async updateGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    groupProperty: GroupPropertyUpdate
  ): Promise<GroupProperty> {
    if(!this.isSimpleIdentifier(groupProperty.propertyName)) {
      throw new RequiredError(
        'propertyName',
        'Field propertyName of groupProperty was invalid when calling updateGroupProperty.',
      );
    }
    if(groupProperty.dataType == undefined) {
      throw new RequiredError(
        'dataType',
        'Required field dataType of groupProperty was null or undefined when calling updateGroupProperty.',
      );
    }
    if (groupProperty.ecProperties == null || groupProperty.ecProperties.length == 0) {
      throw new RequiredError(
        'ecProperties',
        'Required field ecProperties of groupProperty was null or undefined when calling updateGroupProperty.',
      );
    }
    for(const i of groupProperty.ecProperties) {
      if (!this.IsValid(i)) {
        throw new RequiredError(
          'ecProperties',
          'Field ecProperties of groupProperty was invalid when calling updateGroupProperty.',
        );
      }
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("PUT", accessToken, JSON.stringify(groupProperty || {}));
    return (await this.fetch<GroupPropertySingle>(url, requestOptions)).property;
  }

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
  public async deleteGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetch<Response>(url, requestOptions);
  }

  /**
   * Gets all CalculatedProperties for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperties/
   */
  public async getCalculatedProperties(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<CalculatedProperty[]> {
    const properties: Array<CalculatedProperty> = [];
    const calculatedPropertyIterator = this.getCalculatedPropertiesIterator(accessToken, iModelId, mappingId, groupId, top);
    for await(const calculatedProperty of calculatedPropertyIterator) {
      properties.push(calculatedProperty);
    }
    return properties;
  }

  /**
   * Gets an async paged iterator of CalculatedProperties for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-calculatedproperties/
   */
  public getCalculatedPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CalculatedProperty> {
    let url: string = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<CalculatedProperty>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<collection> => {
        let response: CalculatedPropertyCollection = await this.fetch<CalculatedPropertyCollection>(url, requestOptions);
        return {
          values: response.properties,
          _links: response._links,
        }
    }));
  }

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
  public async getCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CalculatedProperty> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetch<CalculatedPropertySingle>(url, requestOptions)).property;
  }

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
  public async createCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    property: CalculatedPropertyCreate
  ): Promise<CalculatedProperty> {
    if(!this.isSimpleIdentifier(property.propertyName)) {
      throw new RequiredError(
        'propertyName',
        'Field propertyName of property was invalid when calling createCalculatedProperty.',
      );
    }
    if(property.type == undefined) {
      throw new RequiredError(
        'type',
        'Required field type of property was null or undefined when calling createCalculatedProperty.',
      );
    }
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(property || {}));
    return (await this.fetch<CalculatedPropertySingle>(url, requestOptions)).property;
  }

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
  public async updateCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    property: CalculatedPropertyUpdate
  ): Promise<CalculatedProperty> {
    if(null == property.propertyName && null == property.type) {
      throw new RequiredError(
        'property',
        'All properties of property were missing when calling updateCalculatedProperty.',
      );
    }
    if(null != property.propertyName && !this.isSimpleIdentifier(property.propertyName)) {
      throw new RequiredError(
        'propertyName',
        'Field propertyName of property was invalid when calling updateCalculatedProperty.',
      );
    }
    if(null != property.type && property.type == undefined) {
      throw new RequiredError(
        'type',
        'Required field type of property was null or undefined when calling updateCalculatedProperty.',
        );
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(property || {}));
    return (await this.fetch<CalculatedPropertySingle>(url, requestOptions)).property;
  }

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
  public async deleteCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetch<Response>(url, requestOptions);
  }

  /**
   * Gets all CustomCalculations for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculations/
   */
  public async getCustomCalculations(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): Promise<CustomCalculation[]> {
    const customCalculations: Array<CustomCalculation> = [];
    const customCalculationsIterator = this.getCustomCalculationsIterator(accessToken, iModelId, mappingId, groupId, top);
    for await(const customCalculation of customCalculationsIterator) {
      customCalculations.push(customCalculation);
    }
    return customCalculations;
  }

  /**
   * Gets an async paged iterator of CustomCalculations for a Group.
   * @param {string} iModelId The iModel Id.
   * @param {string} mappingId The Mapping Id.
   * @param {string} groupId The Group Id.
   * @param {string} accessToken OAuth access token with scope `insights:read`
   * @param {number} top the number of entities to pre-load.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/insights/operations/get-customcalculations/
   */
  public getCustomCalculationsIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CustomCalculation> {
    let url: string = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<CustomCalculation>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<collection> => {
        let response: CustomCalculationCollection = await this.fetch<CustomCalculationCollection>(url, requestOptions);
        return {
          values: response.customCalculations,
          _links: response._links,
        }
    }));
  }

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
  public async getCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CustomCalculation> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetch<CustomCalculationSingle>(url, requestOptions)).customCalculation;
  }

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
  public async createCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    property: CustomCalculationCreate
  ): Promise<CustomCalculation> {
    if(!this.isSimpleIdentifier(property.propertyName)) {
      throw new RequiredError(
        'propertyName',
        'Field propertyName of property was invalid when calling createCustomCalculation.',
      );
    }
    if(this.isNullOrWhitespace(property.formula)) {
      throw new RequiredError(
        'formula',
        'Required field formula of property was null or undefined when calling createCustomCalculation.',
      );
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(property || {}));
    return (await this.fetch<CustomCalculationSingle>(url, requestOptions)).customCalculation;
  }

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
  public async updateCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string,
    property: CustomCalculationUpdate
  ): Promise<CustomCalculation> {
    if(null == property.formula && null == property.propertyName && null == property.quantityType) {
      throw new RequiredError(
        'property',
        'All properties of property were missing when calling updateProperty.',
      );
    }
    if(null != property.propertyName && !this.isSimpleIdentifier(property.propertyName)) {
      throw new RequiredError(
        'propertyName',
        'Field propertyName of property was invalid when calling updateCustomCalculation.',
      );
    }
    if(null != property.formula && this.isNullOrWhitespace(property.formula)) {
      throw new RequiredError(
        'formula',
        'Required field formula of property was null or undefined when calling updateCustomCalculation.',
      );
    }

    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(property || {}));
    return (await this.fetch<CustomCalculationSingle>(url, requestOptions)).customCalculation;
  }

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
  public async deleteCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response> {
    const url = `${BASE_PATH}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetch<Response>(url, requestOptions);
  }
}