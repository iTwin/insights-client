/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { AggregationPropertyCreate, AggregationPropertyType, AggregationPropertyUpdate, AggregationsClient, AggregationTableCreate, AggregationTableSetCreate, AggregationTableSetUpdate, AggregationTableUpdate, CalculatedPropertyCreate, CalculatedPropertyType, CalculatedPropertyUpdate, CustomCalculationCreate, CustomCalculationUpdate, DataType, ECProperty, ExtractionClient, GroupCreate, GroupPropertyCreate, GroupPropertyUpdate, GroupUpdate, MappingCopy, MappingCreate, MappingsClient, MappingUpdate, ODataClient, ODataItem, QuantityType, ReportAggregationCreate, ReportCreate, ReportMappingCreate, ReportsClient, ReportUpdate } from "../reporting";
import { EC3ConfigurationsClient } from "../carbon-calculation/clients/EC3ConfigurationsClient";
import { EC3ConfigurationCreate, EC3ConfigurationUpdate } from "../carbon-calculation/interfaces/EC3Configurations";
use(chaiAsPromised);

describe("Validation", () => {
  const reportsClient = new ReportsClient();
  const mappingsClient = new MappingsClient();
  const aggregationsClient = new AggregationsClient();
  const oDataClient = new ODataClient();
  const extractionClient = new ExtractionClient();
  const configurationsClient = new EC3ConfigurationsClient();

  it("Reports - Create unsuccessfully", async () => {
    const newReport: ReportCreate = {
      displayName: "",
      projectId: "-",
    };
    await expect(reportsClient.createReport("-", newReport)).to.be.rejectedWith(
      "Required field displayName was null or undefined."
    );

    newReport.displayName = "Test";
    newReport.projectId = "";
    await expect(reportsClient.createReport("-", newReport)).to.be.rejectedWith(
      "Required field projectId was null or undefined."
    );
  });

  it("Reports - Update unsuccessfully", async () => {
    const reportUpdate: ReportUpdate = {};
    await expect(reportsClient.updateReport("-", "-", reportUpdate)).to.be.rejectedWith(
      "All fields of report were null or undefined."
    );

    reportUpdate.displayName = "";
    await expect(reportsClient.updateReport("-", "-", reportUpdate)).to.be.rejectedWith(
      "Field displayName was empty."
    );
  });

  it("Reports - Faulty top value", async () => {
    await expect(reportsClient.getReports("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(reportsClient.getReports("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Report mappings - Create unsuccessfully", async () => {
    const newReportMapping: ReportMappingCreate = {
      mappingId: "",
      imodelId: "Not empty",
    };
    await expect(reportsClient.createReportMapping("-", "-", newReportMapping)).to.be.rejectedWith(
      "Required field mappingId was null or undefined."
    );

    newReportMapping.mappingId = "Not empty";
    newReportMapping.imodelId = "";
    await expect(reportsClient.createReportMapping("-", "-", newReportMapping)).to.be.rejectedWith(
      "Required field imodelId was null or undefined."
    );
  });

  it("Report mappings - Faulty top value", async () => {
    await expect(reportsClient.getReportMappings("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(reportsClient.getReportMappings("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Mappings - Create unsuccessfully", async () => {
    const newMapping: MappingCreate = {
      mappingName: "",
    };
    await expect(mappingsClient.createMapping("-", "-", newMapping)).to.be.rejectedWith(
      "Required field mappingName was missing or invalid.",
    );
  });

  it("Mappings - Update unsuccessfully", async () => {
    const mappingUpdate: MappingUpdate = {};
    await expect(mappingsClient.updateMapping("-", "-", "-", mappingUpdate)).to.be.rejectedWith(
      "All properties of mapping were missing.",
    );
    mappingUpdate.description = "Valid description",
    mappingUpdate.mappingName = "";
    await expect(mappingsClient.updateMapping("-", "-", "-", mappingUpdate)).to.be.rejectedWith(
      "Required field mappingName was invalid.",
    );
  });

  it("Mappings - Faulty top value", async () => {
    await expect(mappingsClient.getMappings("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(mappingsClient.getMappings("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Mappings - Copy unsuccessfully", async () => {
    let mappingCopy: MappingCopy = {
      targetIModelId: "-",
      mappingName: "",
    };
    await expect(mappingsClient.copyMapping("-", "-", "-", mappingCopy)).to.be.rejectedWith(
      "Field mappingName was invalid.",
    );

    mappingCopy = {
      targetIModelId: "",
      mappingName: "Test",
    };
    await expect(mappingsClient.copyMapping("-", "-", "-", mappingCopy)).to.be.rejectedWith(
      "Required field targetIModelId was missing.",
    );
  });

  it("Groups - Create unsuccessfully", async () => {
    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "",
    };
    await expect(mappingsClient.createGroup("-", "-", "-", newGroup)).to.be.rejectedWith(
      "Required field query was null or undefined.",
    );
    newGroup.groupName = "";
    newGroup.query = "Valid query";
    await expect(mappingsClient.createGroup("-", "-", "-", newGroup)).to.be.rejectedWith(
      "Required field groupName was invalid.",
    );
  });

  it("Groups - Update unsuccessfully", async () => {
    let groupUpdate: GroupUpdate = {};
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "All properties of group were missing.",
    );
    groupUpdate.groupName = "";
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "Field groupName was invalid.",
    );
    groupUpdate = {
      description: "Valid description",
      query: "",
    };
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "Required field query was null or undefined.",
    );
  });

  it("Groups - Faulty top value", async () => {
    await expect(mappingsClient.getGroups("-", "-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(mappingsClient.getGroups("-", "-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Group properties - Create unsuccessfully", async () => {
    const ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    const newProperty: GroupPropertyCreate = {
      propertyName: "",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );

    newProperty.propertyName = "Name";
    newProperty.dataType = DataType.Undefined;
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field dataType was null or undefined.",
    );

    newProperty.dataType = DataType.Number;
    newProperty.ecProperties = [];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field ecProperties was null or empty.",
    );

    ecProperty.ecClassName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );

    ecProperty.ecClassName = "Class";
    ecProperty.ecPropertyName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );

    ecProperty.ecPropertyName = "Property";
    ecProperty.ecSchemaName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );
  });

  it("Group properties - Update unsuccessfully", async () => {
    const ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    const newProperty: GroupPropertyUpdate = {
      propertyName: "",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );

    newProperty.propertyName = "Name";
    newProperty.dataType = DataType.Undefined;
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field dataType was null or undefined.",
    );

    newProperty.dataType = DataType.Number;
    newProperty.ecProperties = [];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field ecProperties was null or empty.",
    );

    ecProperty.ecClassName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );

    ecProperty.ecClassName = "Class";
    ecProperty.ecPropertyName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );

    ecProperty.ecPropertyName = "Property";
    ecProperty.ecSchemaName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );
  });

  it("Group properties - Faulty top value", async () => {
    await expect(mappingsClient.getGroupProperties("-", "-", "-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(mappingsClient.getGroupProperties("-", "-", "-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Calculated properties - Create unsuccessfully", async () => {
    const newProperty: CalculatedPropertyCreate = {
      propertyName: "",
      type: CalculatedPropertyType.Length,
    };
    await expect(mappingsClient.createCalculatedProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );

    newProperty.propertyName = "Test";
    newProperty.type = CalculatedPropertyType.Undefined;
    await expect(mappingsClient.createCalculatedProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field type was null or undefined.",
    );
  });

  it("Calculated properties - Update unsuccessfully", async () => {
    const calcPropertyUpdate: CalculatedPropertyUpdate = {};
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      "All properties of property were missing.",
    );
    calcPropertyUpdate.propertyName = "";
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );

    calcPropertyUpdate.propertyName = "Test";
    calcPropertyUpdate.type = CalculatedPropertyType.Undefined;
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      "Required field type was null or undefined.",
    );
  });

  it("Calculated properties - Faulty top value", async () => {
    await expect(mappingsClient.getCalculatedProperties("-", "-", "-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(mappingsClient.getCalculatedProperties("-", "-", "-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Custom calculations - Create unsuccessfully", async () => {
    const newCalculation: CustomCalculationCreate = {
      propertyName: "",
      formula: "1+1",
      quantityType: QuantityType.Distance,
    };
    await expect(mappingsClient.createCustomCalculation("-", "-", "-", "-", newCalculation)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );

    newCalculation.propertyName = "Test";
    newCalculation.formula = "";
    await expect(mappingsClient.createCustomCalculation("-", "-", "-", "-", newCalculation)).to.be.rejectedWith(
      "Required field formula was null or undefined.",
    );
  });

  it("Custom calculations - Update unsuccessfully", async () => {
    const custCalculationUpdate: CustomCalculationUpdate = {};
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      "All properties of property were missing.",
    );
    custCalculationUpdate.propertyName = "";
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );
    custCalculationUpdate.propertyName = "Test";
    custCalculationUpdate.formula = "";
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      "Required field formula was null or undefined.",
    );
  });

  it("Custom calculations - Faulty top value", async () => {
    await expect(mappingsClient.getCustomCalculations("-", "-", "-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(mappingsClient.getCustomCalculations("-", "-", "-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Report Aggregations - Create unsuccessfully", async () => {
    const newAggregation: ReportAggregationCreate = {
      aggregationTableSetId: "",
    };
    await expect(reportsClient.createReportAggregation("-", "-", newAggregation)).to.be.rejectedWith(
      "Required field aggregationTableSetId was null or undefined.",
    );
  });

  it("Report Aggregations - Faulty top value", async () => {
    await expect(reportsClient.getReportAggregations("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(reportsClient.getReportAggregations("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Aggregation Table Set - Create unsuccessfully", async () => {
    const newAggregationTableSet: AggregationTableSetCreate = {
      tableSetName: "",
      description: "",
      datasourceId: "1",
      datasourceType: "validsource",
    };
    await expect(aggregationsClient.createAggregationTableSet("-", newAggregationTableSet)).to.be.rejectedWith(
      "Field tableSetName was invalid.",
    );

    newAggregationTableSet.tableSetName = "validname";
    newAggregationTableSet.datasourceId = "";
    await expect(aggregationsClient.createAggregationTableSet("-", newAggregationTableSet)).to.be.rejectedWith(
      "Required field datasourceId was null or undefined.",
    );

    newAggregationTableSet.datasourceId = "1";
    newAggregationTableSet.datasourceType = "";
    await expect(aggregationsClient.createAggregationTableSet("-", newAggregationTableSet)).to.be.rejectedWith(
      "Field datasourceType was invalid.",
    );
  });

  it("Aggregation Table Set - Update unsuccessfully", async () => {
    const tablesetUpdate: AggregationTableSetUpdate = {};
    await expect(aggregationsClient.updateAggregationTableSet("-", "-", tablesetUpdate)).to.be.rejectedWith(
      "All properties of tableset were missing."
    );

    tablesetUpdate.tableSetName = "";
    await expect(aggregationsClient.updateAggregationTableSet("-", "-", tablesetUpdate)).to.be.rejectedWith(
      "Field tableSetName was invalid."
    );
  });

  it("Aggregation Table Set - Faulty top value", async () => {
    await expect(aggregationsClient.getAggregationTableSets("-", "-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(aggregationsClient.getAggregationTableSets("-", "-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Aggregation Table - Create unsuccessfully", async () => {
    const newAggregationTable: AggregationTableCreate = {
      tableName: "",
      description: "",
      sourceTableName: "validname",
    };
    await expect(aggregationsClient.createAggregationTable("-", "-", newAggregationTable)).to.be.rejectedWith(
      "Field tableName was invalid.",
    );

    newAggregationTable.tableName = "validname";
    newAggregationTable.sourceTableName = "";
    await expect(aggregationsClient.createAggregationTable("-", "-", newAggregationTable)).to.be.rejectedWith(
      "Field sourceTableName was invalid.",
    );
  });

  it("Aggregation Table - Update unsuccessfully", async () => {
    const tableUpdate: AggregationTableUpdate = {};
    await expect(aggregationsClient.updateAggregationTable("-", "-", "-", tableUpdate)).to.be.rejectedWith(
      "All properties of table were missing."
    );

    tableUpdate.tableName = "";
    tableUpdate.sourceTableName = "validname";
    await expect(aggregationsClient.updateAggregationTable("-", "-", "-", tableUpdate)).to.be.rejectedWith(
      "Field tableName was invalid."
    );
    tableUpdate.tableName = "validname";
    tableUpdate.sourceTableName = "";
    await expect(aggregationsClient.updateAggregationTable("-", "-", "-", tableUpdate)).to.be.rejectedWith(
      "Field sourceTableName was invalid."
    );
  });

  it("Aggregation Table - Faulty top value", async () => {
    await expect(aggregationsClient.getAggregationTables("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(aggregationsClient.getAggregationTables("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Aggregation Property - Create unsuccessfully", async () => {
    const newAggregationProperty: AggregationPropertyCreate = {
      propertyName: "",
      sourcePropertyName: "validname",
      type: "Count" as AggregationPropertyType,
    };
    await expect(aggregationsClient.createAggregationProperty("-", "-", "-", newAggregationProperty)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );

    newAggregationProperty.propertyName = "validname";
    newAggregationProperty.sourcePropertyName = "";
    await expect(aggregationsClient.createAggregationProperty("-", "-", "-", newAggregationProperty)).to.be.rejectedWith(
      "Field sourcePropertyName was invalid.",
    );

    newAggregationProperty.sourcePropertyName = "validname";
    newAggregationProperty.type = AggregationPropertyType.Undefined;
    await expect(aggregationsClient.createAggregationProperty("-", "-", "-", newAggregationProperty)).to.be.rejectedWith(
      "Required field type was null or undefined.",
    );
  });

  it("Aggregation Property - Update unsuccessfully", async () => {
    const propertyUpdate: AggregationPropertyUpdate = {};
    await expect(aggregationsClient.updateAggregationProperty("-", "-", "-", "-", propertyUpdate)).to.be.rejectedWith(
      "All properties of property were missing."
    );

    propertyUpdate.propertyName = "";
    propertyUpdate.sourcePropertyName = "validname";
    propertyUpdate.type = "Count" as AggregationPropertyType;
    await expect(aggregationsClient.updateAggregationProperty("-", "-", "-", "-", propertyUpdate)).to.be.rejectedWith(
      "Field propertyName was invalid."
    );
    propertyUpdate.propertyName = "validname";
    propertyUpdate.sourcePropertyName = "";
    propertyUpdate.type = "Count" as AggregationPropertyType;
    await expect(aggregationsClient.updateAggregationProperty("-", "-", "-", "-", propertyUpdate)).to.be.rejectedWith(
      "Field sourcePropertyName was invalid."
    );
    propertyUpdate.propertyName = "validname";
    propertyUpdate.sourcePropertyName = "validname";
    propertyUpdate.type = AggregationPropertyType.Undefined;
    await expect(aggregationsClient.updateAggregationProperty("-", "-", "-", "-", propertyUpdate)).to.be.rejectedWith(
      "Required field type was null or undefined."
    );
  });

  it("Extraction logs - Faulty top value", async () => {
    await expect(extractionClient.getExtractionLogs("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(extractionClient.getExtractionLogs("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Extraction history - Faulty top value", async () => {
    await expect(extractionClient.getExtractionHistory("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(extractionClient.getExtractionHistory("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Odata - Faulty odata item", async () => {
    const item: ODataItem = {
      name: "Test",
      url: "1/2",
    };
    await expect(oDataClient.getODataReportEntities("-", "-", item)).to.be.rejectedWith(
      "Parameter odataItem item was invalid."
    );
    await expect(oDataClient.getODataReportEntityPage("-", "-", item, 0)).to.be.rejectedWith(
      "Parameter odataItem item was invalid."
    );
    expect(() => oDataClient.getODataReportEntitiesIterator("-", "-", item)).to.throw(
      "Parameter odataItem item was invalid."
    );
  });

  it("EC3 Configurations - Faulty top value", async () => {
    await expect(configurationsClient.getConfigurations("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(configurationsClient.getConfigurations("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("EC3 Configurations - Create unsuccessfully", async () => {
    const newConfig: EC3ConfigurationCreate = {
      displayName: "Test",
      reportId: "id",
      labels: [],
    };
    await expect(configurationsClient.createConfiguration("-", newConfig)).to.be.rejectedWith(
      "Required field labels was empty."
    );

    newConfig.labels.push({
      materials : [],
      name: "name",
      reportTable: "table",
      elementQuantityColumn: "quantity",
      elementNameColumn: "name",
    });
    await expect(configurationsClient.createConfiguration("-", newConfig)).to.be.rejectedWith(
      "Required field materials was empty."
    );
  });

  it("EC3 Configurations - Update unsuccessfully", async () => {
    const newConfig: EC3ConfigurationUpdate = {
      displayName: "Test",
      description: "",
      labels: [],
    };
    await expect(configurationsClient.updateConfiguration("-", "-", newConfig)).to.be.rejectedWith(
      "Required field labels was empty."
    );

    newConfig.labels.push({
      materials : [],
      name: "name",
      reportTable: "table",
      elementQuantityColumn: "quantity",
      elementNameColumn: "name",
    });
    await expect(configurationsClient.updateConfiguration("-", "-", newConfig)).to.be.rejectedWith(
      "Required field materials was empty."
    );
  });
});
