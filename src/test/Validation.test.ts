/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { AggregationsClient } from "../reporting/clients/AggregationsClient";
import { ODataClient } from "../reporting/clients/ODataClient";
import { ReportsClient } from "../reporting/clients/ReportsClient";
import { AggregationPropertyCreate, AggregationPropertyType, AggregationPropertyUpdate, AggregationTableCreate, AggregationTableSetCreate, AggregationTableSetUpdate, AggregationTableUpdate } from "../reporting/interfaces/AggregationProperties";
import { ODataItem } from "../reporting/interfaces/OData";
import { ReportAggregationCreate, ReportCreate, ReportMappingCreate, ReportUpdate } from "../reporting/interfaces/Reports";
import { EC3ConfigurationsClient } from "../carbon-calculation/clients/EC3ConfigurationsClient";
import { EC3ReportConfigurationCreate, EC3ReportConfigurationUpdate } from "../carbon-calculation/interfaces/EC3Configurations";
import { ExtractionClient } from "../grouping-and-mapping/clients/ExtractionClient";
import { GroupsClient } from "../grouping-and-mapping/clients/GroupsClient";
import { MappingsClient } from "../grouping-and-mapping/clients/MappingsClient";
import { PropertiesClient } from "../grouping-and-mapping/clients/PropertiesClient";
import { GroupCreate, GroupUpdate } from "../grouping-and-mapping/interfaces/Groups";
import { MappingCreate, MappingUpdate } from "../grouping-and-mapping/interfaces/Mappings";
import { DataType, ECPropertyReference, PropertyModify, QuantityType } from "../grouping-and-mapping/interfaces/Properties";
import { PreferReturn } from "../common/Common";
use(chaiAsPromised);

