/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import "reflect-metadata";
import { accessToken, projectId, testIModelGroup } from "../utils";
import { ReportCreate, ReportsClient } from "../../reporting";
import { EC3ConfigurationsClient } from "../../reporting/clients/EC3ConfigurationsClient";
import { EC3Configuration, EC3ConfigurationCreate, EC3ConfigurationLabel, EC3ConfigurationMaterial, EC3ConfigurationUpdate } from "../../reporting/interfaces/EC3Configurations";
use(chaiAsPromised);

describe("EC3ConfigurationsClient", () => {
  const configurationsClient: EC3ConfigurationsClient = new EC3ConfigurationsClient();
  const reportsClient: ReportsClient = new ReportsClient();

  const configurationIds: Array<string> = [];
  let reportId: string;

  let label: EC3ConfigurationLabel;

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

    label = {
      name: "name",
      reportTable: "table",
      elementNameColumn: "elementName",
      elementQuantityColumn: "elementQuantity",
      materials: [material],
    };

    const newConfig: EC3ConfigurationCreate = {
      reportId: report.id,
      displayName: "Test1",
      labels: [label],
    };
    let config: EC3Configuration = await configurationsClient.createConfiguration(accessToken, newConfig);
    configurationIds.push(config.id);

    newConfig.displayName = "Test2";
    config = await configurationsClient.createConfiguration(accessToken, newConfig);
    configurationIds.push(config.id);

    newConfig.displayName = "Test3";
    config = await configurationsClient.createConfiguration(accessToken, newConfig);
    configurationIds.push(config.id);
  });

  after(async () => {
    while(configurationIds.length > 0) {
      await configurationsClient.deleteConfiguration(accessToken, configurationIds.pop()!);
    }
    await reportsClient.deleteReport(accessToken, reportId);
    await testIModelGroup.cleanupIModels();
  });

  it("Configurations - create and delete", async () => {
    const newConfig: EC3ConfigurationCreate = {
      reportId,
      displayName: "TestConfig",
      labels: [label],
    };
    const config = await configurationsClient.createConfiguration(accessToken, newConfig);
    expect(config).to.not.be.undefined;
    expect(config.displayName).to.be.eq("TestConfig");

    const response = await configurationsClient.deleteConfiguration(accessToken, config.id);
    expect(response.status).to.be.eq(204);
  });

  it("Configurations - Update", async () => {
    const configUpdate: EC3ConfigurationUpdate = {
      displayName: "Test1",
      description: "Updated description",
      labels: [label],
    };
    const config = await configurationsClient.updateConfiguration(accessToken, configurationIds[0], configUpdate);
    expect(config).to.not.be.undefined;
    expect(config.displayName).to.be.eq("Test1");
    expect(config.description).to.be.eq("Updated description");
  });

  it("Configurations - Get", async () => {
    const config = await configurationsClient.getConfiguration(accessToken, configurationIds[0]);
    expect(config).to.not.be.undefined;
    expect(config.displayName).to.be.eq("Test1");
  });

  it("Configurations - Get all", async () => {
    const configs = await configurationsClient.getConfigurations(accessToken, projectId);
    expect(configs).to.not.be.undefined;
    expect(configs.length).to.be.above(2);
    for(const config of configs) {
      expect(["Test1", "Test2", "Test3"]).to.include(config.displayName);
    }
  });

  it("Configurations - Get all with top", async () => {
    const configs = await configurationsClient.getConfigurations(accessToken, projectId, 2);
    expect(configs).to.not.be.undefined;
    expect(configs.length).to.be.above(2);
    for(const config of configs) {
      expect(["Test1", "Test2", "Test3"]).to.include(config.displayName);
    }
  });

  it("Configurations - Get with iterator", async () => {
    const confingsIt = configurationsClient.getConfigurationsIterator(accessToken, projectId, 2);
    let flag = false;
    for await(const config of confingsIt) {
      flag = true;
      expect(config).to.not.be.undefined;
      expect(["Test1", "Test2", "Test3"]).to.include(config.displayName);
    }
    expect(flag).to.be.true;
  });

  it("Configurations - Get pages with iterator", async () => {
    const configsIt = configurationsClient.getConfigurationsIterator(accessToken, projectId, 2);
    let elementCount = 0;
    let flag = false;
    for await(const configs of configsIt.byPage()) {
      flag = true;
      expect(configs).to.not.be.undefined;
      if(configs.length) {
        for(const config of configs) {
          expect(["Test1", "Test2", "Test3"]).to.include(config.displayName);
        }
        elementCount += configs.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });
});
