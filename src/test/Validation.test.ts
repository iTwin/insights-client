const chai = require('chai').use(require('chai-as-promised'));
import { expect } from "chai";
import { ReportsClient, MappingsClient, ReportCreate, MappingCreate, ReportMappingCreate, ReportUpdate, Report, ReportMapping, CalculatedPropertyCreate, CalculatedPropertyType, CalculatedPropertyUpdate, CustomCalculationCreate, CustomCalculationUpdate, DataType, ECProperty, GroupCreate, GroupPropertyCreate, GroupPropertyUpdate, GroupUpdate, MappingCopy, MappingUpdate, QuantityType, ODataClient, ODataItem } from "../reporting";

chai.should();
describe("Validation", () => {
  const reportsClient = new ReportsClient();
  const mappingsClient = new MappingsClient();
  const oDataClient = new ODataClient();

  it("Reports - Create unsuccessfully", async function () {
    this.timeout(0);
    let newReport: ReportCreate = {
      displayName: "",
      projectId: "-"
    };
    await expect(reportsClient.createReport("-", newReport)).to.be.rejectedWith(
      'Required field displayName of report was null or undefined when calling createReport.'
    );

    newReport.displayName = "Test";
    newReport.projectId = "";
    await expect(reportsClient.createReport("-", newReport)).to.be.rejectedWith(
      'Required field of report was null or undefined when calling createReport.'
    );
  });

  it("Reports - Update unsuccessfully", async function () {
    this.timeout(0);
    let reportUpdate: ReportUpdate = {};
    await expect(reportsClient.updateReport("-", "-", reportUpdate)).to.be.rejectedWith(
      'All fields of report were null or undefined when calling updateReport.'
    );

    reportUpdate.displayName = "";
    await expect(reportsClient.updateReport("-", "-", reportUpdate)).to.be.rejectedWith(
      'Field display of report was empty when calling createReportMapping.'
    );
  });

  it("Report mappings - Create unsuccessfully", async function () {
    this.timeout(0);
    let newReportMapping: ReportMappingCreate = {
      mappingId: "",
      imodelId: "Not empty"
    }
    await expect(reportsClient.createReportMapping("-", "-", newReportMapping)).to.be.rejectedWith(
      'Required field mappingId of reportMapping was null or undefined when calling createReportMapping.'
    );

    newReportMapping.mappingId = "Not empty";
    newReportMapping.imodelId = "";
    await expect(reportsClient.createReportMapping("-", "-", newReportMapping)).to.be.rejectedWith(
      'Required field imodelId of reportMapping was null or undefined when calling createReportMapping.'
    );
  });

  it("Mappings - Create unsuccessfully", async function () {
    let newMapping: MappingCreate = {
      mappingName: "",
    }
    await expect(mappingsClient.createMapping("-", "-", newMapping)).to.be.rejectedWith(
      'Required field mappingName of mapping was missing or invalid when calling createMapping.',
    );
  });

  it("Mappings - Update unsuccessfully", async function () {
    const mappingUpdate: MappingUpdate = {}
    await expect(mappingsClient.updateMapping("-", "-", "-", mappingUpdate)).to.be.rejectedWith(
      'All properties of mapping were missing when calling updateMapping.',
    );
    mappingUpdate.description = "Valid description",
      mappingUpdate.mappingName = "";
    await expect(mappingsClient.updateMapping("-", "-", "-", mappingUpdate)).to.be.rejectedWith(
      'Required field mappingName of mapping was invalid when calling createMapping.',
    );
  });

  it("Mappings - Copy unsuccessfully", async function () {
    let mappingCopy: MappingCopy = {
      targetIModelId: "-",
      mappingName: "",
    };
    await expect(mappingsClient.copyMapping("-", "-", "-", mappingCopy)).to.be.rejectedWith(
      'Field mappingName of mappingCopy was invalid when calling copyMapping.',
    );

    mappingCopy = {
      targetIModelId: "",
      mappingName: "Test",
    };
    await expect(mappingsClient.copyMapping("-", "-", "-", mappingCopy)).to.be.rejectedWith(
      'Required field targetiModelId of mappingCopy was missing when calling copyMapping.',
    );
  });

  it("Groups - Create unsuccessfully", async function () {
    let newGroup: GroupCreate = {
      groupName: "Test",
      query: ""
    }
    await expect(mappingsClient.createGroup("-", "-", "-", newGroup)).to.be.rejectedWith(
      'Required field query of group was null or undefined when calling createGroup.',
    );
    newGroup.groupName = "";
    newGroup.query = "Valid query";
    await expect(mappingsClient.createGroup("-", "-", "-", newGroup)).to.be.rejectedWith(
      'Required field mappingName of group was null or undefined when calling createGroup.',
    );
  });

  it("Groups - Update unsuccessfully", async function () {
    let groupUpdate: GroupUpdate = {};
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      'All properties of group were missing when calling updateGroup.',
    );
    groupUpdate.groupName = "";
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      'Field groupName of group was invalid when calling copyGroup.',
    );
    groupUpdate = {
      description: "Valid description",
      query: "",
    };
    await expect(mappingsClient.updateGroup("-", "-", "-", "-", groupUpdate)).to.be.rejectedWith(
      'Required field query of group was null or undefined when calling updateGroup.',
    );
  });

  it("Group properties - Create unsuccessfully", async function () {
    let ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    let newProperty: GroupPropertyCreate = {
      propertyName: "",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: new Array(ecProperty),
    };
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field propertyName of groupProperty was invalid when calling createGroupProperty.',
    );

    newProperty.propertyName = "Name";
    newProperty.dataType = DataType.Undefined;
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Required field dataType of groupProperty was null or undefined when calling createGroupProperty.',
    );

    newProperty.dataType = DataType.Number;
    newProperty.ecProperties = [];
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Required field ecProperties of groupProperty was null or empty when calling createGroupProperty.',
    );

    ecProperty.ecClassName = "";
    newProperty.ecProperties = new Array(ecProperty);
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field ecProperties of groupProperty was invalid when calling createGroupProperty.',
    );

    ecProperty.ecClassName = "Class";
    ecProperty.ecPropertyName = "";
    newProperty.ecProperties = new Array(ecProperty);
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field ecProperties of groupProperty was invalid when calling createGroupProperty.',
    );

    ecProperty.ecPropertyName = "Property";
    ecProperty.ecSchemaName = ""
    newProperty.ecProperties = new Array(ecProperty);
    await expect(mappingsClient.createGroupProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field ecProperties of groupProperty was invalid when calling createGroupProperty.',
    );
  });

  it("Group properties - Update unsuccessfully", async function () {
    let ecProperty: ECProperty = {
      ecClassName: "class",
      ecPropertyName: "property",
      ecPropertyType: DataType.String,
      ecSchemaName: "schema",
    };
    let newProperty: GroupPropertyUpdate = {
      propertyName: "",
      dataType: DataType.Number,
      quantityType: QuantityType.Distance,
      ecProperties: new Array(ecProperty),
    };
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field propertyName of groupProperty was invalid when calling updateGroupProperty.',
    );

    newProperty.propertyName = "Name";
    newProperty.dataType = DataType.Undefined;
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Required field dataType of groupProperty was null or undefined when calling updateGroupProperty.',
    );

    newProperty.dataType = DataType.Number;
    newProperty.ecProperties = [];
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Required field ecProperties of groupProperty was null or empty when calling updateGroupProperty.',
    );

    ecProperty.ecClassName = "";
    newProperty.ecProperties = new Array(ecProperty);
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field ecProperties of groupProperty was invalid when calling updateGroupProperty.',
    );

    ecProperty.ecClassName = "Class";
    ecProperty.ecPropertyName = "";
    newProperty.ecProperties = new Array(ecProperty);
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field ecProperties of groupProperty was invalid when calling updateGroupProperty.',
    );

    ecProperty.ecPropertyName = "Property";
    ecProperty.ecSchemaName = ""
    newProperty.ecProperties = new Array(ecProperty);
    await expect(mappingsClient.updateGroupProperty("-", "-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field ecProperties of groupProperty was invalid when calling updateGroupProperty.',
    );
  });

  it("Calculated properties - Create unsuccessfully", async function () {
    let newProperty: CalculatedPropertyCreate = {
      propertyName: "",
      type: CalculatedPropertyType.Length,
    }
    await expect(mappingsClient.createCalculatedProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Field propertyName of property was invalid when calling createCalculatedProperty.',
    );

    newProperty.propertyName = "Test";
    newProperty.type = CalculatedPropertyType.Undefined;
    await expect(mappingsClient.createCalculatedProperty("-", "-", "-", "-", newProperty)).to.be.rejectedWith(
      'Required field type of property was null or undefined when calling createCalculatedProperty.',
    );
  });

  it("Calculated properties - Update unsuccessfully", async function () {
    const calcPropertyUpdate: CalculatedPropertyUpdate = {};
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      'All properties of property were missing when calling updateCalculatedProperty.',
    );
    calcPropertyUpdate.propertyName = "";
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      'Field propertyName of property was invalid when calling updateCalculatedProperty.',
    );

    calcPropertyUpdate.propertyName = "Test";
    calcPropertyUpdate.type = CalculatedPropertyType.Undefined;
    await expect(mappingsClient.updateCalculatedProperty("-", "-", "-", "-", "-", calcPropertyUpdate)).to.be.rejectedWith(
      'Required field type of property was null or undefined when calling updateCalculatedProperty.',
    );
  });

  it("Custom calculations - Create unsuccessfully", async function () {
    let newCalculation: CustomCalculationCreate = {
      propertyName: "",
      formula: "1+1",
      quantityType: QuantityType.Distance
    }
    await expect(mappingsClient.createCustomCalculation("-", "-", "-", "-", newCalculation)).to.be.rejectedWith(
      'Field propertyName of property was invalid when calling createCustomCalculation.',
    );

    newCalculation.propertyName = "Test";
    newCalculation.formula = "";
    await expect(mappingsClient.createCustomCalculation("-", "-", "-", "-", newCalculation)).to.be.rejectedWith(
      'Required field formula of property was null or undefined when calling createCustomCalculation.',
    );
  });

  it("Custom calculations - Update unsuccessfully", async function () {
    const custCalculationUpdate: CustomCalculationUpdate = {};
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      'All properties of property were missing when calling updateProperty.',
    );
    custCalculationUpdate.propertyName = "";
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      'Field propertyName of property was invalid when calling updateCustomCalculation.',
    );
    custCalculationUpdate.propertyName = "Test";
    custCalculationUpdate.formula = "";
    await expect(mappingsClient.updateCustomCalculation("-", "-", "-", "-", "-", custCalculationUpdate)).to.be.rejectedWith(
      'Required field formula of property was null or undefined when calling updateCustomCalculation.',
    );
  });

  it("Odata - Faulty odata item", async function () {
    const item: ODataItem = {
      name: "Test",
      url: "1/2"
    }
    let response = await oDataClient.getODataReportEntity("-", "-", item); 
    expect(response).to.be.undefined;
  });
});