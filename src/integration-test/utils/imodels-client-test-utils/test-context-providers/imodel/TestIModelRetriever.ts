/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { inject, injectable } from "inversify";
import { toArray } from "../../../../../common/iterators/IteratorUtil";
import type { GetBriefcaseListParams, GetChangesetListParams, GetLockListParams, IModel, Lock } from "@itwin/imodels-client-authoring";
import { TestSetupError } from "../../CommonTestUtils";
import { TestAuthorizationProvider } from "../auth/TestAuthorizationProvider";
import { TestITwinProvider } from "../itwin/TestITwinProvider";
import { TestIModelFileProvider } from "./TestIModelFileProvider";
import type { BriefcaseMetadata, ReusableIModelMetadata } from "./TestIModelInterfaces";
import { TestIModelsClient } from "./TestIModelsClient";

@injectable()
export class TestIModelRetriever {
  constructor(
    @inject(TestIModelsClient)
    private readonly _iModelsClient: TestIModelsClient,
    @inject(TestAuthorizationProvider)
    private readonly _testAuthorizationProvider: TestAuthorizationProvider,
    @inject(TestITwinProvider)
    private readonly _testProjectProvider: TestITwinProvider,
    @inject(TestIModelFileProvider)
    private readonly _testIModelFileProvider: TestIModelFileProvider,
  ) { }

  public async findIModelByName(iModelName: string): Promise<IModel | undefined> {
    const iTwinId = await this._testProjectProvider.getOrCreate();
    const iModelIterator = this._iModelsClient.iModels.getRepresentationList({
      authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
      urlParams: {
        iTwinId,
        name: iModelName,
      },
    });
    const iModels = await toArray(iModelIterator);
    return iModels.length === 0
      ? undefined
      : iModels[0];
  }

  public async queryRelatedData(iModel: IModel): Promise<ReusableIModelMetadata> {
    const briefcase = await this.queryAndValidateBriefcase(iModel.id);
    const lock = await this.queryAndValidateLock(iModel.id);
    const changesetIds = await this.getChangesetIds(iModel.id);

    return {
      id: iModel.id,
      changesetId: changesetIds[changesetIds.length - 1],
      name: iModel.name,
      description: iModel.description ?? "",
      briefcase,
      lock,
    };
  }

  private async getChangesetIds(iModelId: string): Promise<string[]> {
    const getChangesetListParams: GetChangesetListParams = {
      authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
      iModelId,
    };
    const changesets = await toArray(this._iModelsClient.changesets.getMinimalList(getChangesetListParams));
    if (changesets.length === 0)
      throw new TestSetupError("No changesets found for reusable test IModel.");

    return changesets.map((x) => (x.id));
  }

  private async queryAndValidateBriefcase(iModelId: string): Promise<BriefcaseMetadata> {
    const getBriefcaseListParams: GetBriefcaseListParams = {
      authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
      iModelId,
    };
    const briefcases = await toArray(this._iModelsClient.briefcases.getRepresentationList(getBriefcaseListParams));
    if (briefcases.length !== 1)
      throw new TestSetupError(`${briefcases.length} is an unexpected briefcase count for reusable test IModel.`);

    return { id: briefcases[0].briefcaseId, deviceName: briefcases[0].deviceName ?? "" };
  }

  private async queryAndValidateLock(iModelId: string): Promise<Lock> {
    const getLockListParams: GetLockListParams = {
      authorization: this._testAuthorizationProvider.getAdmin1Authorization(),
      iModelId,
    };
    const locks: Lock[] = await toArray(this._iModelsClient.locks.getList(getLockListParams));
    if (locks.length !== 1) {
      throw new TestSetupError(`${locks.length} is an unexpected lock count for reusable test iModel.`);
    }

    return locks[0];
  }
}
