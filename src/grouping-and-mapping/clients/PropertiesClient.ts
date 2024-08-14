/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { GROUPING_AND_MAPPING_BASE_PATH, OperationsBase } from "../../common/OperationsBase";
import { RequiredError } from "../../common/Errors";
import { IPropertiesClient } from "../interfaces/IPropertiesClient";
import { ECPropertyReference, Property, PropertyContainer, PropertyList, PropertyModify } from "../interfaces/Properties";
import { EntityListIteratorImpl } from "../../common/iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../../common/iterators/IteratorUtil";

export class PropertiesClient extends OperationsBase implements IPropertiesClient {
  private _baseUrl = `${this.basePath}/datasources/imodel-mappings`;

  constructor(basePath?: string) {
    super(basePath ?? GROUPING_AND_MAPPING_BASE_PATH);
  }

  public async createProperty(accessToken: AccessToken, mappingId: string, groupId: string, property: PropertyModify): Promise<Property> {
    if (!this.isSimpleIdentifier(property.propertyName)) {
      throw new RequiredError(
        "propertyName",
        "Field propertyName was invalid.",
      );
    }

    if (property.ecProperties)
      for (const ecProperty of property.ecProperties) {
        if (!this.isValidECProperty(ecProperty)) {
          throw new RequiredError(
            "ecProperties",
            "Field ecProperties was invalid.",
          );
        }
      }

    const url = this.constructUrl(mappingId, groupId);
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(property));
    return (await this.fetchJSON<PropertyContainer>(url, requestOptions)).property;
  }

  public async deleteProperty(accessToken: AccessToken, mappingId: string, groupId: string, propertyId: string): Promise<Response> {
    const url = this.constructUrl(mappingId, groupId, propertyId);
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

  public async getProperty(accessToken: AccessToken, mappingId: string, groupId: string, propertyId: string): Promise<Property> {
    const url = this.constructUrl(mappingId, groupId, propertyId);
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<PropertyContainer>(url, requestOptions)).property;
  }

  public async getProperties(accessToken: AccessToken, mappingId: string, groupId: string, top?: number): Promise<PropertyList> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const url = this.constructUrl(mappingId, groupId, undefined, top);
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    const response = await this.fetchJSON<PropertyList>(url, requestOptions);
    return response;
  }

  public getPropertiesIterator(accessToken: AccessToken, mappingId: string, groupId: string, top?: number): EntityListIteratorImpl<Property> {
    if (!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000].",
      );
    }

    const url = this.constructUrl(mappingId, groupId, undefined, top);
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<Property>(url, async (nextUrl: string): Promise<Collection<Property>> => {
      const response = await this.fetchJSON<PropertyList>(nextUrl, requestOptions);
      return {
        values: response.properties,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _links: response._links,
      };
    }));
  }

  public async updateProperty(accessToken: AccessToken, mappingId: string, groupId: string, propertyId: string, propertyUpdate: PropertyModify): Promise<Property> {
    if (!this.isSimpleIdentifier(propertyUpdate.propertyName)) {
      throw new RequiredError(
        "propertyName",
        "Field propertyName was invalid.",
      );
    }
    if (propertyUpdate.dataType === undefined) {
      throw new RequiredError(
        "dataType",
        "Required field dataType was null or undefined.",
      );
    }

    if (propertyUpdate.ecProperties)
      for (const ecProperty of propertyUpdate.ecProperties) {
        if (!this.isValidECProperty(ecProperty)) {
          throw new RequiredError(
            "ecProperties",
            "Field ecProperties was invalid.",
          );
        }
      }

    const url = this.constructUrl(mappingId, groupId, propertyId);
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

  /**
   * Constructs the endpoint with the provided params
   * @param mappingId Mapping Id.
   * @param groupId Group Id.
   * @param propertyId Optional group Id.
   * @param top Optional top number.
   * @returns url endpoint.
   */
  protected constructUrl(mappingId: string, groupId: string, propertyId?: string, top?: number): string {
    let url = `${this._baseUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties`;

    if (propertyId) {
      url += `/${encodeURIComponent(propertyId)}`;
    } else if (top) {
      url += `?$top=${top}`;
    }
    return url;
  }
}
