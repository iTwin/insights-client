/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { EC3JobsClient } from "../carbon-calculation/clients/EC3JobsClient";
import { EC3ReportJobCreate } from "../carbon-calculation/interfaces/EC3Jobs";
import { CarbonUploadState } from "../common/CarbonCalculation";
use(chaiAsPromised);

describe("EC3JobsClient", () => {
  const jobsClient: EC3JobsClient = new EC3JobsClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(jobsClient, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(jobsClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("EC3JobsClient - change base path", async () => {
    const client = new EC3JobsClient("BASE");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(client, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(client, "createRequest" as any);

    const returns = {
      job: {
        status: CarbonUploadState.Succeeded,
      },
    };
    fetchStub.resolves(returns);
    await client.getEC3JobStatus("auth", "jobId");
    expect(fetchStub.getCall(0).args[0].substring(0, 4)).to.be.eq("BASE");
  });

  it("create job", async () => {
    const returns = {
      job: {
        id: 1,
      },
    };
    const newJob: EC3ReportJobCreate = {
      ec3BearerToken: "token",
      projectName: "project",
      configurationId: "123",
    };
    fetchStub.resolves(returns);
    const job = await jobsClient.createJob("auth", newJob);
    expect(job.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/jobs",
      "pass",
    )).to.be.true;
  });

  it("Get Status", async () => {
    const returns = {
      job: {
        status: CarbonUploadState.Succeeded,
      },
    };
    fetchStub.resolves(returns);
    const status = await jobsClient.getEC3JobStatus("auth", "jobId");
    expect(status.status).to.be.eq("Succeeded");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/jobs/jobId",
      "pass",
    )).to.be.true;
  });
});
