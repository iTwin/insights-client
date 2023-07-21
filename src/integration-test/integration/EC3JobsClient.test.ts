/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { ReportCreate } from "../../reporting";
import "reflect-metadata";
import { accessToken, configurationsClient, jobsClient, iTwinId, reportsClient } from "../utils";
import { EC3Configuration, EC3ConfigurationCreate, EC3ConfigurationMaterial } from "../../carbon-calculation/interfaces/EC3Configurations";
import { EC3Job, EC3JobCreate, EC3JobStatus } from "../../carbon-calculation/interfaces/EC3Jobs";
use(chaiAsPromised);

describe("EC3JobsClient", () => {
  let configurationId: string;
  let reportId: string;

  before(async () => {
    const newReport: ReportCreate = {
      displayName: "testReport",
      projectId: iTwinId,
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
