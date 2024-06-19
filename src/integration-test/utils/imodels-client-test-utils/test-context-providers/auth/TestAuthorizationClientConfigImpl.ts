import { inject, injectable } from "inversify";
import type { BaseIntegrationTestsConfig } from "../../BaseIntegrationTestsConfig";
import { testUtilTypes } from "../../TestUtilTypes";
import "reflect-metadata";

@injectable()
export class TestAuthorizationClientConfig {
  public authority: string;
  public clientId: string;
  public clientSecret: string;
  public redirectUrl: string;

  constructor(
  @inject(testUtilTypes.baseIntegrationTestsConfig)
    config: BaseIntegrationTestsConfig,
  ) {
    this.authority = config.auth.authority;
    this.clientId = config.auth.clientId;
    this.clientSecret = config.auth.clientSecret;
    this.redirectUrl = config.auth.redirectUrl;
  }
}
