/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AuthorizationParam, IModelsClient, Lock } from "@itwin/imodels-client-authoring";

export interface BriefcaseMetadata {
  id: number;
  deviceName: string;
}

export interface IModelMetadata {
  id: string;
  name: string;
  description: string;
}

export interface ReusableIModelMetadata extends IModelMetadata {
  changesetId: string;
  briefcase: BriefcaseMetadata;
  lock: Lock;
}

export interface TestIModelSetupContext extends AuthorizationParam {
  iModelsClient: IModelsClient;
}

export interface IModelIdentificationByNameParams {
  projectId: string;
  iModelName: string;
}

export interface IModelIdParam {
  iModelId: string;
}
