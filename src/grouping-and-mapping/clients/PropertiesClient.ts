/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { OperationsBase } from "../../common/OperationsBase";
import { RequiredError } from "../../reporting/interfaces/Errors";
import { IPropertiesClient } from "../interfaces/IPropertiesClient";
import { Property, PropertyContainer, PropertyModify } from "../interfaces/Properties";

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
    const url = `${this._propertiesUrl}/${encodeURIComponent(mappingId)}/groups/${encodeURIComponent(groupId)}/properties/${propertyId}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }

}
