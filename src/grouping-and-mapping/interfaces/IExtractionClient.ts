/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { AccessToken } from "@itwin/core-bentley";
import { ExtractionRequestDetails, ExtractionStatus } from "./Extraction";

export interface IExtractionClient {
  /**
     * Manually run Extraction of data from an iModel.
     * @param {string} accessToken OAuth access token with scope `insights:modify`.
     * @param {ExtractionRunRequest} extractionRequest Extraction properties.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/run-extraction/
     */
  runExtraction( accessToken: AccessToken, extractionRequest: ExtractionRequestDetails ): Promise<ExtractionStatus>;
}
