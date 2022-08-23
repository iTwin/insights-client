/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as path from "path";

export class TestConstants {
  public static testDownloadDirectoryPath = path.join(__dirname, "../testDownloads");
  public static packagePrefix = "IModelsClientsTests";
  public static testDeviceName = "Test device";
}
