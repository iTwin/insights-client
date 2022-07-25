/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { OperationsBase } from "../../base";
import { CheckpointOperations } from "../checkpoint/CheckpointOperations";
import { NamedVersionOperations } from "../named-version/NamedVersionOperations";
import { OperationOptions } from "../OperationOptions";

export class ChangesetOperations<TOptions extends OperationOptions> extends OperationsBase<TOptions> {
  constructor(
    options: TOptions,
    protected _namedVersionOperations: NamedVersionOperations<TOptions>,
    protected _checkpointOperations: CheckpointOperations<TOptions>
  ) {
    super(options);
  }
}
