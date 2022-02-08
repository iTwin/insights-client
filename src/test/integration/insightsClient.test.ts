/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import type { AccessToken } from "@itwin/core-bentley";
import { TestConfig } from "../TestConfig";
import type { Project } from "@itwin/projects-client";
import { ProjectsAccessClient } from "@itwin/projects-client";

chai.should();
describe("ProjectsClient", () => {
  let accessToken: AccessToken;

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of projects", async () => {
    const projectsAccessClient = new ProjectsAccessClient();
    const projectList: Project[] = await projectsAccessClient.getAll(accessToken);
    chai.expect(projectList).to.be.not.empty;
  });
});
