/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { OCLCAJobsClient } from "../carbon-calculation/clients/OCLCAJobsClient";
import { OCLCAJobCreate } from "../carbon-calculation/interfaces/OCLCAJobs";
import { CarbonUploadState } from "../common/CarbonCalculation";
use(chaiAsPromised);

describe("OCLCAJobsClient", () => {
  const jobsClient: OCLCAJobsClient = new OCLCAJobsClient();
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

  it("OCLCAJobsClient - change base path", async () => {
    const client = new OCLCAJobsClient("BASE");
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
    await client.getOCLCAJobStatus("auth", "jobId");
    expect(fetchStub.getCall(0).args[0].substring(0, 4)).to.be.eq("BASE");
  });

  it("create job", async () => {
    const returns = {
      job: {
        id: 1,
      },
    };
    const newJob: OCLCAJobCreate = {
      reportId: "1234",
      token: "tOkeN",
    };
    fetchStub.resolves(returns);
    const job = await jobsClient.createJob("auth", newJob);
    expect(job.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/oneclicklca/jobs",
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
    const status = await jobsClient.getOCLCAJobStatus("auth", "jobId");
    expect(status.status).to.be.eq("Succeeded");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/oneclicklca/jobs/jobId",
      "pass",
    )).to.be.true;
  });
});
