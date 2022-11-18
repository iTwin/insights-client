/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { EC3ConfigurationsClient } from "../reporting/clients/EC3ConfigurationsClient";
import { EC3Configuration, EC3ConfigurationCreate, EC3ConfigurationUpdate } from "../reporting/interfaces/EC3Configurations";
use(chaiAsPromised);

describe("EC3ConfigurationsClient", () => {
  const configurationsClient: EC3ConfigurationsClient = new EC3ConfigurationsClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(configurationsClient, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(configurationsClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("EC3ConfigurationsClient - change base path", async () => {
    const client = new EC3ConfigurationsClient("BASE");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(client, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(client, "createRequest" as any);

    const returns = {
      configuration: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    await client.getConfiguration("auth", "configurationId");
    expect(fetchStub.getCall(0).args[0].substring(0, 4)).to.be.eq("BASE");
  });

  it("Configurations - Get", async () => {
    const returns = {
      configuration: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    const configuration = await configurationsClient.getConfiguration("auth", "configurationId");
    expect(configuration.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/configurations/configurationId",
      "pass",
    )).to.be.true;
  });

  it("Configurations - Get all", async () => {
    const returns1 = {
      configurations: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      configurations: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/carbon-calculation/ec3/configurations?iTwinId=projectId", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const configurations: Array<EC3Configuration> = await configurationsClient.getConfigurations("auth", "projectId");
    expect(configurations.length).to.be.eq(4);
    expect(configurations[0]).to.be.eq(1);
    expect(configurations[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/configurations?iTwinId=projectId",
      "pass",
    )).to.be.true;
  });

  it("Configurations - Get all by page", async () => {
    const returns1 = {
      configurations: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      configurations: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/carbon-calculation/ec3/configurations?iTwinId=projectId", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const configurationIt = configurationsClient.getConfigurationsIterator("auth", "projectId").byPage();
    for await(const i of configurationIt) {
      expect(i.length).to.be.eq(2);
    }
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/configurations?iTwinId=projectId",
      "pass",
    )).to.be.true;
  });

  it("Configurations - get all with top", async () => {
    const returns1 = {
      configurations: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      configurations: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/carbon-calculation/ec3/configurations?iTwinId=projectId&$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const configurations: Array<EC3Configuration> = await configurationsClient.getConfigurations("auth", "projectId", 2);
    expect(configurations.length).to.be.eq(4);
    expect(configurations[0]).to.be.eq(1);
    expect(configurations[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/configurations?iTwinId=projectId&$top=2",
      "pass",
    )).to.be.true;
  });

  it("Configurations - Create", async () => {
    const newConfiguration: EC3ConfigurationCreate = {
      displayName: "Test",
      reportId: "id",
      labels: [{
        materials : [{
          nameColumn: "col",
        }],
        name: "name",
        reportTable: "table",
        elementQuantityColumn: "quantity",
        elementNameColumn: "name",
      }],
    };
    const returns = {
      configuration: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const configuration = await configurationsClient.createConfiguration("auth", newConfiguration);
    expect(configuration.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/configurations",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newConfiguration)
    )).to.be.true;
  });

  it("Configurations - Update", async () => {
    const newConfiguration: EC3ConfigurationUpdate = {
      displayName: "Test",
      description: "",
      labels: [{
        materials : [{
          nameColumn: "col",
        }],
        name: "name",
        reportTable: "table",
        elementQuantityColumn: "quantity",
        elementNameColumn: "name",
      }],
    };
    const returns = {
      configuration: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const configuration = await configurationsClient.updateConfiguration("auth", "configurationId", newConfiguration);
    expect(configuration.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/configurations/configurationId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PUT",
      "auth",
      JSON.stringify(newConfiguration)
    )).to.be.true;
  });

  it("Configurations - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    const configuration = await configurationsClient.deleteConfiguration("auth", "configurationId");
    expect(configuration.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/carbon-calculation/ec3/configurations/configurationId",
      "pass",
    )).to.be.true;
  });
});
