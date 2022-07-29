/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type {
  IModelsClientOptions as ManagementIModelsClientOptions,
  RecursiveRequired} from "../imodels-client-management/IModelsClientExports";
import { IModelsClient as ManagementIModelsClient } from "../imodels-client-management/IModelsClient";
import { CheckpointOperations } from "../imodels-client-management/operations/checkpoint/CheckpointOperations";
import { NamedVersionOperations } from "../imodels-client-management/operations/named-version/NamedVersionOperations";
import type { FileHandler } from "./base";
import { AzureSdkFileHandler } from "./base/files/AzureSdkFileHandler";
import { BriefcaseOperations } from "./operations/briefcase/BriefcaseOperations";
import { ChangesetOperations } from "./operations/changeset/ChangesetOperations";
import { IModelOperations } from "./operations/imodel/IModelOperations";
import { LockOperations } from "./operations/lock/LockOperations";
import { IModelsApiUrlFormatter } from "./operations/IModelsApiUrlFormatter";
import type { OperationOptions } from "./operations/OperationOptions";

/** User-configurable iModels client options. */
export interface IModelsClientOptions extends ManagementIModelsClientOptions {
  /**
   * File handler to use in operations which transfer files. Examples of such operations are Changeset download in
   * {@link ChangesetOperations}, iModel creation from Baseline in {@link iModelOperations}. If `undefined` the default
   * handler is used which is implemented using Azure SDK. See {@link AzureSdkFileHandler}.
   */
  fileHandler?: FileHandler;
}

/**
 * iModels API client for iModel authoring workflows. For more information on the API visit the
 * {@link https://developer.bentley.com/apis/imodels/ iModels API documentation page}.
 */
export class IModelsClient {
  protected _operationsOptions: OperationOptions;

  /**
   * Class constructor.
   * @param {iModelsClientOptions} options client options. If `options` are `undefined` or if some of the properties
   * are `undefined` the client uses defaults. See {@link iModelsClientOptions}.
   */
  constructor(options?: IModelsClientOptions) {
    const filledIModelsClientOptions = IModelsClient.fillConfiguration(options);
    this._operationsOptions = {
      ...filledIModelsClientOptions,
      urlFormatter: new IModelsApiUrlFormatter(filledIModelsClientOptions.api.baseUrl),
    };
  }

  /** iModel operations. See {@link iModelOperations}. */
  public get iModels(): IModelOperations<OperationOptions> {
    return new IModelOperations(this._operationsOptions);
  }

  /** Briefcase operations. See {@link BriefcaseOperations}. */
  public get briefcases(): BriefcaseOperations<OperationOptions> {
    return new BriefcaseOperations(this._operationsOptions);
  }

  /** Changeset operations. See {@link ChangesetOperations}. */
  public get changesets(): ChangesetOperations<OperationOptions> {
    return new ChangesetOperations(this._operationsOptions, this.namedVersions, this.checkpoints);
  }

  /** Named version operations. See {@link NamedVersionOperations}. */
  public get namedVersions(): NamedVersionOperations<OperationOptions> {
    return new NamedVersionOperations(this._operationsOptions);
  }

  /** Checkpoint operations. See {@link CheckpointOperations}. */
  public get checkpoints(): CheckpointOperations<OperationOptions> {
    return new CheckpointOperations(this._operationsOptions);
  }

  /** Lock operations. See {@link LockOperations}. */
  public get locks(): LockOperations<OperationOptions> {
    return new LockOperations(this._operationsOptions);
  }

  /**
   * Creates a required configuration instance from user provided options and applying default ones for not specified
   * options. See {@link iModelsClientOptions}.
   * @param {iModelsClientOptions} options user-passed client options.
   * @returns {RecursiveRequired<iModelsClientOptions>} required iModels client configuration options.
   */
  public static fillConfiguration(options?: IModelsClientOptions): RecursiveRequired<IModelsClientOptions> {
    return {
      ...ManagementIModelsClient.fillConfiguration(options),
      fileHandler: options?.fileHandler ?? new AzureSdkFileHandler(),
    };
  }
}
