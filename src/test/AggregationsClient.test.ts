/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import { AggregationsClient } from "../reporting/clients/AggregationsClient";
import { AggregationProperty, AggregationPropertyCreate, AggregationPropertyType, AggregationPropertyUpdate, AggregationTable, AggregationTableCreate, AggregationTableSet, AggregationTableSetCreate, AggregationTableSetUpdate, AggregationTableUpdate } from "../reporting/interfaces/AggregationProperties";
use(chaiAsPromised);

describe("Aggregations Client", () => {
  const aggregationsClient: AggregationsClient = new AggregationsClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(aggregationsClient, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(aggregationsClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("AggregationsClient - change base path", async () => {
    const client = new AggregationsClient("BASE");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchStub = sinon.stub(client, "fetchJSON" as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestStub = sinon.stub(client, "createRequest" as any);

    const returns = {
      report: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    await client.getAggregationTableSet("auth", "aggregationTableSetId");
    expect(fetchStub.getCall(0).args[0].substring(0, 4)).to.be.eq("BASE");
  });

  it("Aggregation Table Set - Get", async () => {
    const returns = {
      aggregationTableSet: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    const aggregationTableSet = await aggregationsClient.getAggregationTableSet("auth", "aggregationTableSetId");
    expect(aggregationTableSet.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Table Set - Get all", async () => {
    const returns1 = {
      aggregationTableSets: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      aggregationTableSets: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/aggregations?datasourceId=datasourceId&datasourceType=datasourceType", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const aggregationTableSets: Array<AggregationTableSet> = await aggregationsClient.getAggregationTableSets("auth", "datasourceId", "datasourceType");
    expect(aggregationTableSets.length).to.be.eq(4);
    expect(aggregationTableSets[0]).to.be.eq(1);
    expect(aggregationTableSets[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations?datasourceId=datasourceId&datasourceType=datasourceType",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Table Set - Get all with top", async () => {
    const returns1 = {
      aggregationTableSets: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      aggregationTableSets: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/aggregations?datasourceId=datasourceId&datasourceType=datasourceType&$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const aggregationTableSets: Array<AggregationTableSet> = await aggregationsClient.getAggregationTableSets("auth", "datasourceId", "datasourceType", 2);
    expect(aggregationTableSets.length).to.be.eq(4);
    expect(aggregationTableSets[0]).to.be.eq(1);
    expect(aggregationTableSets[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations?datasourceId=datasourceId&datasourceType=datasourceType&$top=2",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Table Set - Create", async () => {
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "AggregationTableSet_name",
      description: "AggregationTableSet for a mapping",
      datasourceId: "1",
      datasourceType: "IModelMapping",
    };
    const returns = {
      aggregationTableSet: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const aggregationTableSet = await aggregationsClient.createAggregationTableSet("auth", newAggregationTableSet);
    expect(aggregationTableSet.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newAggregationTableSet),
    )).to.be.true;
  });

  it("Aggregation Table Set - Update", async () => {
    const newAggregationTableSet: AggregationTableSetUpdate = {
      tableSetName: "AggregationTableSet_name",
    };
    const returns = {
      aggregationTableSet: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const aggregationTableSet = await aggregationsClient.updateAggregationTableSet("auth", "aggregationTableSetId", newAggregationTableSet);
    expect(aggregationTableSet.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "auth",
      JSON.stringify(newAggregationTableSet),
    )).to.be.true;
  });

  it("Aggregation Table Set - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    const aggregationTableSet = await aggregationsClient.deleteAggregationTableSet("auth", "aggregationTableSetId");
    expect(aggregationTableSet.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Table - Get", async () => {
    const returns = {
      aggregationTable: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    const aggregationTable = await aggregationsClient.getAggregationTable("auth", "aggregationTableSetId", "aggregationTableId");
    expect(aggregationTable.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Table- Get all", async () => {
    const returns1 = {
      aggregationTables: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      aggregationTables: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const aggregationTables: Array<AggregationTable> = await aggregationsClient.getAggregationTables("auth", "aggregationTableSetId");
    expect(aggregationTables.length).to.be.eq(4);
    expect(aggregationTables[0]).to.be.eq(1);
    expect(aggregationTables[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Table - Get all with top", async () => {
    const returns1 = {
      aggregationTables: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      aggregationTables: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const aggregationTables: Array<AggregationTable> = await aggregationsClient.getAggregationTables("auth", "aggregationTableSetId", 2);
    expect(aggregationTables.length).to.be.eq(4);
    expect(aggregationTables[0]).to.be.eq(1);
    expect(aggregationTables[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables?$top=2",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Table - Create", async () => {
    const newAggregationTable: AggregationTableCreate = {
      tableName: "AggregationTable_name",
      description: "Aggregation of Group table `Group1`.",
      sourceTableName: "SampleGroup",
    };
    const returns = {
      aggregationTable: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const aggregationTable = await aggregationsClient.createAggregationTable("auth", "aggregationTableSetId", newAggregationTable);
    expect(aggregationTable.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newAggregationTable),
    )).to.be.true;
  });

  it("Aggregation Table - Update", async () => {
    const newAggregationTable: AggregationTableUpdate = {
      tableName: "AggregationTable_updated",
      description: "Updated aggregation of Group table `Group1`.",
      sourceTableName: "SampleGroup",
    };
    const returns = {
      aggregationTable: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const aggregationTable = await aggregationsClient.updateAggregationTable("auth", "aggregationTableSetId", "aggregationTableId", newAggregationTable);
    expect(aggregationTable.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "auth",
      JSON.stringify(newAggregationTable),
    )).to.be.true;
  });

  it("Aggregation Table - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    const aggregationTable = await aggregationsClient.deleteAggregationTable("auth", "aggregationTableSetId", "aggregationTableId");
    expect(aggregationTable.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Property - Get", async () => {
    const returns = {
      aggregationProperty: {
        id: 1,
      },
    };
    fetchStub.resolves(returns);
    const aggregationProperty = await aggregationsClient.getAggregationProperty("auth", "aggregationTableSetId", "aggregationTableId", "aggregationPropertyId");
    expect(aggregationProperty.id).to.be.eq(1);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId/properties/aggregationPropertyId",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Property - Get all", async () => {
    const returns1 = {
      aggregationProperties: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      aggregationProperties: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId/properties", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const aggregationProperties: Array<AggregationProperty> = await aggregationsClient.getAggregationProperties("auth", "aggregationTableSetId", "aggregationTableId");
    expect(aggregationProperties.length).to.be.eq(4);
    expect(aggregationProperties[0]).to.be.eq(1);
    expect(aggregationProperties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId/properties",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Property - Get all with top", async () => {
    const returns1 = {
      aggregationProperties: [1, 2],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: {
          href: "url",
        },
      },
    };
    const returns2 = {
      aggregationProperties: [3, 4],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        next: undefined,
      },
    };
    fetchStub.withArgs("https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId/properties/?$top=2", "pass").resolves(returns1)
      .withArgs("url", "pass").resolves(returns2);

    const aggregationProperties: Array<AggregationProperty> = await aggregationsClient.getAggregationProperties("auth", "aggregationTableSetId", "aggregationTableId", 2);
    expect(aggregationProperties.length).to.be.eq(4);
    expect(aggregationProperties[0]).to.be.eq(1);
    expect(aggregationProperties[3]).to.be.eq(4);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId/properties/?$top=2",
      "pass",
    )).to.be.true;
  });

  it("Aggregation Property - Create", async () => {
    const newAggregationProperty: AggregationPropertyCreate = {
      propertyName: "RowCount",
      sourcePropertyName: "ECClassId",
      type: "Count" as AggregationPropertyType ?? AggregationPropertyType.Undefined,
    };
    const returns = {
      aggregationProperty: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const aggregationProperty = await aggregationsClient.createAggregationProperty("auth", "aggregationTableSetId", "aggregationTableId", newAggregationProperty);
    expect(aggregationProperty.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId/properties",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "auth",
      JSON.stringify(newAggregationProperty),
    )).to.be.true;
  });

  it("Aggregation Property - Update", async () => {
    const newAggregationProperty: AggregationPropertyUpdate = {
      propertyName: "RowCount",
      sourcePropertyName: "ECClassId",
      type: "Count" as AggregationPropertyType ?? AggregationPropertyType.Undefined,
    };
    const returns = {
      aggregationProperty: {
        id: "1",
      },
    };
    fetchStub.resolves(returns);
    const aggregationProperty = await aggregationsClient.updateAggregationProperty("auth", "aggregationTableSetId", "aggregationTableId", "aggregationPropertyId", newAggregationProperty);
    expect(aggregationProperty.id).to.be.eq("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId/properties/aggregationPropertyId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "auth",
      JSON.stringify(newAggregationProperty),
    )).to.be.true;
  });

  it("Aggregation Property - Delete", async () => {
    const returns = {
      status: 200,
    };
    fetchStub.resolves(returns);
    const aggregationProperty = await aggregationsClient.deleteAggregationProperty("auth", "aggregationTableSetId", "aggregationTableId", "aggregationPropertyId");
    expect(aggregationProperty.status).to.be.eq(200);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/insights/reporting/datasources/aggregations/aggregationTableSetId/tables/aggregationTableId/properties/aggregationPropertyId",
      "pass",
    )).to.be.true;
  });
});
