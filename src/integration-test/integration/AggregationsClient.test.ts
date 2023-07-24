/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import "reflect-metadata";
import { accessToken, testIModel, testIModelGroup } from "../utils";
import { AggregationPropertyCreate, AggregationPropertyType, AggregationPropertyUpdate, AggregationsClient, AggregationTableCreate, AggregationTableSetCreate, AggregationTableSetUpdate, AggregationTableUpdate, MappingCreate, MappingsClient } from "../../reporting";
use(chaiAsPromised);

describe("Aggregations Client", () => {
  const aggregationsClient: AggregationsClient = new AggregationsClient();
  const mappingsClient: MappingsClient = new MappingsClient();

  const mappingIds: Array<string> = [];
  const tablesetIds: Array<string> = [];
  const tableIds: Array<string> = [];
  const propertyIds: Array<string> = [];

  before(async () => {
    // create mappings for tests
    const newMapping: MappingCreate = {
      mappingName: "Test1",
    };
    let mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test2";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);

    newMapping.mappingName = "Test3";
    mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);

    // create table sets for tests
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "TableSet1",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingIds[mappingIds.length - 3],
      datasourceType: "IModelMapping",
    };
    let tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    tablesetIds.push(tableSet.id);

    newAggregationTableSet.tableSetName = "TableSet2";
    newAggregationTableSet.datasourceId = mappingIds[mappingIds.length - 2];
    tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    tablesetIds.push(tableSet.id);

    newAggregationTableSet.tableSetName = "TableSet3";
    newAggregationTableSet.datasourceId = mappingIds[mappingIds.length - 1];
    tableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    tablesetIds.push(tableSet.id);

    // create tables for tests
    const newAggregationTable: AggregationTableCreate = {
      tableName: "Table1",
      description: "Aggregation of Group table.",
      sourceTableName: "SampleGroupName",
    };
    let table = await aggregationsClient.createAggregationTable(accessToken, tablesetIds[tablesetIds.length - 3], newAggregationTable);
    tableIds.push(table.id);

    newAggregationTable.tableName = "Table2";
    table = await aggregationsClient.createAggregationTable(accessToken, tablesetIds[tablesetIds.length - 2], newAggregationTable);
    tableIds.push(table.id);

    newAggregationTable.tableName = "Table3";
    table = await aggregationsClient.createAggregationTable(accessToken, tablesetIds[tablesetIds.length - 1], newAggregationTable);
    tableIds.push(table.id);

    // create properties for tests
    const newAggregationProperty: AggregationPropertyCreate = {
      propertyName: "Property1",
      sourcePropertyName: "SamplePropertyName",
      type: "Count" as AggregationPropertyType ?? AggregationPropertyType.Undefined,
    };
    let property = await aggregationsClient.createAggregationProperty(accessToken, tablesetIds[tablesetIds.length - 3], tableIds[tableIds.length - 3], newAggregationProperty);
    propertyIds.push(property.id);

    newAggregationTable.tableName = "Property2";
    property = await aggregationsClient.createAggregationProperty(accessToken, tablesetIds[tablesetIds.length - 2], tableIds[tableIds.length - 2], newAggregationProperty);
    propertyIds.push(property.id);

    newAggregationTable.tableName = "Property3";
    property = await aggregationsClient.createAggregationProperty(accessToken, tablesetIds[tablesetIds.length - 1], tableIds[tableIds.length - 1], newAggregationProperty);
    propertyIds.push(property.id);
  });

  after(async () => {
    while(mappingIds.length > 0) {
      await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop()!);
    }
    while(tablesetIds.length > 0) {
      await aggregationsClient.deleteAggregationTableSet(accessToken, tablesetIds.pop()!);
    }
    await testIModelGroup.cleanupIModels();
  });

  // aggregation table sets tests
  it("Aggregation Table Sets - Create and delete", async () => {
    const newMapping: MappingCreate = {
      mappingName: "Test4",
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "AggregationTableSet_name",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingIds[mappingIds.length - 1],
      datasourceType: "IModelMapping",
    };
    const aggregationTableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    expect(aggregationTableSet).to.not.be.undefined;
    expect(aggregationTableSet.tableSetName).to.be.eq("AggregationTableSet_name");
    tablesetIds.push(aggregationTableSet.id);

    let response: Response;
    response = await aggregationsClient.deleteAggregationTableSet(accessToken, tablesetIds.pop()!);
    expect(response.status).to.be.eq(204);
    response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop()!);
    expect(response.status).to.be.eq(204);
  });

  it("Aggregation Table Sets - Get", async () => {
    const aggregationTableSet = await aggregationsClient.getAggregationTableSet(accessToken, tablesetIds[0]);
    expect(aggregationTableSet).to.not.be.undefined;
    expect(aggregationTableSet.tableSetName).to.be.eq("TableSet1");
  });

  it("Aggregation Table Sets - Update", async () => {
    const newAggregationTableSet: AggregationTableSetUpdate = {
      description: "Updated",
    };
    const aggregationTableSet = await aggregationsClient.updateAggregationTableSet(accessToken, tablesetIds[0], newAggregationTableSet);
    expect(aggregationTableSet).to.not.be.undefined;
    expect(aggregationTableSet.description).to.be.eq("Updated");
  });

  it("Aggregation Table Sets - Get all", async () => {
    const aggregationTableSets = await aggregationsClient.getAggregationTableSets(accessToken, tablesetIds[0], "IModelMapping");
    expect(aggregationTableSets).to.not.be.undefined;
    expect(aggregationTableSets.length).to.be.above(2);
    for(const tableset of aggregationTableSets) {
      expect(["TableSet1", "TableSet2", "TableSet3"]).to.include(tableset.tableSetName);
    }
  });

  it("Aggregation Table Sets - Get with iterator", async () => {
    const aggregationTableSetsIt = aggregationsClient.getAggregationTableSetsIterator(accessToken, tablesetIds[0], "IModelMapping", 2);
    let flag = false;
    for await(const tableset of aggregationTableSetsIt) {
      flag = true;
      expect(tableset).to.not.be.undefined;
      expect(["TableSet1", "TableSet2", "TableSet3"]).to.include(tableset.tableSetName);
    }
    expect(flag).to.be.true;
  });

  it("Aggregation Table Sets - Get pages", async () => {
    const aggregationTableSetsIt = aggregationsClient.getAggregationTableSetsIterator(accessToken, tablesetIds[0], "IModelMapping", 2);
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
    const newMapping: MappingCreate = {
      mappingName: "Test4",
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "AggregationTableSet_name",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingIds[mappingIds.length - 1],
      datasourceType: "IModelMapping",
    };
    const aggregationTableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    expect(aggregationTableSet).to.not.be.undefined;
    expect(aggregationTableSet.tableSetName).to.be.eq("AggregationTableSet_name");
    tablesetIds.push(aggregationTableSet.id);
    const newAggregationTable: AggregationTableCreate = {
      tableName: "AggregationTable_name",
      description: "Aggregation of Group table `Group1`.",
      sourceTableName: "SampleGroup",
    };
    const aggregationTable = await aggregationsClient.createAggregationTable(accessToken, tablesetIds[tablesetIds.length - 1], newAggregationTable);
    expect(aggregationTable).to.not.be.undefined;
    expect(aggregationTable.tableName).to.be.eq("AggregationTable_name");
    tableIds.push(aggregationTable.id);

    let response: Response;
    response = await aggregationsClient.deleteAggregationTable(accessToken, tablesetIds[tablesetIds.length - 1], tableIds.pop()!);
    expect(response.status).to.be.eq(204);
    response = await aggregationsClient.deleteAggregationTableSet(accessToken, tablesetIds.pop()!);
    expect(response.status).to.be.eq(204);
    response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop()!);
    expect(response.status).to.be.eq(204);
  });

  it("Aggregation Tables - Get", async () => {
    const aggregationTable = await aggregationsClient.getAggregationTable(accessToken, tablesetIds[0], tableIds[0]);
    expect(aggregationTable).to.not.be.undefined;
    expect(aggregationTable.tableName).to.be.eq("Table1");
  });

  it("Aggregation Tables - Update", async () => {
    const newAggregationTable: AggregationTableUpdate = {
      description: "Updated",
    };
    const aggregationTable = await aggregationsClient.updateAggregationTable(accessToken, tablesetIds[0], tableIds[0], newAggregationTable);
    expect(aggregationTable).to.not.be.undefined;
    expect(aggregationTable.description).to.be.eq("Updated");
  });

  it("Aggregation Tables - Get all", async () => {
    const aggregationTables = await aggregationsClient.getAggregationTables(accessToken, tablesetIds[0]);
    expect(aggregationTables).to.not.be.undefined;
    expect(aggregationTables.length).to.be.above(2);
    for(const table of aggregationTables) {
      expect(["Table1", "Table2", "Table3"]).to.include(table.tableName);
    }
  });

  it("Aggregation Tables - Get with iterator", async () => {
    const aggregationTablesIt = aggregationsClient.getAggregationTablesIterator(accessToken, tablesetIds[0], 2);
    let flag = false;
    for await(const table of aggregationTablesIt) {
      flag = true;
      expect(table).to.not.be.undefined;
      expect(["Table1", "Table2", "Table3"]).to.include(table.tableName);
    }
    expect(flag).to.be.true;
  });

  it("Aggregation Tables - Get pages", async () => {
    const aggregationTablesIt = aggregationsClient.getAggregationTablesIterator(accessToken, tablesetIds[0], 2);
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
    const newMapping: MappingCreate = {
      mappingName: "Test4",
    };
    const mapping = await mappingsClient.createMapping(accessToken, testIModel.id, newMapping);
    mappingIds.push(mapping.id);
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "AggregationTableSet_name",
      description: "AggregationTableSet for a mapping",
      datasourceId: mappingIds[mappingIds.length - 1],
      datasourceType: "IModelMapping",
    };
    const aggregationTableSet = await aggregationsClient.createAggregationTableSet(accessToken, newAggregationTableSet);
    expect(aggregationTableSet).to.not.be.undefined;
    expect(aggregationTableSet.tableSetName).to.be.eq("AggregationTableSet_name");
    tablesetIds.push(aggregationTableSet.id);
    const newAggregationTable: AggregationTableCreate = {
      tableName: "AggregationTable_name",
      description: "Aggregation of Group table `Group1`.",
      sourceTableName: "SampleGroup",
    };
    const aggregationTable = await aggregationsClient.createAggregationTable(accessToken, tablesetIds[tablesetIds.length - 1], newAggregationTable);
    expect(aggregationTable).to.not.be.undefined;
    expect(aggregationTable.tableName).to.be.eq("AggregationTable_name");
    tableIds.push(aggregationTable.id);
    const newAggregationProperty: AggregationPropertyCreate = {
      propertyName: "Property4",
      sourcePropertyName: "SamplePropertyName",
      type: "Count" as AggregationPropertyType ?? AggregationPropertyType.Undefined,
    };
    const property = await aggregationsClient.createAggregationProperty(accessToken, tablesetIds[tablesetIds.length - 1], tableIds[tableIds.length - 1], newAggregationProperty);
    propertyIds.push(property.id);

    let response: Response;
    response = await aggregationsClient.deleteAggregationProperty(accessToken, tablesetIds[tablesetIds.length - 1], tableIds[tableIds.length - 1], propertyIds.pop()!);
    expect(response.status).to.be.eq(204);
    response = await aggregationsClient.deleteAggregationTable(accessToken, tablesetIds[tablesetIds.length - 1], tableIds.pop()!);
    expect(response.status).to.be.eq(204);
    response = await aggregationsClient.deleteAggregationTableSet(accessToken, tablesetIds.pop()!);
    expect(response.status).to.be.eq(204);
    response = await mappingsClient.deleteMapping(accessToken, testIModel.id, mappingIds.pop()!);
    expect(response.status).to.be.eq(204);
  });

  it("Aggregation Properties - Get", async () => {
    const aggregationProperty = await aggregationsClient.getAggregationProperty(accessToken, tablesetIds[0], tableIds[0], propertyIds[0]);
    expect(aggregationProperty).to.not.be.undefined;
    expect(aggregationProperty.propertyName).to.be.eq("Property1");
  });

  it("Aggregation Properties - Update", async () => {
    const newAggregationProperty: AggregationPropertyUpdate = {
      propertyName: "NewRowCount",
    };
    const aggregationProperty = await aggregationsClient.updateAggregationProperty(accessToken, tablesetIds[0], tableIds[0], propertyIds[0], newAggregationProperty);
    expect(aggregationProperty).to.not.be.undefined;
    expect(aggregationProperty.propertyName).to.be.eq("NewRowCount");
  });

  it("Aggregation Properties - Get all", async () => {
    const aggregationProperties = await aggregationsClient.getAggregationProperties(accessToken, tablesetIds[0], tableIds[0]);
    expect(aggregationProperties).to.not.be.undefined;
    expect(aggregationProperties.length).to.be.above(2);
    for(const report of aggregationProperties) {
      expect(["Property1", "Property2", "Property3"]).to.include(report.propertyName);
    }
  });

  it("Aggregation Properties - Get with iterator", async () => {
    const aggregationPropertiesIt = aggregationsClient.getAggregationPropertiesIterator(accessToken, tablesetIds[0], tableIds[0], 2);
    let flag = false;
    for await(const property of aggregationPropertiesIt) {
      flag = true;
      expect(property).to.not.be.undefined;
      expect(["Property1", "Property2", "Property3"]).to.include(property.propertyName);
    }
    expect(flag).to.be.true;
  });

  it("Aggregation Properties - Get pages", async () => {
    const aggregationPropertiesIt = aggregationsClient.getAggregationPropertiesIterator(accessToken, tablesetIds[0], tableIds[0], 2);
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
