/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import { expect } from "chai";
import type { AccessToken } from "@itwin/core-bentley";
import { TestConfig } from "../TestConfig";
import { ExtractionClient, MappingsClient, ODataClient, ReportsClient } from "./../../reporting";

chai.should();
describe("ReportingClient", () => {
  const extractionClient: ExtractionClient = new ExtractionClient();
  const mappingsClient: MappingsClient = new MappingsClient();
  const oDataClient: ODataClient = new ODataClient();
  const reportsClient: ReportsClient = new ReportsClient();
  const projectId = process.env.IMJS_TEST_PROJECT_ID ?? "";
  const imodelId = process.env.IMJS_TEST_IMODEL_ID ?? "";
  const mappingId = process.env.IMJS_TEST_MAPPING_ID ?? "";
  const groupId = process.env.IMJS_TEST_GROUP_ID ?? "";
  let accessToken = process.env.IMJS_TEST_AUTH_ID ?? "";

  before(async function () {
    this.timeout(0);
    //accessToken = await TestConfig.getAccessToken();
  });

  it("Get reportis", async () => {
    const reports = await reportsClient.getReports(accessToken, projectId);
    expect(reports).to.not.be.undefined;
    expect(reports).to.not.be.empty;
  });

  it("Get mappings", async () => {
    const mappings = await mappingsClient.getMappings(accessToken, imodelId);
    expect(mappings).to.not.be.undefined;
    expect(mappings).to.not.be.empty;
  });

  it("Get groups", async () => {
    const groups = await mappingsClient.getGroups(
      accessToken,
      imodelId,
      mappingId
    );
    expect(groups).to.not.be.undefined;
    expect(groups).to.not.be.empty;
  });

  it("Get properties", async () => {
    const properties = await mappingsClient.getGroupProperties(
      accessToken,
      imodelId,
      mappingId,
      groupId
    );
    expect(properties).to.be.not.undefined;
    expect(properties).to.not.be.empty;
  });
});
