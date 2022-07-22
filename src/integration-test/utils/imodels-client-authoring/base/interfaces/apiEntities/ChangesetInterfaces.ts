/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Changeset } from "../../../../imodels-client-management/base";
import { DownloadedFileProps } from "../CommonInterfaces";

/** Changeset metadata along with the downloaded file path. */
export type DownloadedChangeset = Changeset & DownloadedFileProps;
