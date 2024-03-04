/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { OperationsBase } from "../../common/OperationsBase";
import { RequiredError } from "../../reporting/interfaces/Errors";
import { IPropertiesClient } from "../interfaces/IPropertiesClient";
import { ECPropertyReference, Property, PropertyContainer, PropertyList, PropertyModify } from "../interfaces/Properties";

export class PropertiesClient extends OperationsBase implements IPropertiesClient {
  private _propertiesUrl = `${this.groupingAndMappingBasePath}/datasources/imodel-mappings`;

  public async createProperty(accessToken: AccessToken, mappingId: string, groupId: string, property: PropertyModify): Promise<Property> {
    if (!this.isSimpleIdentifier(property.propertyName)) {
      throw new RequiredError(
        "mappingName",
        "Required field mappingName was missing or invalid.",
      );
    }
    const url = `${this._propertiesUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(property));
    return (await this.fetchJSON<PropertyContainer>(url, requestOptions)).property;
  }

  public async deleteProperty(accessToken: AccessToken, mappingId: string, groupId: string, propertyId: string): Promise<Response> {
    const url = `${this._propertiesUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async getProperty(accessToken: string, mappingId: string, groupId: string, propertyId: string): Promise<Property> {
    const url = `${this._propertiesUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<PropertyContainer>(url, requestOptions)).property;
  }

  public async getProperties(accessToken: string, mappingId: string, groupId: string, top?: number | undefined): Promise<PropertyList> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }

    const url = top ? `${this._propertiesUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties?$top=${top}`
      : `${this._propertiesUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    const response =  await this.fetchJSON<PropertyList>(url, requestOptions);
    return response;
  }

  public async updateProperty(accessToken: string, mappingId: string, groupId: string, propertyId: string, propertyUpdate: PropertyModify): Promise<Property> {
    if(!this.isSimpleIdentifier(propertyUpdate.propertyName)) {
      throw new RequiredError(
        "propertyName",
        "Field propertyName was invalid.",
      );
    }
    if(propertyUpdate.dataType === undefined) {
      throw new RequiredError(
        "dataType",
        "Required field dataType was null or undefined.",
      );
    }

    if(propertyUpdate.ecProperties)
      for(const ecProperty of propertyUpdate.ecProperties) {
        if (!this.isValidECProperty(ecProperty)) {
          throw new RequiredError(
            "ecProperties",
            "Field ecProperties was invalid.",
          );
        }
      }

    const url = `${this._propertiesUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${encodeURIComponent(propertyId)}`;
    const requestOptions: RequestInit = this.createRequest("PUT", accessToken, JSON.stringify(propertyUpdate));
    return (await this.fetchJSON<PropertyContainer>(url, requestOptions)).property;
  }

  /**
   * checks if given ECProperty is valid
   * @param {ECPropertyReference} prop
   */
  protected isValidECProperty(prop: ECPropertyReference): boolean {
    return !this.isNullOrWhitespace(prop.ecSchemaName) &&
      !this.isNullOrWhitespace(prop.ecClassName) &&
      !this.isNullOrWhitespace(prop.ecPropertyName);
  }

}
