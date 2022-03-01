/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import { expect } from "chai";
import type { AccessToken } from "@itwin/core-bentley";
import { TestConfig } from "../TestConfig";
import { ReportingClient } from "./../../reporting/reportingClient";

chai.should();
describe("ReportingClient", () => {
  const reportingCLient: ReportingClient = new ReportingClient();
  const projectId = process.env.IMJS_TEST_PROJECT_ID ?? "";
  const imodelId = process.env.IMJS_TEST_IMODEL_ID ?? "";
  const mappingId = process.env.IMJS_TEST_MAPPING_ID ?? "";
  const groupId = process.env.IMJS_TEST_GROUP_ID ?? "";
  let accessToken: AccessToken;

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("Get reportis", async () => {
    const reports = await reportingCLient.getReports(accessToken, projectId);
    expect(reports.reports).to.not.be.undefined;
    expect(reports.reports).to.not.be.empty;
  });

  it("Get mappings", async () => {
    const mappings = await reportingCLient.getMappings(accessToken, imodelId);
    expect(mappings).to.not.be.undefined;
    expect(mappings).to.not.be.empty;
  });

  it("Get groups", async () => {
    const groups = await reportingCLient.getGroups(
      accessToken,
      imodelId,
      mappingId
    );
    expect(groups.groups).to.not.be.undefined;
    expect(groups.groups).to.not.be.empty;
  });

  it("Get properties", async () => {
    const properties = await reportingCLient.getGroupProperties(
      accessToken,
      imodelId,
      mappingId,
      groupId
    );
    expect(properties.groupProperties).to.be.not.undefined;
    expect(properties.groupProperties).to.not.be.empty;
  });
});
