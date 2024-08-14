/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export interface AuthConfigValues {
  authority: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}

export interface ApiConfigValues {
  baseUrl: string;
  version?: string;
  scopes: string;
}

export interface ApisConfigValues {
  iTwins: ApiConfigValues;
  iModels: ApiConfigValues;
  reporting: ApiConfigValues;
  carbonCalculation: ApiConfigValues;
  groupingAndMapping: ApiConfigValues;
  namedGroups: ApiConfigValues;
}

export interface TestUserConfigValues {
  email: string;
  password: string;
}

export interface TestUsersConfigValues {
  admin1: TestUserConfigValues;
}

export interface BehaviorOptions {
  /**
   * Instructs the test setup to delete the existing reusable iModel and create a new one. Used
   * in scenarios there are new features added to the API and we want to update the reusable iModel have more configured properties.
   */
  recreateReusableIModel: boolean;
}

export interface BaseIntegrationTestsConfig {
  testITwinName: string;
  testIModelName: string;
  auth: AuthConfigValues;
  apis: ApisConfigValues;
  testUsers: TestUsersConfigValues;
  behaviorOptions: BehaviorOptions;
}
