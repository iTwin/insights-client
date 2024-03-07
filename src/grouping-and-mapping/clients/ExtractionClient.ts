/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { OperationsBase } from "../../common/OperationsBase";
import { ExtractionRequestDetails, ExtractionStatus } from "../interfaces/Extraction";
import { IExtractionClient } from "../interfaces/IExtractionClient";

export class ExtractionClient extends OperationsBase implements IExtractionClient {
  public async runExtraction(accessToken: string, extractionRequest: ExtractionRequestDetails): Promise<ExtractionStatus> {
    throw new Error("Method not implemented.");
  }

}
