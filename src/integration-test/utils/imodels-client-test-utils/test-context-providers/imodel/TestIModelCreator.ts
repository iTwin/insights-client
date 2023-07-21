/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { inject, injectable } from "inversify";
import type { Lock, LockedObjects } from "@itwin/imodels-client-authoring";
import { LockLevel } from "@itwin/imodels-client-authoring";
import { TestITwinProvider } from "../itwin/TestITwinProvider";
import { TestIModelFileProvider } from "./TestIModelFileProvider";
import type { BriefcaseMetadata, IModelMetadata, ReusableIModelMetadata } from "./TestIModelInterfaces";
import { TestIModelsClient } from "./TestIModelsClient";
import { TestAuthorizationProvider } from "../auth/TestAuthorizationProvider";

@injectable()
export class TestIModelCreator {
  private readonly _iModelDescription = "Some description";
  private readonly _briefcaseDeviceName = "Some device name";

  constructor(
    @inject(TestIModelsClient)
    private readonly _iModelsClient: TestIModelsClient,
    @inject(TestAuthorizationProvider)
    private readonly _testAuthorizationProvider: TestAuthorizationProvider,
    @inject(TestITwinProvider)
    private readonly _testProjectProvider: TestITwinProvider,
    @inject(TestIModelFileProvider)
    private readonly _testIModelFileProvider: TestIModelFileProvider
  ) { }

  public async createEmpty(iModelName: string): Promise<IModelMetadata> {
    const iTwinId = await this._testProjectProvider.getOrCreate();
    const iModel = await this._iModelsClient.iModels.createEmpty({
      authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
      iModelProperties: {
        iTwinId,
        name: iModelName,
        description: this._iModelDescription,
      },
    });

    return {
      id: iModel.id,
      name: iModel.name,
      description: iModel.description ?? "",
    };
  }

  public async createEmptyAndUploadChangesets(iModelName: string): Promise<IModelMetadata> {
    const iModel = await this.createEmpty(iModelName);
    const briefcase = await this.acquireBriefcase(iModel.id);
    await this.uploadChangesets(iModel.id, briefcase.id);
    return iModel;
  }

  public async createReusable(iModelName: string): Promise<ReusableIModelMetadata> {
    const iModel = await this.createEmpty(iModelName);
    const briefcase = await this.acquireBriefcase(iModel.id);
    await this.uploadChangesets(iModel.id, briefcase.id);
    const lock = await this.createLockOnReusableIModel(iModel.id, briefcase.id);

    return {
      ...iModel,
      briefcase,
      lock,
    };
  }

  private async createLockOnReusableIModel(iModelId: string, briefcaseId: number): Promise<Lock> {
    const testIModelLocks: LockedObjects[] = [
      {
        lockLevel: LockLevel.Exclusive,
        objectIds: ["0x1", "0xa"],
      },
      {
        lockLevel: LockLevel.Shared,
        objectIds: ["0x2", "0xb"],
      },
    ];

    const acquiredLocks: Lock = await this._iModelsClient.locks.update({
      authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
      iModelId,
      briefcaseId,
      lockedObjects: testIModelLocks,
    });

    return acquiredLocks;
  }

  public async uploadChangesets(iModelId: string, briefcaseId: number): Promise<void> {
    for (let i = 0; i < this._testIModelFileProvider.changesets.length; i++) {
      await this._iModelsClient.changesets.create({
        authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
        iModelId,
        changesetProperties: {
          briefcaseId,
          description: this._testIModelFileProvider.changesets[i].description,
          containingChanges: this._testIModelFileProvider.changesets[i].containingChanges,
          id: this._testIModelFileProvider.changesets[i].id,
          parentId: i === 0
            ? undefined
            : this._testIModelFileProvider.changesets[i - 1].id,
          synchronizationInfo: this._testIModelFileProvider.changesets[i].synchronizationInfo,
          filePath: this._testIModelFileProvider.changesets[i].filePath,
        },
      });
    }
  }

  private async acquireBriefcase(iModelId: string): Promise<BriefcaseMetadata> {
    const briefcase = await this._iModelsClient.briefcases.acquire({
      authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
      iModelId,
      briefcaseProperties: {
        deviceName: this._briefcaseDeviceName,
      },
    });

    return {
      id: briefcase.briefcaseId,
      deviceName: briefcase.deviceName ?? "",
    };
  }
}