describe("Validation", () => {
  const reportsClient = new ReportsClient();
  const mappingsClient = new MappingsClient();
  const groupsClient = new GroupsClient();
  const propertiesClient = new PropertiesClient();
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
      "Required field displayName was null or undefined.",
    );

    newReport.displayName = "Test";
    newReport.projectId = "";
    await expect(reportsClient.createReport("-", newReport)).to.be.rejectedWith(
      "Required field projectId was null or undefined.",
    );
  });

  it("Reports - Update unsuccessfully", async () => {
    const reportUpdate: ReportUpdate = {};
    await expect(reportsClient.updateReport("-", "-", reportUpdate)).to.be.rejectedWith(
      "All fields of report were null or undefined.",
    );

    reportUpdate.displayName = "";
    await expect(reportsClient.updateReport("-", "-", reportUpdate)).to.be.rejectedWith(
      "Field displayName was empty.",
    );
  });

  it("Reports - Faulty top value", async () => {
    await expect(reportsClient.getReports("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(reportsClient.getReports("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
  });

  it("Report mappings - Create unsuccessfully", async () => {
    const newReportMapping: ReportMappingCreate = {
      mappingId: "",
      imodelId: "Not empty",
    };
    await expect(reportsClient.createReportMapping("-", "-", newReportMapping)).to.be.rejectedWith(
      "Required field mappingId was null or undefined.",
    );

    newReportMapping.mappingId = "Not empty";
    newReportMapping.imodelId = "";
    await expect(reportsClient.createReportMapping("-", "-", newReportMapping)).to.be.rejectedWith(
      "Required field imodelId was null or undefined.",
    );
  });

  it("Report mappings - Faulty top value", async () => {
    await expect(reportsClient.getReportMappings("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(reportsClient.getReportMappings("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
  });

  it("Mappings - Create unsuccessfully", async () => {
    const newMapping: MappingCreate = {
      mappingName: "",
      iModelId: "",
    };
    await expect(mappingsClient.createMapping("-", newMapping)).to.be.rejectedWith(
      "Required field mappingName was missing or invalid.",
    );
  });

  it("Mappings - Update unsuccessfully", async () => {
    const mappingUpdate: MappingUpdate = {};
    await expect(mappingsClient.updateMapping("-", "-", mappingUpdate)).to.be.rejectedWith(
      "All properties of mapping were missing.",
    );
    mappingUpdate.description = "Valid description",
    mappingUpdate.mappingName = "";
    await expect(mappingsClient.updateMapping("-", "-", mappingUpdate)).to.be.rejectedWith(
      "Required field mappingName was invalid.",
    );
  });

  it("Mappings - Faulty top value", async () => {
    await expect(mappingsClient.getMappings("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(mappingsClient.getMappings("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
  });

  it("Groups - Create unsuccessfully", async () => {
    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "",
    };
    await expect(groupsClient.createGroup("-", "-", newGroup)).to.be.rejectedWith(
      "Required field query was null or undefined.",
    );
    newGroup.groupName = "";
    newGroup.query = "Valid query";
    await expect(groupsClient.createGroup("-", "-", newGroup)).to.be.rejectedWith(
      "Field groupName was invalid.",
    );

    newGroup.groupName = "MetadataTest";
    newGroup.metadata = [{ key: "", value: "value" }];
    await expect(groupsClient.createGroup("-", "-", newGroup)).to.be.rejectedWith(
      "Key cannot be empty or consist only of whitespace characters.",
    );

    newGroup.metadata = [{ key: "k1", value: "value" }, { key: "k1", value: "value" }];
    await expect(groupsClient.createGroup("-", "-", newGroup)).to.be.rejectedWith(
      "Duplicate key found: k1",
    );
  });

  it("Groups - Update unsuccessfully", async () => {
    let groupUpdate: GroupUpdate = {};
    await expect(groupsClient.updateGroup("-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "All properties of group were missing.",
    );
    groupUpdate.groupName = "";
    await expect(groupsClient.updateGroup("-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "Field groupName was invalid.",
    );
    groupUpdate = {
      description: "Valid description",
      query: "",
    };
    await expect(groupsClient.updateGroup("-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "Required field query was null or undefined.",
    );
  });

  it("Groups - Faulty top value", async () => {
    await expect(groupsClient.getGroups("-", "-", PreferReturn.Minimal, 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(groupsClient.getGroups("-", "-", PreferReturn.Minimal, 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
  });

  it("Properties - Create unsuccessfully", async () => {
    const ecProperty: ECPropertyReference = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecSchemaName: "schema",
    };
    const newProperty: PropertyModify = {
      propertyName: "",
      dataType: DataType.Integer,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    await expect(propertiesClient.createProperty("-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );
    newProperty.propertyName = "validName";

    ecProperty.ecClassName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(propertiesClient.createProperty("-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );

    ecProperty.ecClassName = "Class";
    ecProperty.ecPropertyName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(propertiesClient.createProperty("-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );

    ecProperty.ecPropertyName = "Property";
    ecProperty.ecSchemaName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(propertiesClient.createProperty("-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );
  });

  it("Properties - Update unsuccessfully", async () => {
    const ecProperty: ECPropertyReference = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecSchemaName: "schema",
    };
    const newProperty: PropertyModify = {
      propertyName: "",
      dataType: DataType.Integer,
      quantityType: QuantityType.Distance,
      ecProperties: [ecProperty],
    };
    await expect(propertiesClient.updateProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );
    newProperty.propertyName = "validName";

    ecProperty.ecClassName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(propertiesClient.updateProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );

    ecProperty.ecClassName = "Class";
    ecProperty.ecPropertyName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(propertiesClient.updateProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );

    ecProperty.ecPropertyName = "Property";
    ecProperty.ecSchemaName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(propertiesClient.updateProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties was invalid.",
    );
  });

  it("Properties - Faulty top value", async () => {
    await expect(propertiesClient.getProperties("-", "-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(propertiesClient.getProperties("-", "-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
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
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(reportsClient.getReportAggregations("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
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
      "All properties of tableset were missing.",
    );

    tablesetUpdate.tableSetName = "";
    await expect(aggregationsClient.updateAggregationTableSet("-", "-", tablesetUpdate)).to.be.rejectedWith(
      "Field tableSetName was invalid.",
    );
  });

  it("Aggregation Table Set - Faulty top value", async () => {
    await expect(aggregationsClient.getAggregationTableSets("-", "-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(aggregationsClient.getAggregationTableSets("-", "-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
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
      "All properties of table were missing.",
    );

    tableUpdate.tableName = "";
    tableUpdate.sourceTableName = "validname";
    await expect(aggregationsClient.updateAggregationTable("-", "-", "-", tableUpdate)).to.be.rejectedWith(
      "Field tableName was invalid.",
    );
    tableUpdate.tableName = "validname";
    tableUpdate.sourceTableName = "";
    await expect(aggregationsClient.updateAggregationTable("-", "-", "-", tableUpdate)).to.be.rejectedWith(
      "Field sourceTableName was invalid.",
    );
  });

  it("Aggregation Table - Faulty top value", async () => {
    await expect(aggregationsClient.getAggregationTables("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(aggregationsClient.getAggregationTables("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
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
      "All properties of property were missing.",
    );

    propertyUpdate.propertyName = "";
    propertyUpdate.sourcePropertyName = "validname";
    propertyUpdate.type = "Count" as AggregationPropertyType;
    await expect(aggregationsClient.updateAggregationProperty("-", "-", "-", "-", propertyUpdate)).to.be.rejectedWith(
      "Field propertyName was invalid.",
    );
    propertyUpdate.propertyName = "validname";
    propertyUpdate.sourcePropertyName = "";
    propertyUpdate.type = "Count" as AggregationPropertyType;
    await expect(aggregationsClient.updateAggregationProperty("-", "-", "-", "-", propertyUpdate)).to.be.rejectedWith(
      "Field sourcePropertyName was invalid.",
    );
    propertyUpdate.propertyName = "validname";
    propertyUpdate.sourcePropertyName = "validname";
    propertyUpdate.type = AggregationPropertyType.Undefined;
    await expect(aggregationsClient.updateAggregationProperty("-", "-", "-", "-", propertyUpdate)).to.be.rejectedWith(
      "Required field type was null or undefined.",
    );
  });

  it("Extraction logs - Faulty top value", async () => {
    await expect(extractionClient.getExtractionLogs("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(extractionClient.getExtractionLogs("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
  });

  it("Odata - Faulty odata item", async () => {
    const item: ODataItem = {
      name: "Test",
      url: "1/2",
    };
    await expect(oDataClient.getODataReportEntities("-", "-", item)).to.be.rejectedWith(
      "Parameter odataItem item was invalid.",
    );
    await expect(oDataClient.getODataReportEntityPage("-", "-", item, 0)).to.be.rejectedWith(
      "Parameter odataItem item was invalid.",
    );
    expect(() => oDataClient.getODataReportEntitiesIterator("-", "-", item)).to.throw(
      "Parameter odataItem item was invalid.",
    );
  });

  it("EC3 Configurations - Faulty top value", async () => {
    await expect(configurationsClient.getConfigurations("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
    await expect(configurationsClient.getConfigurations("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000].",
    );
  });

  it("EC3 Configurations - Create unsuccessfully", async () => {
    const newConfig: EC3ReportConfigurationCreate = {
      displayName: "Test",
      reportId: "id",
      labels: [],
    };
    await expect(configurationsClient.createConfiguration("-", newConfig)).to.be.rejectedWith(
      "Required field labels was empty.",
    );

    newConfig.labels.push({
      materials: [],
      name: "name",
      reportTable: "table",
      elementQuantityColumn: "quantity",
      elementNameColumn: "name",
    });
    await expect(configurationsClient.createConfiguration("-", newConfig)).to.be.rejectedWith(
      "Required field materials was empty.",
    );
  });

  it("EC3 Configurations - Update unsuccessfully", async () => {
    const newConfig: EC3ReportConfigurationUpdate = {
      displayName: "Test",
      description: "",
      labels: [],
    };
    await expect(configurationsClient.updateConfiguration("-", "-", newConfig)).to.be.rejectedWith(
      "Required field labels was empty.",
    );

    newConfig.labels.push({
      materials: [],
      name: "name",
      reportTable: "table",
      elementQuantityColumn: "quantity",
      elementNameColumn: "name",
    });
    await expect(configurationsClient.updateConfiguration("-", "-", newConfig)).to.be.rejectedWith(
      "Required field materials was empty.",
    );
  });
});
