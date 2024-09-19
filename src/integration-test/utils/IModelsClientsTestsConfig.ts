/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as dotenv from "dotenv";
import { injectable } from "inversify";
import type { ApisConfigValues, AuthConfigValues, BaseIntegrationTestsConfig, BehaviorOptions, TestUsersConfigValues } from "../utils/imodels-client-test-utils/BaseIntegrationTestsConfig";
import { TestSetupError } from "../utils/imodels-client-test-utils/CommonTestUtils";
import { CARBON_CALCULATION_BASE_PATH, GROUPING_AND_MAPPING_BASE_PATH, NAMED_GROUPS_BASE_PATH, REPORTING_BASE_PATH } from "../../common/OperationsBase";

@injectable()
export class IModelsClientsTestsConfig implements BaseIntegrationTestsConfig {
  public readonly testITwinName: string;
  public readonly testIModelName: string;
  public readonly auth: AuthConfigValues;
  public readonly apis: ApisConfigValues;
  public readonly testUsers: TestUsersConfigValues;
  public readonly behaviorOptions: BehaviorOptions;

  constructor() {
    dotenv.config();
    this.validateAllValuesPresent();

    this.testITwinName = process.env.TEST_ITWIN_NAME ?? "";
    this.testIModelName = process.env.TEST_IMODEL_NAME ?? "";

    this.auth = {
      authority: process.env.AUTH_AUTHORITY ?? "",
      clientId: process.env.AUTH_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_CLIENT_SECRET ?? "",
      redirectUrl: process.env.AUTH_REDIRECT_URL ?? "",
      scopes: process.env.AUTH_SCOPES ?? "",
    };

    this.apis = {
      iModels: {
        baseUrl: process.env.APIS_IMODELS_BASE_URL ?? "",
        version: process.env.APIS_IMODELS_VERSION ?? "",
      },
      iTwins: {
        baseUrl: process.env.APIS_ITWINS_BASE_URL ?? "",
      },
      reporting: {
        baseUrl: process.env.APIS_REPORTING_BASE_URL ?? REPORTING_BASE_PATH,
      },
      carbonCalculation: {
        baseUrl: process.env.APIS_CARBONCALCULATION_BASE_URL ?? CARBON_CALCULATION_BASE_PATH,
      },
      groupingAndMapping: {
        baseUrl: process.env.APIS_GROUPING_AND_MAPPING_BASE_URL ?? GROUPING_AND_MAPPING_BASE_PATH,
      },
      namedGroups: {
        baseUrl: process.env.APIS_NAMED_GROUPS_BASE_URL ?? NAMED_GROUPS_BASE_PATH,
      },
    };

    this.testUsers = {
      admin1: {
        email: process.env.TEST_USERS_ADMIN1_EMAIL ?? "",
        password: process.env.TEST_USERS_ADMIN1_PASSWORD ?? "",
      },
    };

    this.behaviorOptions = {
      recreateReusableIModel: process.env?.TEST_BEHAVIOR_OPTIONS_RECREATE_IMODEL === "1",
    };
  }

  private validateAllValuesPresent(): void {
    this.validateConfigValue("TEST_ITWIN_NAME");
    this.validateConfigValue("TEST_IMODEL_NAME");

    this.validateConfigValue("AUTH_AUTHORITY");
    this.validateConfigValue("AUTH_CLIENT_ID");
    this.validateConfigValue("AUTH_CLIENT_SECRET");
    this.validateConfigValue("AUTH_REDIRECT_URL");
    this.validateConfigValue("AUTH_SCOPES");

    this.validateConfigValue("APIS_IMODELS_BASE_URL");
    this.validateConfigValue("APIS_IMODELS_VERSION");

    this.validateConfigValue("APIS_ITWINS_BASE_URL");

    this.validateConfigValue("APIS_REPORTING_BASE_URL");
    this.validateConfigValue("APIS_CARBONCALCULATION_BASE_URL");
    this.validateConfigValue("APIS_GROUPING_AND_MAPPING_BASE_URL");
    this.validateConfigValue("APIS_NAMED_GROUPS_BASE_URL");

    this.validateConfigValue("TEST_USERS_ADMIN1_EMAIL");
    this.validateConfigValue("TEST_USERS_ADMIN1_PASSWORD");
  }

  private validateConfigValue(key: string): void {
    if (!process.env[key]) {
      throw new TestSetupError(`Invalid configuration: missing ${key} value.`);
    }
  }
}
