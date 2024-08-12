/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { testUtilTypes } from "./imodels-client-test-utils/TestUtilTypes";
import { ReusableIModelMetadata } from "./imodels-client-test-utils/test-context-providers/imodel/TestIModelInterfaces";
import { cleanupDirectory, createDirectory, createGuidValue } from "./imodels-client-test-utils/CommonTestUtils";
import { TestAuthorizationProvider } from "./imodels-client-test-utils/test-context-providers/auth/TestAuthorizationProvider";
import { ReusableTestIModelProvider } from "./imodels-client-test-utils/test-context-providers/imodel/ReusableTestIModelProvider";
import { TestITwinProvider } from "./imodels-client-test-utils/test-context-providers/itwin/TestITwinProvider";
import { TestConstants } from "./Constants";
import { getTestDIContainer } from "./TestDiContainerProvider";
import { ODataClient } from "../../reporting/clients/ODataClient";
import { ReportsClient } from "../../reporting/clients/ReportsClient";
import { BaseIntegrationTestsConfig } from "../utils/imodels-client-test-utils/BaseIntegrationTestsConfig";
import { EC3ConfigurationsClient } from "../../carbon-calculation/clients/EC3ConfigurationsClient";
import { EC3JobsClient } from "../../carbon-calculation/clients/EC3JobsClient";
import { AggregationsClient } from "../../reporting/clients/AggregationsClient";
import { MappingsClient } from "../../grouping-and-mapping/clients/MappingsClient";
import { GroupsClient } from "../../grouping-and-mapping/clients/GroupsClient";
import { PropertiesClient } from "../../grouping-and-mapping/clients/PropertiesClient";
import { CDMClient } from "../../grouping-and-mapping/clients/CDMClient";
import { ExtractionClient } from "../../grouping-and-mapping/clients/ExtractionClient";
import { AuditTrailClient } from "../../grouping-and-mapping/clients/AuditTrailClient";

let testRunId: string;
export function getTestRunId(): string {
  if (!testRunId) {
    testRunId = createGuidValue();
  }
  return testRunId;
}

export let accessToken: string;
export let testIModel: ReusableIModelMetadata;
export let iTwinId: string;
export let reportsClient: ReportsClient;
export let configurationsClient: EC3ConfigurationsClient;
export let jobsClient: EC3JobsClient;
export let extractionClient: ExtractionClient;
export let mappingsClient: MappingsClient;
export let groupsClient: GroupsClient;
export let propertiesClient: PropertiesClient;
export let oDataClient: ODataClient;
export let aggregationsClient: AggregationsClient;
export let cdmClient: CDMClient;
export let auditTrailClient: AuditTrailClient;

export async function mochaGlobalSetup() {
  createDirectory(TestConstants.testDownloadDirectoryPath);
  cleanupDirectory(TestConstants.testDownloadDirectoryPath);

  const container = getTestDIContainer();

  const authorizationProvider = container.get(TestAuthorizationProvider);
  const authorization = authorizationProvider.getAdmin1Authorization();
  accessToken = `Bearer ${(await authorization()).token}`;

  const testITwinProvider = container.get(TestITwinProvider);
  iTwinId = await testITwinProvider.getOrCreate();

  const reusableTestIModelProvider = container.get(ReusableTestIModelProvider);
  testIModel = await reusableTestIModelProvider.getOrCreate();

  const config: BaseIntegrationTestsConfig = container.get(testUtilTypes.baseIntegrationTestsConfig);
  reportsClient = new ReportsClient(config.apis.reporting.baseUrl);
  configurationsClient = new EC3ConfigurationsClient(config.apis.carbonCalculation.baseUrl);
  jobsClient = new EC3JobsClient(config.apis.carbonCalculation.baseUrl);
  extractionClient = new ExtractionClient(config.apis.groupingAndMapping.baseUrl);
  mappingsClient = new MappingsClient(config.apis.groupingAndMapping.baseUrl);
  groupsClient = new GroupsClient(config.apis.groupingAndMapping.baseUrl);
  propertiesClient = new PropertiesClient(config.apis.groupingAndMapping.baseUrl);
  cdmClient = new CDMClient(config.apis.groupingAndMapping.baseUrl);
  auditTrailClient = new AuditTrailClient(config.apis.groupingAndMapping.baseUrl);
  oDataClient = new ODataClient(config.apis.reporting.baseUrl);
  aggregationsClient = new AggregationsClient(config.apis.reporting.baseUrl);
}

export async function mochaGlobalTeardown() {
  cleanupDirectory(TestConstants.testDownloadDirectoryPath);
}
