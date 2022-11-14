/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { EC3Configuration, EC3ConfigurationCollection, EC3ConfigurationCreate, EC3ConfigurationSingle, EC3ConfigurationUpdate } from "../interfaces/EC3Configurations";
import { RequiredError } from "../interfaces/Errors";
import { EntityListIterator } from "../iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../iterators/EntityListIteratorImpl";
import { Collection, getEntityCollectionPage } from "../iterators/IteratorUtil";
import { CARBON_CALCULATION_BASE_PATH, OperationsBase } from "../OperationsBase";
import { IEC3ConfigurationClient } from "./IEC3ConfigurationClient";

export class EC3ConfigurationClient extends OperationsBase implements IEC3ConfigurationClient {
  constructor(basePath?: string) {
    super(basePath ?? CARBON_CALCULATION_BASE_PATH);
  }

  public async getConfigurations(accessToken: string, iModelId: string, top?: number | undefined): Promise<EC3Configuration[]> {
    const configurations: Array<EC3Configuration> = [];
    const configIterator = this.getConfigurationsIterator(accessToken, iModelId, top);
    for await(const config of configIterator) {
      configurations.push(config);
    }
    return configurations;
  }

  public getConfigurationsIterator(accessToken: string, iModelId: string, top?: number | undefined): EntityListIterator<EC3Configuration> {
    if(!this.topIsValid(top)) {
      throw new RequiredError(
        "top",
        "Parameter top was outside of the valid range [1-1000]."
      );
    }
    let url = `${this.basePath}/ec3/configurations?iTwinId=${iModelId}`;
    url += top ? `/?$top=${top}` : "";
    const request = this.createRequest("GET", accessToken);
    return new EntityListIteratorImpl(async () => getEntityCollectionPage<EC3Configuration>(
      url,
      async (nextUrl: string): Promise<Collection<EC3Configuration>> => {
        const response: EC3ConfigurationCollection = await this.fetchJSON<EC3ConfigurationCollection>(nextUrl, request);
        return {
          values: response.configurations,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          _links: response._links,
        };
      }));
  }

  public async getConfiguration(accessToken: string, configurationId: string): Promise<EC3Configuration> {
    const url = `${this.basePath}/ec3/configurations/${configurationId}`;
    const requestOptions: RequestInit = this.createRequest("GET", accessToken);
    return (await this.fetchJSON<EC3ConfigurationSingle>(url, requestOptions)).configuration;
  }

  public async createConfiguration(accessToken: string, configuration: EC3ConfigurationCreate): Promise<EC3Configuration> {
    const url = `${this.basePath}/ec3/configurations`;
    const requestOptions: RequestInit = this.createRequest("POST", accessToken, JSON.stringify(configuration));
    return (await this.fetchJSON<EC3ConfigurationSingle>(url, requestOptions)).configuration;
  }

  public async updateConfiguration(accessToken: string, configurationId: string, configuration: EC3ConfigurationUpdate): Promise<EC3Configuration> {
    const url = `${this.basePath}/ec3/configurations/${configurationId}`;
    const requestOptions: RequestInit = this.createRequest("PUT", accessToken, JSON.stringify(configuration));
    return (await this.fetchJSON<EC3ConfigurationSingle>(url, requestOptions)).configuration;
  }

  public async deleteConfiguration(accessToken: string, configurationId: string): Promise<Response> {
    const url = `${this.basePath}/ec3/configurations/${configurationId}`;
    const requestOptions: RequestInit = this.createRequest("DELETE", accessToken);
    return this.fetchJSON<Response>(url, requestOptions);
  }
}
