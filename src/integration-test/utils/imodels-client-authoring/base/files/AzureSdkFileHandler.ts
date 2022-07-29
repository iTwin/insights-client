/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as fs from "fs";
import { URL } from "url";
import type { BlockBlobParallelUploadOptions } from "@azure/storage-blob";
import { AnonymousCredential, BlockBlobClient } from "@azure/storage-blob";
import type { FileHandler, ProgressCallback, UploadFileParams } from "./FileHandler";

interface AzureProgressCallbackData {
  loadedBytes: number;
}

type AzureProgressCallback = (progress: AzureProgressCallbackData) => void;

/**
 * Default implementation for {@link FileHandler} interface that uses Azure SDK for file transfer operations and
 * Node.js `fs` module for local file storage operations.
 */
export class AzureSdkFileHandler implements FileHandler {
  public async uploadFile(params: UploadFileParams): Promise<void> {
    if (this.isUrlExpired(params.uploadUrl))
      throw new Error("AzureSdkFileHandler: cannot upload file because SAS url is expired.");

    const blockBlobClient = new BlockBlobClient(params.uploadUrl, new AnonymousCredential());

    let uploadOptions: BlockBlobParallelUploadOptions | undefined;
    if (params.progressCallback) {
      const fileSize = this.getFileSize(params.sourceFilePath);
      uploadOptions = {
        onProgress: this.adaptProgressCallback(params.progressCallback, fileSize),
      };
    }

    await blockBlobClient.uploadFile(params.sourceFilePath, uploadOptions);
  }

  public getFileSize(filePath: string): number {
    return fs.statSync(filePath).size;
  }

  private isUrlExpired(url: string): boolean {
    const signedExpiryUrlParam = new URL(url).searchParams.get("se");
    if (!signedExpiryUrlParam) {return false;}

    const expiryUtc = new Date(signedExpiryUrlParam);
    const currentUtc = new Date(new Date().toUTCString());
    return expiryUtc <= currentUtc;
  }

  private adaptProgressCallback(progressCallback: ProgressCallback, fileSize: number): AzureProgressCallback {
    return (progressData: AzureProgressCallbackData) => progressCallback({ bytesTotal: fileSize, bytesTransferred: progressData.loadedBytes });
  }
}
