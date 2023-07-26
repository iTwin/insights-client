/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import "reflect-metadata";
import { accessToken, aggregationsClient, mappingsClient, testIModel } from "../utils";
import { AggregationPropertyCreate, AggregationPropertyType, AggregationPropertyUpdate, AggregationTableCreate, AggregationTableSetCreate, AggregationTableSetUpdate, AggregationTableUpdate, GroupCreate, MappingCreate } from "../../reporting";
use(chaiAsPromised);

describe("Aggregations Client", () => {

  let mappingId: string;
  let tablesetId: string;
  let tableId: string;
  let propertyId: string;
  let groupname: string;

  before(async () => {
    // create mappings for tests
    const newMapping: MappingCreate = {
      mappingName: "Test1",
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingId = mapping.id;

    const newGroup: GroupCreate = {
      groupName: "Test1",
      query: "select * from biscore.element limit 10",
    };
    const group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingId, newGroup);
    groupname = group.groupName;

    // create table sets for tests
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "TableSet1",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingId,
      datasourceType: "IModelMapping",
    };
    let tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    tablesetId = tableSet.id;

    newAggregationTableSet.tableSetName = "TableSet2";
    tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);

    newAggregationTableSet.tableSetName = "TableSet3";
    tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);

    // create tables for tests
    const newAggregationTable: AggregationTableCreate = {
      tableName: "Table1",
      description: "Aggregation of Group table.",
      sourceTableName: groupname,
    };
    let table = await aggregationsClient.createAggregationTable(accessToken, tablesetId, newAggregationTable);
    tableId = table.id;

    newAggregationTable.tableName = "Table2";
    table = await aggregationsClient.createAggregationTable(accessToken, tablesetId, newAggregationTable);

    newAggregationTable.tableName = "Table3";
    table = await aggregationsClient.createAggregationTable(accessToken, tablesetId, newAggregationTable);

    // create properties for tests
    const newAggregationProperty: AggregationPropertyCreate = {
      propertyName: "Test",
      sourcePropertyName: "ECClassId",
      type: "Count" as AggregationPropertyType,
    };
    let property = await aggregationsClient.createAggregationProperty(accessToken, tablesetId, tableId, newAggregationProperty);
    propertyId = property.id;

    newAggregationProperty.propertyName = "Property2";
    property = await aggregationsClient.createAggregationProperty(accessToken, tablesetId, tableId, newAggregationProperty);

    newAggregationProperty.propertyName = "Property3";
    property = await aggregationsClient.createAggregationProperty(accessToken, tablesetId, tableId, newAggregationProperty);
  });

  after(async () => {
    await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingId);
  });

  // aggregation table sets tests
  it("Aggregation Table Sets - Create and delete", async () => {
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "TableSet4",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingId,
      datasourceType: "IModelMapping",
    };
    const aggregationTableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    expect(aggregationTableSet).to.not.be.undefined;
    expect(aggregationTableSet.tableSetName).to.be.eq("TableSet4");

    const response = await aggregationsClient.deleteAggregationTableSet(accessToken, aggregationTableSet.id);
    expect(response.status).to.be.eq(204);
  });

  it("Aggregation Table Sets - Get", async () => {
    const aggregationTableSet = await aggregationsClient.getAggregationTableSet(accessToken, tablesetId);
    expect(aggregationTableSet).to.not.be.undefined;
    expect(aggregationTableSet.tableSetName).to.be.eq("TableSet1");
  });

  it("Aggregation Table Sets - Update", async () => {
    const newAggregationTableSet: AggregationTableSetUpdate = {
      description: "Updated",
    };
    const aggregationTableSet = await aggregationsClient.updateAggregationTableSet(accessToken, tablesetId, newAggregationTableSet);
    expect(aggregationTableSet).to.not.be.undefined;
    expect(aggregationTableSet.description).to.be.eq("Updated");
  });

  it("Aggregation Table Sets - Get all", async () => {
    const aggregationTableSets = await aggregationsClient.getAggregationTableSets(accessToken, mappingId, "IModelMapping");
    expect(aggregationTableSets).to.not.be.undefined;
    expect(aggregationTableSets.length).to.be.above(2);
    for(const tableset of aggregationTableSets) {
      expect(["TableSet1", "TableSet2", "TableSet3"]).to.include(tableset.tableSetName);
    }
  });

  it("Aggregation Table Sets - Get with iterator", async () => {
    const aggregationTableSetsIt = aggregationsClient.getAggregationTableSetsIterator(accessToken, mappingId, "IModelMapping", 2);
    let flag = false;
    for await(const tableset of aggregationTableSetsIt) {
      flag = true;
      expect(tableset).to.not.be.undefined;
      expect(["TableSet1", "TableSet2", "TableSet3"]).to.include(tableset.tableSetName);
    }
    expect(flag).to.be.true;
  });

  it("Aggregation Table Sets - Get pages", async () => {
    const aggregationTableSetsIt = aggregationsClient.getAggregationTableSetsIterator(accessToken, mappingId, "IModelMapping", 2);
    let elementCount = 0;
    let flag = false;
    for await(const tablesets of aggregationTableSetsIt.byPage()) {
      flag = true;
      expect(tablesets).to.not.be.undefined;
      if(tablesets.length) {
        for(const tableset of tablesets) {
          expect(["TableSet1", "TableSet2", "TableSet3"]).to.include(tableset.tableSetName);
        }
        elementCount += tablesets.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // aggregation tables tests
  it("Aggregation Tables - Create and delete", async () => {
    const newGroup: GroupCreate = {
      groupName: "Test1",
      query: "select * from biscore.element limit 10",
    };
    const group = await mappingsClient.createGroup(accessToken, testIModel.id, mappingId, newGroup);

    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "TableSet1",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingId,
      datasourceType: "IModelMapping",
    };
    const tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);

    const newAggregationTable: AggregationTableCreate = {
      tableName: "Table5",
      description: "Aggregation of Group table.",
      sourceTableName: group.groupName,
    };
    const table = await aggregationsClient.createAggregationTable(accessToken, tableSet.id, newAggregationTable);
    expect(table).to.not.be.undefined;
    expect(table.tableName).to.be.eq("Table5");

    const response = await aggregationsClient.deleteAggregationTable(accessToken, tableSet.id, table.id);
    expect(response.status).to.be.eq(204);
  });

  it("Aggregation Tables - Get", async () => {
    const aggregationTable = await aggregationsClient.getAggregationTable(accessToken, tablesetId, tableId);
    expect(aggregationTable).to.not.be.undefined;
    expect(aggregationTable.tableName).to.be.eq("Table1");
  });

  it("Aggregation Tables - Update", async () => {
    const newAggregationTable: AggregationTableUpdate = {
      description: "Updated",
    };
    const aggregationTable = await aggregationsClient.updateAggregationTable(accessToken, tablesetId, tableId, newAggregationTable);
    expect(aggregationTable).to.not.be.undefined;
    expect(aggregationTable.description).to.be.eq("Updated");
  });

  it("Aggregation Tables - Get all", async () => {
    const aggregationTables = await aggregationsClient.getAggregationTables(accessToken, tablesetId);
    expect(aggregationTables).to.not.be.undefined;
    expect(aggregationTables.length).to.be.above(2);
    for(const table of aggregationTables) {
      expect(["Table1", "Table2", "Table3"]).to.include(table.tableName);
    }
  });

  it("Aggregation Tables - Get with iterator", async () => {
    const aggregationTablesIt = aggregationsClient.getAggregationTablesIterator(accessToken, tablesetId, 2);
    let flag = false;
    for await(const table of aggregationTablesIt) {
      flag = true;
      expect(table).to.not.be.undefined;
      expect(["Table1", "Table2", "Table3"]).to.include(table.tableName);
    }
    expect(flag).to.be.true;
  });

  it("Aggregation Tables - Get pages", async () => {
    const aggregationTablesIt = aggregationsClient.getAggregationTablesIterator(accessToken, tablesetId, 2);
    let elementCount = 0;
    let flag = false;
    for await(const tables of aggregationTablesIt.byPage()) {
      flag = true;
      expect(tables).to.not.be.undefined;
      if(tables.length) {
        for(const table of tables) {
          expect(["Table1", "Table2", "Table3"]).to.include(table.tableName);
        }
        elementCount += tables.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });

  // aggregation properties tests
  it("Aggregation Properties - Create and delete", async () => {
    const newAggregationProperty: AggregationPropertyCreate = {
      propertyName: "Property5",
      sourcePropertyName: "ECClassId",
      type: "Count" as AggregationPropertyType,
    };
    const property = await aggregationsClient.createAggregationProperty(accessToken, tablesetId, tableId, newAggregationProperty);
    expect(property).to.not.be.undefined;
    expect(property.propertyName).to.be.eq("Property5");

    const response = await aggregationsClient.deleteAggregationProperty(accessToken, tablesetId, tableId, property.id);
    expect(response.status).to.be.eq(204);
  });

  it("Aggregation Properties - Get", async () => {
    const aggregationProperty = await aggregationsClient.getAggregationProperty(accessToken, tablesetId, tableId, propertyId);
    expect(aggregationProperty).to.not.be.undefined;
    expect(aggregationProperty.propertyName).to.be.eq("Test");
  });

  it("Aggregation Properties - Update", async () => {
    const newAggregationProperty: AggregationPropertyUpdate = {
      propertyName: "Property1",
    };
    const aggregationProperty = await aggregationsClient.updateAggregationProperty(accessToken, tablesetId, tableId, propertyId, newAggregationProperty);
    expect(aggregationProperty).to.not.be.undefined;
    expect(aggregationProperty.propertyName).to.be.eq("Property1");
  });

  it("Aggregation Properties - Get all", async () => {
    const aggregationProperties = await aggregationsClient.getAggregationProperties(accessToken, tablesetId, tableId);
    expect(aggregationProperties).to.not.be.undefined;
    expect(aggregationProperties.length).to.be.above(2);
    for(const report of aggregationProperties) {
      expect(["Property1", "Property2", "Property3"]).to.include(report.propertyName);
    }
  });

  it("Aggregation Properties - Get with iterator", async () => {
    const aggregationPropertiesIt = aggregationsClient.getAggregationPropertiesIterator(accessToken, tablesetId, tableId, 2);
    let flag = false;
    for await(const property of aggregationPropertiesIt) {
      flag = true;
      expect(property).to.not.be.undefined;
      expect(["Property1", "Property2", "Property3"]).to.include(property.propertyName);
    }
    expect(flag).to.be.true;
  });

  it("Aggregation Properties - Get pages", async () => {
    const aggregationPropertiesIt = aggregationsClient.getAggregationPropertiesIterator(accessToken, tablesetId, tableId, 2);
    let elementCount = 0;
    let flag = false;
    for await(const properties of aggregationPropertiesIt.byPage()) {
      flag = true;
      expect(properties).to.not.be.undefined;
      if(properties.length) {
        for(const property of properties) {
          expect(["Property1", "Property2", "Property3"]).to.include(property.propertyName);
        }
        elementCount += properties.length;
      }
    }
    expect(flag).to.be.true;
    expect(elementCount).to.not.be.eq(0);
  });
});
