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
  const projectId = "8b4b17c9-2a99-4e83-9637-c587bef27e30";
  const imodelId = "8d73d54f-a340-4fad-b579-07403541cd99";
  const mappingId = "30dc87ab-2661-449f-b5c1-e8961226f3c4";
  const groupId = "4e5fc52b-25af-474e-9ecf-33756c2cece4";
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
    expect(properties.properties).to.be.not.undefined;
    expect(properties.properties).to.not.be.empty;
  });
});
