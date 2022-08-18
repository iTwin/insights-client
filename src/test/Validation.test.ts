/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { CalculatedPropertyCreate, CalculatedPropertyType, CalculatedPropertyUpdate, CustomCalculationCreate, CustomCalculationUpdate, DataType, ECProperty, ExtractionClient, GroupCreate, GroupPropertyCreate, GroupPropertyUpdate, GroupUpdate, MappingCopy, MappingCreate, MappingsClient, MappingUpdate, ODataClient, ODataItem, QuantityType, ReportCreate, ReportMappingCreate, ReportsClient, ReportUpdate } from "../reporting";
use(chaiAsPromised);

describe("Validation", () => {
  const reportsClient = new ReportsClient();
  const mappingsClient = new MappingsClient();
  const oDataClient = new ODataClient();
  const extractionClient = new ExtractionClient();

  it("Reports - Create unsuccessfully", async () => {
    const newReport: ReportCreate = {
      displayName: "",
      projectId: "-",
    };
    await expect(reportsClient.createReport("-", newReport)).to.be.rejectedWith(
      "Required field displayName of report was null or undefined."
    );

    newReport.displayName = "Test";
    newReport.projectId = "";
    await expect(reportsClient.createReport("-", newReport)).to.be.rejectedWith(
      "Required field of report was null or undefined."
    );
  });

  it("Reports - Update unsuccessfully", async () => {
    const reportUpdate: ReportUpdate = {};
    await expect(reportsClient.updateReport("-", "-", reportUpdate)).to.be.rejectedWith(
      "All fields of report were null or undefined."
    );

    reportUpdate.displayName = "";
    await expect(reportsClient.updateReport("-", "-", reportUpdate)).to.be.rejectedWith(
      "Field display of report was empty."
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
      "Required field mappingId of reportMapping was null or undefined."
    );

    newReportMapping.mappingId = "Not empty";
    newReportMapping.imodelId = "";
    await expect(reportsClient.createReportMapping("-", "-", newReportMapping)).to.be.rejectedWith(
      "Required field imodelId of reportMapping was null or undefined."
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
      "Required field mappingName of mapping was missing or invalid.",
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
      "Required field mappingName of mapping was invalid.",
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
      "Field mappingName of mappingCopy was invalid.",
    );

    mappingCopy = {
      targetIModelId: "",
      mappingName: "Test",
    };
    await expect(mappingsClient.copyMapping("-", "-", "-", mappingCopy)).to.be.rejectedWith(
      "Required field targetiModelId of mappingCopy was missing.",
    );
  });

  it("Groups - Create unsuccessfully", async () => {
    const newGroup: GroupCreate = {
      groupName: "Test",
      query: "",
    };
    await expect(mappingsClient.createGroup("-", "-", "-", newGroup)).to.be.rejectedWith(
      "Required field query of group was null or undefined.",
    );
    newGroup.groupName = "";
    newGroup.query = "Valid query";
    await expect(mappingsClient.createGroup("-", "-", "-", newGroup)).to.be.rejectedWith(
      "Required field mappingName of group was invalid.",
    );
  });

  it("Groups - Update unsuccessfully", async () => {
    let groupUpdate: GroupUpdate = {};
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "All properties of group were missing.",
    );
    groupUpdate.groupName = "";
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "Field groupName of group was invalid.",
    );
    groupUpdate = {
      description: "Valid description",
      query: "",
    };
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      "Required field query of group was null or undefined.",
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
      "Field propertyName of groupProperty was invalid.",
    );

    newProperty.propertyName = "Name";
    newProperty.dataType = DataType.Undefined;
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field dataType of groupProperty was null or undefined.",
    );

    newProperty.dataType = DataType.Number;
    newProperty.ecProperties = [];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field ecProperties of groupProperty was null or empty.",
    );

    ecProperty.ecClassName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties of groupProperty was invalid.",
    );

    ecProperty.ecClassName = "Class";
    ecProperty.ecPropertyName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties of groupProperty was invalid.",
    );

    ecProperty.ecPropertyName = "Property";
    ecProperty.ecSchemaName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties of groupProperty was invalid.",
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
      "Field propertyName of groupProperty was invalid.",
    );

    newProperty.propertyName = "Name";
    newProperty.dataType = DataType.Undefined;
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field dataType of groupProperty was null or undefined.",
    );

    newProperty.dataType = DataType.Number;
    newProperty.ecProperties = [];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field ecProperties of groupProperty was null or empty.",
    );

    ecProperty.ecClassName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties of groupProperty was invalid.",
    );

    ecProperty.ecClassName = "Class";
    ecProperty.ecPropertyName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties of groupProperty was invalid.",
    );

    ecProperty.ecPropertyName = "Property";
    ecProperty.ecSchemaName = "";
    newProperty.ecProperties = [ecProperty];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Field ecProperties of groupProperty was invalid.",
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
      "Field propertyName of property was invalid.",
    );

    newProperty.propertyName = "Test";
    newProperty.type = CalculatedPropertyType.Undefined;
    await expect(mappingsClient.createCalculatedProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      "Required field type of property was null or undefined.",
    );
  });

  it("Calculated properties - Update unsuccessfully", async () => {
    const calcPropertyUpdate: CalculatedPropertyUpdate = {};
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      "All properties of property were missing.",
    );
    calcPropertyUpdate.propertyName = "";
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      "Field propertyName of property was invalid.",
    );

    calcPropertyUpdate.propertyName = "Test";
    calcPropertyUpdate.type = CalculatedPropertyType.Undefined;
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      "Required field type of property was null or undefined.",
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
      "Field propertyName of property was invalid.",
    );

    newCalculation.propertyName = "Test";
    newCalculation.formula = "";
    await expect(mappingsClient.createCustomCalculation("-", "-", "-", "-", newCalculation)).to.be.rejectedWith(
      "Required field formula of property was null or undefined.",
    );
  });

  it("Custom calculations - Update unsuccessfully", async () => {
    const custCalculationUpdate: CustomCalculationUpdate = {};
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      "All properties of property were missing.",
    );
    custCalculationUpdate.propertyName = "";
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      "Field propertyName of property was invalid.",
    );
    custCalculationUpdate.propertyName = "Test";
    custCalculationUpdate.formula = "";
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      "Required field formula of property was null or undefined.",
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

  it("Extraction logs - Faulty top value", async () => {
    await expect(extractionClient.getExtractionLogs("-", "-", 0)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
    await expect(extractionClient.getExtractionLogs("-", "-", 1001)).to.be.rejectedWith(
      "Parameter top was outside of the valid range [1-1000]."
    );
  });

  it("Odata - Faulty odata item", async () => {
    const item: ODataItem = {
      name: "Test",
      url: "1/2",
    };
    await expect(oDataClient.getODataReportEntities("-", "-", item)).to.be.rejectedWith(
      "odata item was invalid."
    );
    await expect(oDataClient.getODataReportEntityPage("-", "-", item, 0)).to.be.rejectedWith(
      "odata item was invalid."
    );
    expect(() => oDataClient.getODataReportEntitiesIterator("-", "-", item)).to.throw(
      "odata item was invalid."
    );
  });
});
