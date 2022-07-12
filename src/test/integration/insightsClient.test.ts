/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import { expect } from "chai";
import { ExtractionClient, MappingsClient, ODataClient, ReportsClient } from "./../../reporting";
import { getTestAccessToken, TestBrowserAuthorizationClientConfiguration, TestUsers } from"@itwin/oidc-signin-tool";

require('dotenv').config();

chai.should();
describe("ReportingClient", () => {
  let oidcConfig: TestBrowserAuthorizationClientConfiguration;
  const mappingsClient: MappingsClient = new MappingsClient();
  let imodelId = "0d38e141-7705-4974-95da-1d4d3b762f31";
  let accessToken: string;// = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkJlbnRsZXlJTVNfMjAyMiIsInBpLmF0bSI6ImE4bWUifQ.eyJzY29wZSI6WyJpbnNpZ2h0czpyZWFkIiwiaW5zaWdodHM6bW9kaWZ5Il0sImNsaWVudF9pZCI6Iml0d2luLWRldmVsb3Blci1jb25zb2xlIiwiYXVkIjpbImh0dHBzOi8vaW1zLmJlbnRsZXkuY29tL2FzL3Rva2VuLm9hdXRoMiIsImh0dHBzOi8vaW1zb2lkYy5iZW50bGV5LmNvbS9hcy90b2tlbi5vYXV0aDIiLCJodHRwczovL2ltc29pZGMuYmVudGxleS5jb20vcmVzb3VyY2VzIiwiYmVudGxleS1hcGktbWFuYWdlbWVudCJdLCJzdWIiOiI1ZjZkZDQ5OS0wZTBjLTQ3ZDAtOTU5MC0zZjVjYjlmNmEyNjQiLCJyb2xlIjoiQkVOVExFWV9FTVBMT1lFRSIsIm9yZyI6ImZhYjk3NzRiLWIzMzgtNGNjMi1hNmM5LTQ1OGJkZjdmOTY2YSIsInN1YmplY3QiOiI1ZjZkZDQ5OS0wZTBjLTQ3ZDAtOTU5MC0zZjVjYjlmNmEyNjQiLCJpc3MiOiJodHRwczovL2ltcy5iZW50bGV5LmNvbSIsImVudGl0bGVtZW50IjpbIkJFTlRMRVlfTEVBUk4iLCJJTlRFUk5BTCIsIlNFTEVDVF8yMDA2IiwiQkVOIiwiQkROIl0sInByZWZlcnJlZF91c2VybmFtZSI6IlJ5dGlzLlNhcGthQGJlbnRsZXkuY29tIiwiZ2l2ZW5fbmFtZSI6IlJ5dGlzIiwic2lkIjoiWUdHdHJsdmlCNFpzMDJyODhmMFE0dHAzbTRJLlNVMVRMVUpsYm5Sc1pYa3RSRVUuekFlei5mVjRSRDFlT0xpdkxGMzUzSEl0UkNSbUJEIiwibmJmIjoxNjU3NTc0MDI2LCJ1bHRpbWF0ZV9zaXRlIjoiMTAwMTM4OTExNyIsInVzYWdlX2NvdW50cnlfaXNvIjoiR0IiLCJhdXRoX3RpbWUiOjE2NTc1NzQzMjYsIm5hbWUiOiJSeXRpcy5TYXBrYUBiZW50bGV5LmNvbSIsIm9yZ19uYW1lIjoiQmVudGxleSBTeXN0ZW1zIEluYyIsImZhbWlseV9uYW1lIjoiU2Fwa2EiLCJlbWFpbCI6IlJ5dGlzLlNhcGthQGJlbnRsZXkuY29tIiwiZXhwIjoxNjU3NTc3OTI4fQ.ZdrlvohkrV7inbeq3b_2JWRlESuuy75DB8RUKYyyfK8Vtva2g44ZKXP8oj8jNXEuRay_wXRYcnxBq1ppX5Mzc3l4oyB6NiyC9d0YaHNZ-wU9wWGPslC8d9x0Qty77tMnhP2a_-sAuyTSVBGt1OnMHWTsuM8qYOy6H7vNhfXcSuVfzUYTeTTRzpzr_LrdQ-WrjzjnV-5Uw8v2x8FmF4Y5MDVj5lZFUuYCUY0RYTvOKaIMdZJLQ91Qi0P1L8fdHZA4arVEGXY6Mdd2QgmFlw6It3IQSqDoNNgMsjICaCXa-COXmVSAzzIwkMB8YJmZ2VAZ2r-fQrhZaWopSPlwvUDGfA";

  //get accessToken
  before( async function () {
    this.timeout(50000);

    oidcConfig = {
      clientId: process.env.IMJS_OIDC_BROWSER_TEST_CLIENT_ID ?? "",
      redirectUri: process.env.IMJS_OIDC_BROWSER_TEST_REDIRECT_URI ?? "",
      scope: process.env.IMJS_OIDC_BROWSER_TEST_SCOPES ?? "",
    };

    const validUser = TestUsers.regular;
    accessToken = await getTestAccessToken(oidcConfig, validUser) ?? "";
  });

  //run tests
  it("Get mapping", async () => {
    console.log(accessToken);
    const reports = await mappingsClient.getMappings(accessToken, imodelId);
    expect(reports).to.not.be.undefined;
  });
});
