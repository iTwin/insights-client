/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Container } from "inversify";
import { BaseIntegrationTestsConfig, TestUtilBootstrapper, TestUtilTypes } from "../utils/imodels-client-test-utils/iModelsClientTestUtilsExports";
import { IModelsClientsTestsConfig } from "./IModelsClientsTestsConfig";
import "reflect-metadata";

let container: Container;
export function getTestDIContainer(): Container {
  if (container)
    return container;

  container = new Container();
  TestUtilBootstrapper.bind(container);
  container.bind<BaseIntegrationTestsConfig>(TestUtilTypes.BaseIntegrationTestsConfig).to(IModelsClientsTestsConfig).inSingletonScope();
  return container;
}