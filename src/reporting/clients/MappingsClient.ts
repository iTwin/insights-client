/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { RequiredError } from "../interfaces/Errors";
import { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { OperationsBase } from "../OperationsBase";
import { CalculatedProperty, CalculatedPropertyCollection, CalculatedPropertySingle, CalculatedPropertyCreate, CalculatedPropertyUpdate, CalculatedPropertyType } from "../interfaces/CalculatedProperties";
import { CustomCalculation, CustomCalculationCollection, CustomCalculationSingle, CustomCalculationCreate, CustomCalculationUpdate } from "../interfaces/CustomCalculations";
import { GroupProperty, GroupPropertyCollection, GroupPropertySingle, GroupPropertyCreate, GroupPropertyUpdate, DataType } from "../interfaces/GroupProperties";
import { Group, GroupCollection, GroupCreate, GroupSingle, GroupUpdate } from "../interfaces/Groups";
import { Mapping, MappingCollection, MappingSingle, MappingCreate, MappingUpdate, MappingCopy } from "../interfaces/Mappings";
import { IMappingsClient } from "./IMappingsClient";

export class MappingsClient extends OperationsBase implements IMappingsClient{
   public async getMappings(accessToken: AccessToken, iModelId: string, top?: number): Promise<Mapping[]> {
    const mappings: Array<Mapping> = [];
    const mapIterator = this.getMappingsIterator(accessToken, iModelId, top);
    for await(const map of mapIterator) {
      mappings.push(map);
    }
    return mappings;
  }

  public getMappingsIterator(accessToken: AccessToken, iModelId: string, top?: number): EntityListIterator<Mapping> {
    this.topInRangeValidation(top);
    let url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings`;
    url += top ?  `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Mapping>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<Collection<Mapping>> => {
        const response: MappingCollection = await this.fetchJSON<MappingCollection>(url, requestOptions);
        return {
          values: response.mappings,
          _links: response._links,
        }
    }));
  }

  public async getMapping(accessToken: AccessToken, iModelId: string, mappingId: string): Promise<Mapping> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<MappingSingle>(url, requestOptions)).mapping;
  }

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

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(mapping));
    return (await this.fetchJSON<MappingSingle>(url, requestOptions)).mapping;
  }

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

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(mapping));
    return (await this.fetchJSON<MappingSingle>(url, requestOptions)).mapping;
  }

  public async deleteMapping(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string
  ): Promise<Response> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

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

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/copy`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(mappingCopy));
    return (await this.fetchJSON<MappingSingle>(url, requestOptions)).mapping;
  }

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

  public getGroupsIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    top?: number
  ): EntityListIterator<Group> {
    this.topInRangeValidation(top);
    let url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Group>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<Collection<Group>> => {
        const response: GroupCollection = await this.fetchJSON<GroupCollection>(url, requestOptions);
        return {
          values: response.groups,
          _links: response._links,
        }
    }));
  }

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

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups`;
    const requestOptions: RequestInit =  this.createRequest("POST", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<GroupSingle>(url, requestOptions)).group;
  }

  public async getGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Group> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<GroupSingle>(url, requestOptions)).group;
  }

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
    if (null != group.groupName && !this.isSimpleIdentifier(group.groupName)) {
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

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(group));
    return (await this.fetchJSON<GroupSingle>(url, requestOptions)).group;
  }

  public async deleteGroup(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string
  ): Promise<Response> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

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

  public getGroupPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<GroupProperty> {
    this.topInRangeValidation(top);
    let url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<GroupProperty>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<Collection<GroupProperty>> => {
        const response: GroupPropertyCollection = await this.fetchJSON<GroupPropertyCollection>(url, requestOptions);
        return {
          values: response.properties,
          _links: response._links,
        }
    }));
  }

  public async getGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<GroupProperty> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<GroupPropertySingle>(url, requestOptions)).property;
  }

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
    if (groupProperty.dataType == DataType.Undefined) {
      throw new RequiredError(
        'dataType',
        'Required field dataType of groupProperty was null or undefined when calling createGroupProperty.',
      );
    }
    if (groupProperty.ecProperties == null || groupProperty.ecProperties.length == 0) {
      throw new RequiredError(
        'ecProperties',
        'Required field ecProperties of groupProperty was null or empty when calling createGroupProperty.',
      );
    }
    for(const i of groupProperty.ecProperties) {
      if (!this.isValidECProperty(i)) {
        throw new RequiredError(
          'ecProperties',
          'Field ecProperties of groupProperty was invalid when calling createGroupProperty.',
        );
      }
    }

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(groupProperty));
    return (await this.fetchJSON<GroupPropertySingle>(url, requestOptions)).property;
  }

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
    if(groupProperty.dataType == DataType.Undefined) {
      throw new RequiredError(
        'dataType',
        'Required field dataType of groupProperty was null or undefined when calling updateGroupProperty.',
      );
    }
    if (groupProperty.ecProperties == null || groupProperty.ecProperties.length == 0) {
      throw new RequiredError(
        'ecProperties',
        'Required field ecProperties of groupProperty was null or empty when calling updateGroupProperty.',
      );
    }
    for(const i of groupProperty.ecProperties) {
      if (!this.isValidECProperty(i)) {
        throw new RequiredError(
          'ecProperties',
          'Field ecProperties of groupProperty was invalid when calling updateGroupProperty.',
        );
      }
    }

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("PUT", accessToken, JSON.stringify(groupProperty));
    return (await this.fetchJSON<GroupPropertySingle>(url, requestOptions)).property;
  }

  public async deleteGroupProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

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

  public getCalculatedPropertiesIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CalculatedProperty> {
    this.topInRangeValidation(top);
    let url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<CalculatedProperty>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<Collection<CalculatedProperty>> => {
        const response: CalculatedPropertyCollection = await this.fetchJSON<CalculatedPropertyCollection>(url, requestOptions);
        return {
          values: response.properties,
          _links: response._links,
        }
    }));
  }

  public async getCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CalculatedProperty> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<CalculatedPropertySingle>(url, requestOptions)).property;
  }

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
    if(property.type == CalculatedPropertyType.Undefined) {
      throw new RequiredError(
        'type',
        'Required field type of property was null or undefined when calling createCalculatedProperty.',
      );
    }
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(property));
    return (await this.fetchJSON<CalculatedPropertySingle>(url, requestOptions)).property;
  }

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
    if(null != property.type && property.type == CalculatedPropertyType.Undefined) {
      throw new RequiredError(
        'type',
        'Required field type of property was null or undefined when calling updateCalculatedProperty.',
        );
    }

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(property));
    return (await this.fetchJSON<CalculatedPropertySingle>(url, requestOptions)).property;
  }

  public async deleteCalculatedProperty(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/calculatedProperties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

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

  public getCustomCalculationsIterator(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    top?: number
  ): EntityListIterator<CustomCalculation> {
    this.topInRangeValidation(top);
    let url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations`;
    url += top ? `/?%24top=${top}` : "";
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<CustomCalculation>(
      url,
      this.createRequest("GET", accessToken),
      async (url: string, requestOptions: RequestInit): Promise<Collection<CustomCalculation>> => {
        const response: CustomCalculationCollection = await this.fetchJSON<CustomCalculationCollection>(url, requestOptions);
        return {
          values: response.customCalculations,
          _links: response._links,
        }
    }));
  }

  public async getCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<CustomCalculation> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<CustomCalculationSingle>(url, requestOptions)).customCalculation;
  }

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

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(property));
    return (await this.fetchJSON<CustomCalculationSingle>(url, requestOptions)).customCalculation;
  }

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

    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("PATCH", accessToken, JSON.stringify(property));
    return (await this.fetchJSON<CustomCalculationSingle>(url, requestOptions)).customCalculation;
  }

  public async deleteCustomCalculation(
    accessToken: AccessToken,
    iModelId: string,
    mappingId: string,
    groupId: string,
    propertyId: string
  ): Promise<Response> {
    const url = `${this.basePath}/datasources/imodels/${encodeURIComponent(iModelId)}/mappings/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/customCalculations/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }
}