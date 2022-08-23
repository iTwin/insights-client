/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { EntityListIterator } from "../../../../../reporting/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../../../../reporting/iterators/EntityListIteratorImpl";
import type { NamedVersion, NamedVersionResponse, NamedVersionsResponse } from "../../base";
import { OperationsBase } from "../../base/OperationsBase";
import { PreferReturn } from "../../base/interfaces/CommonInterfaces";
import type { OperationOptions } from "../OperationOptions";
import type { CreateNamedVersionParams, GetNamedVersionListParams, NamedVersionPropertiesForCreate } from "./NamedVersionOperationParams";

export class NamedVersionOperations<TOptions extends OperationOptions> extends OperationsBase<TOptions> {
  /**
   * Gets Named Versions of a specific iModel. This method returns Named Versions in their full representation. The
   * returned iterator internally queries entities in pages. Wraps the
   * {@link https://developer.bentley.com/apis/imodels/operations/get-imodel-named-versions/
   * Get iModel Named Versions} operation from iModels API.
   * @param {GetNamedVersionListParams} params parameters for this operation. See {@link GetNamedVersionListParams}.
   * @returns {EntityListIterator<NamedVersion>} iterator for Named Version list. See {@link EntityListIterator},
   * {@link NamedVersion}.
   */
  public getRepresentationList(params: GetNamedVersionListParams): EntityListIterator<NamedVersion> {
    return new EntityListIteratorImpl(async () => this.getEntityCollectionPage<NamedVersion>({
      authorization: params.authorization,
      url: this._options.urlFormatter.getNamedVersionListUrl({ iModelId: params.iModelId, urlParams: params.urlParams }),
      preferReturn: PreferReturn.Representation,
      entityCollectionAccessor: (response: unknown) => (response as NamedVersionsResponse<NamedVersion>).namedVersions,
    }));
  }

  /**
   * Creates a Named Version with specified properties. Wraps the
   * {@link https://developer.bentley.com/apis/imodels/operations/create-imodel-named-version/
   * Create iModel Named Version} operation from iModels API.
   * @param {CreateNamedVersionParams} params parameters for this operation. See {@link CreateNamedVersionParams}.
   * @returns {Promise<NamedVersion>} newly created Named Version. See {@link NamedVersion}.
   */
  public async create(params: CreateNamedVersionParams): Promise<NamedVersion> {
    const createNamedVersionBody = this.getCreateNamedVersionRequestBody(params.namedVersionProperties);
    const createNamedVersionResponse = await this.sendPostRequest<NamedVersionResponse>({
      authorization: params.authorization,
      url: this._options.urlFormatter.getNamedVersionListUrl({ iModelId: params.iModelId }),
      body: createNamedVersionBody,
    });
    return createNamedVersionResponse.namedVersion;
  }

  private getCreateNamedVersionRequestBody(namedVersionProperties: NamedVersionPropertiesForCreate): Record<string, unknown> {
    return {
      name: namedVersionProperties.name,
      description: namedVersionProperties.description,
      changesetId: namedVersionProperties.changesetId,
    };
  }
}
