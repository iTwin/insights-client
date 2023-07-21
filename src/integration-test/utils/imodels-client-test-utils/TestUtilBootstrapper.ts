/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { Container } from "inversify";
import type { IModelsClientOptions } from "@itwin/imodels-client-authoring";
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
import { TestITwinsClient } from "./test-context-providers/itwin/TestITwinsClient";
import { ITwinsClientConfig } from "./test-context-providers/itwin/ITwinsClientConfig";
import { TestITwinProvider } from "./test-context-providers/itwin/TestITwinProvider";
import { TestITwinProviderConfig } from "./test-context-providers/itwin/TestITwinProviderConfig";
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

    container.bind(ITwinsClientConfig).toSelf().inSingletonScope();
    container.bind(TestITwinsClient).toSelf().inSingletonScope();
    container.bind(TestITwinProviderConfig).toSelf().inSingletonScope();
    container.bind(TestITwinProvider).toSelf().inSingletonScope();

    container.bind<IModelsClientOptions>(testUtilTypes.iModelsClientOptions).to(TestIModelsClientOptions).inSingletonScope();
    container.bind(TestIModelsClient).toSelf().inSingletonScope();
    container.bind(ReusableTestIModelProviderConfig).toSelf().inSingletonScope();
    container.bind(ReusableTestIModelProvider).toSelf().inSingletonScope();
    container.bind(TestIModelCreator).toSelf().inSingletonScope();
    container.bind(TestIModelFileProvider).toSelf().inSingletonScope();
    container.bind(TestIModelRetriever).toSelf().inSingletonScope();
  }
}
