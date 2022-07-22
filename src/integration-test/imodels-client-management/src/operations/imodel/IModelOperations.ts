/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { EntityListIterator } from "../../../../../reporting/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../../../../reporting/iterators/EntityListIteratorImpl";
import { AuthorizationCallback, IModel, IModelResponse, IModelState, IModelsErrorCode, IModelsErrorImpl, IModelsResponse, MinimalIModel, OperationsBase, PreferReturn } from "../../base";
import { OperationOptions } from "../OperationOptions";
import { CreateEmptyIModelParams, CreateIModelFromTemplateParams, DeleteIModelParams, GetIModelListParams, GetSingleIModelParams, IModelProperties, IModelPropertiesForCreateFromTemplate, IModelPropertiesForUpdate, UpdateIModelParams } from "./IModelOperationParams";

export class IModelOperations<TOptions extends OperationOptions> extends OperationsBase<TOptions> {
  /**
   * Gets iModels for a specific project. This method returns iModels in their minimal representation. The returned iterator
   * internally queries entities in pages. Wraps the {@link https://developer.bentley.com/apis/imodels/operations/get-project-imodels/ Get Project iModels}
   * operation from iModels API.
   * @param {GetiModelListParams} params parameters for this operation. See {@link GetiModelListParams}.
   * @returns {EntityListIterator<MinimaliModel>} iterator for iModel list. See {@link EntityListIterator}, {@link MinimaliModel}.
   */
  public getMinimalList(params: GetIModelListParams): EntityListIterator<MinimalIModel> {
    return new EntityListIteratorImpl(async () => this.getEntityCollectionPage<MinimalIModel>({
      authorization: params.authorization,
      url: this._options.urlFormatter.getIModelListUrl({ urlParams: params.urlParams }),
      preferReturn: PreferReturn.Minimal,
      entityCollectionAccessor: (response: unknown) => (response as IModelsResponse<MinimalIModel>).iModels
    }));
  }

  /**
   * Gets iModels for a specific project. This method returns iModels in their full representation. The returned iterator
   * internally queries entities in pages. Wraps the {@link https://developer.bentley.com/apis/imodels/operations/get-project-imodels/ Get Project iModels}
   * operation from iModels API.
   * @param {GetiModelListParams} params parameters for this operation. See {@link GetiModelListParams}.
   * @returns {EntityListIterator<iModel>} iterator for iModel list. See {@link EntityListIterator}, {@link iModel}.
   */
  public getRepresentationList(params: GetIModelListParams): EntityListIterator<IModel> {
    return new EntityListIteratorImpl(async () => this.getEntityCollectionPage<IModel>({
      authorization: params.authorization,
      url: this._options.urlFormatter.getIModelListUrl({ urlParams: params.urlParams }),
      preferReturn: PreferReturn.Representation,
      entityCollectionAccessor: (response: unknown) => (response as IModelsResponse<IModel>).iModels
    }));
  }

  /**
   * Creates an empty iModel with specified properties. Wraps the
   * {@link https://developer.bentley.com/apis/imodels/operations/create-imodel/ Create iModel} operation from iModels API.
   * @param {CreateEmptyiModelParams} params parameters for this operation. See {@link CreateEmptyiModelParams}.
   * @returns {Promise<iModel>} newly created iModel. See {@link iModel}.
   */
  public async createEmpty(params: CreateEmptyIModelParams): Promise<IModel> {
    const createIModelBody = this.getCreateEmptyIModelRequestBody(params.iModelProperties);
    return this.sendIModelPostRequest(params.authorization, createIModelBody);
  }

  /**
   * Deletes an iModel with specified id. Wraps the {@link https://developer.bentley.com/apis/imodels/operations/delete-imodel/ Delete iModel}
   * operation from iModels API.
   * @param {DeleteiModelParams} params parameters for this operation. See {@link DeleteiModelParams}.
   * @returns {Promise<void>} a promise that resolves after operation completes.
   */
  public async delete(params: DeleteIModelParams): Promise<void> {
    return this.sendDeleteRequest({
      authorization: params.authorization,
      url: this._options.urlFormatter.getSingleIModelUrl({ iModelId: params.iModelId })
    });
  }

  protected getCreateEmptyIModelRequestBody(iModelProperties: IModelProperties): object {
    return {
      projectId: iModelProperties.projectId,
      name: iModelProperties.name,
      description: iModelProperties.description,
      extent: iModelProperties.extent
    };
  }

  protected async sendIModelPostRequest(authorization: AuthorizationCallback, createIModelBody: object): Promise<IModel> {
    const createIModelResponse = await this.sendPostRequest<IModelResponse>({
      authorization,
      url: this._options.urlFormatter.getCreateIModelUrl(),
      body: createIModelBody
    });
    return createIModelResponse.iModel;
  }
}
