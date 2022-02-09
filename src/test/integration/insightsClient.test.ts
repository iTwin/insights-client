/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import type { AccessToken } from "@itwin/core-bentley";
import { TestConfig } from "../TestConfig";
import { expect } from 'chai';
import { MappingReportingAPI } from './../../../lib/cjs/reporting/generated/api.d';
import { ReportCollectionReportingAPI, MappingCollectionReportingAPI } from './../../../lib/esm/reporting/generated/api.d';
import { ReportingClient } from './../../reporting/reportingClient';

chai.should();
describe("ReportingClient", () => {
  const projectId = "8b4b17c9-2a99-4e83-9637-c587bef27e30";
  const iModelId = "8d73d54f-a340-4fad-b579-07403541cd99";

  let accessToken: AccessToken;
  let reportingCLient: ReportingClient;
  let reportId: string | undefined;
  let mappingId: string | undefined;
  let groupId: string | undefined;


  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of reports", async () => {
    const reportList = await reportingCLient.getReports(accessToken, projectId);
    expect(reportList.reports).to.be.not.empty;
    if(reportList?.reports && reportList.reports.length > 0) {
      reportId = reportList.reports[0].id;
    }
  });

  it("should get a list of mappings", async () => {
    const mappingList = await reportingCLient.getMappings(accessToken, iModelId);
    expect(mappingList).to.be.not.empty;
    if(mappingList && mappingList.length > 0) {
      mappingId = mappingList[0].id;
    }
  });

  it("should get a list of groups", async () => {
    if(mappingId) {
      const groups = await reportingCLient.getGroups(accessToken, iModelId, mappingId);
      expect(groups.groups).to.be.not.empty;
      if(groups?.groups && groups.groups.length > 0) {
        groupId = groups.groups[0].id;
      }
    }
  });

  it("should get a list of groupProperties", async () => {
    if(mappingId && groupId) {
      const properties = await reportingCLient.getGroupProperties(accessToken, iModelId, mappingId, groupId);
      expect(properties.properties).to.be.not.empty;
    }
  });
});
