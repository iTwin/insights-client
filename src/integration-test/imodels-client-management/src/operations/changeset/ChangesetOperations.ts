/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { AuthorizationCallback, ChangesetResponse, Checkpoint, NamedVersion, OperationsBase, PreferReturn } from "../../base";
import { Changeset, ChangesetsResponse, MinimalChangeset, MinimalChangesetsResponse } from "../../base/interfaces/apiEntities/ChangesetInterfaces";
import { CheckpointOperations } from "../checkpoint/CheckpointOperations";
import { NamedVersionOperations } from "../named-version/NamedVersionOperations";
import { OperationOptions } from "../OperationOptions";
import { GetChangesetListParams, GetSingleChangesetParams } from "./ChangesetOperationParams";

export class ChangesetOperations<TOptions extends OperationOptions> extends OperationsBase<TOptions> {
  constructor(
    options: TOptions,
    protected _namedVersionOperations: NamedVersionOperations<TOptions>,
    protected _checkpointOperations: CheckpointOperations<TOptions>
  ) {
    super(options);
  }
}
