/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { ReportCreate, ReportsClient } from "../../reporting";
import "reflect-metadata";
import { accessToken, projectId, testIModelGroup } from "../utils";
import { EC3Configuration, EC3ConfigurationCreate, EC3ConfigurationMaterial } from "../../reporting/interfaces/EC3Configurations";
import { EC3ConfigurationsClient } from "../../reporting/clients/EC3ConfigurationsClient";
import { EC3JobsClient } from "../../reporting/clients/EC3JobsClient";
import { EC3Job, EC3JobCreate, EC3JobStatus } from "../../reporting/interfaces/EC3Jobs";
use(chaiAsPromised);

describe("EC3JobsClient", () => {
  const configurationsClient: EC3ConfigurationsClient = new EC3ConfigurationsClient();
  const reportsClient: ReportsClient = new ReportsClient();
  const jobsClient: EC3JobsClient = new EC3JobsClient();

  let configurationId: string;
  let reportId: string;

  before(async () => {
    const newReport: ReportCreate = {
      displayName: "testReport",
      projectId,
    };
    const report = await reportsClient.createReport(accessToken, newReport);
    reportId = report.id;

    const material: EC3ConfigurationMaterial = {
      nameColumn: "materialName",
    };

    const label = {
      name: "name",
      reportTable: "table",
      elementNameColumn: "elementName",
      elementQuantityColumn: "elementQuantity",
      materials: [material],
    };

    const newConfig: EC3ConfigurationCreate = {
      reportId: report.id,
      displayName: "Test",
      labels: [label],
    };
    const config: EC3Configuration = await configurationsClient.createConfiguration(accessToken, newConfig);
    configurationId = config.id;
  });

  after(async () => {
    await configurationsClient.deleteConfiguration(accessToken, configurationId);
    await reportsClient.deleteReport(accessToken, reportId);
    await testIModelGroup.cleanupIModels();
  });

  it("jobs - run extraction and get status", async () => {
    const newJob: EC3JobCreate = {
      projectName: "test",
      ec3BearerToken: "no token :(",
      configurationId,
    };
    const job: EC3Job = await jobsClient.createJob(accessToken, newJob);
    expect(job).to.not.be.undefined;
    expect(job.id).to.not.be.undefined;

    const status: EC3JobStatus = await jobsClient.getEC3JobStatus(accessToken, job.id);
    expect(status).to.not.be.undefined;
    expect(["Failed", "Running", "Queued"]).to.include(status.status);
  });
});
