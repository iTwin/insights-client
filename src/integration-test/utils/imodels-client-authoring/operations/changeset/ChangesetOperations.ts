/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { Changeset, ChangesetResponse} from "../../../imodels-client-management/IModelsClientExports";
import { ChangesetState } from "../../../imodels-client-management/base/interfaces/apiEntities/ChangesetInterfaces";
import { ChangesetOperations as ManagementChangesetOperations } from "../../../imodels-client-management/operations/changeset/ChangesetOperations";
import type { OperationOptions } from "../OperationOptions";
import type { ChangesetPropertiesForCreate, CreateChangesetParams } from "./ChangesetOperationParams";

export class ChangesetOperations<TOptions extends OperationOptions> extends ManagementChangesetOperations<TOptions>{
  /**
   * Creates a Changeset. Wraps the {@link https://developer.bentley.com/apis/imodels/operations/create-imodel-changeset/
   * Create iModel Changeset} operation from iModels API. Internally it creates a Changeset instance, uploads the Changeset
   * file and confirms Changeset file upload. The execution of this method depends on the Changeset file size - the larger
   * the file, the longer the upload will take.
   * @param {CreateChangesetParams} params parameters for this operation. See {@link CreateChangesetParams}.
   * @returns newly created Changeset. See {@link Changeset}.
   */
  public async create(params: CreateChangesetParams): Promise<Changeset> {
    const createChangesetBody = this.getCreateChangesetRequestBody(params.changesetProperties);
    const createChangesetResponse = await this.sendPostRequest<ChangesetResponse>({
      authorization: params.authorization,
      url: this._options.urlFormatter.getChangesetListUrl({ iModelId: params.iModelId }),
      body: createChangesetBody,
    });

    const uploadUrl = createChangesetResponse.changeset._links.upload.href;
    await this._options.fileHandler.uploadFile({ uploadUrl, sourceFilePath: params.changesetProperties.filePath });

    const confirmUploadBody = this.getConfirmUploadRequestBody(params.changesetProperties);
    const confirmUploadResponse = await this.sendPatchRequest<ChangesetResponse>({
      authorization: params.authorization,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      url: createChangesetResponse.changeset._links.complete.href,
      body: confirmUploadBody,
    });

    return confirmUploadResponse.changeset;
  }

  private getCreateChangesetRequestBody(changesetProperties: ChangesetPropertiesForCreate): Record<string, unknown> {
    return {
      id: changesetProperties.id,
      description: changesetProperties.description,
      parentId: changesetProperties.parentId,
      briefcaseId: changesetProperties.briefcaseId,
      containingChanges: changesetProperties.containingChanges,
      fileSize: this._options.fileHandler.getFileSize(changesetProperties.filePath),
      synchronizationInfo: changesetProperties.synchronizationInfo,
    };
  }

  private getConfirmUploadRequestBody(changesetProperties: ChangesetPropertiesForCreate): Record<string, unknown> {
    return {
      state: ChangesetState.FileUploaded,
      briefcaseId: changesetProperties.briefcaseId,
    };
  }

}
