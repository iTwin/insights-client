/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { Container } from "inversify";
import type { IModelsClientOptions } from "../imodels-client-authoring/IModelsClient";
import { TestAuthorizationClient } from "./test-context-providers/auth/TestAuthorizationClient";
import { TestAuthorizationClientConfig } from "./test-context-providers/auth/TestAuthorizationClientConfigImpl";
import { TestAuthorizationProvider } from "./test-context-providers/auth/TestAuthorizationProvider";
import { ReusableTestIModelProvider } from "./test-context-providers/imodel/ReusableTestIModelProvider";
import { ReusableTestIModelProviderConfig } from "./test-context-providers/imodel/ReusableTestIModelProviderConfig";
import { TestIModelCreator } from "./test-context-providers/imodel/TestIModelCreator";
import { TestIModelFileProvider } from "./test-context-providers/imodel/TestIModelFileProvider";
import { TestIModelRetriever } from "./test-context-providers/imodel/TestIModelRetriever";
import { TestIModelsClient } from "./test-context-providers/imodel/TestIModelsClient";
import { TestIModelsClientOptions } from "./test-context-providers/imodel/TestModelsClientOptions";
import { ProjectsClient } from "./test-context-providers/project/ProjectsClient";
import { ProjectsClientConfig } from "./test-context-providers/project/ProjectsClientConfig";
import { TestProjectProvider } from "./test-context-providers/project/TestProjectProvider";
import { TestProjectProviderConfig } from "./test-context-providers/project/TestProjectProviderConfig";
import { TestAuthorizationProviderConfig } from "./test-context-providers/auth/TestAuthorizationProviderConfig";
import { TestIModelGroupFactory } from "./test-imodel-group/TestIModelGroupFactory";
import { testUtilTypes } from "./TestUtilTypes";

export class TestUtilBootstrapper {
  public static bind(container: Container): void {
    TestUtilBootstrapper.bindContextProviders(container);
    container.bind(TestIModelGroupFactory).toSelf().inSingletonScope();
  }

  private static bindContextProviders(container: Container): void {
    container.bind(TestAuthorizationClientConfig).toSelf().inSingletonScope();
    container.bind(TestAuthorizationClient).toSelf().inSingletonScope();
    container.bind(TestAuthorizationProviderConfig).toSelf().inSingletonScope();
    container.bind(TestAuthorizationProvider).toSelf().inSingletonScope();

    container.bind(ProjectsClientConfig).toSelf().inSingletonScope();
    container.bind(ProjectsClient).toSelf().inSingletonScope();
    container.bind(TestProjectProviderConfig).toSelf().inSingletonScope();
    container.bind(TestProjectProvider).toSelf().inSingletonScope();

    container.bind<IModelsClientOptions>(testUtilTypes.iModelsClientOptions).to(TestIModelsClientOptions).inSingletonScope();
    container.bind(TestIModelsClient).toSelf().inSingletonScope();
    container.bind(ReusableTestIModelProviderConfig).toSelf().inSingletonScope();
    container.bind(ReusableTestIModelProvider).toSelf().inSingletonScope();
    container.bind(TestIModelCreator).toSelf().inSingletonScope();
    container.bind(TestIModelFileProvider).toSelf().inSingletonScope();
    container.bind(TestIModelRetriever).toSelf().inSingletonScope();
  }
}
