const chai = require('chai').use(require('chai-as-promised'));
import { expect } from 'chai';
import * as sinon from 'sinon';
import { DataType, ECProperty } from '../reporting';
import { OperationsBase } from '../reporting/OperationsBase';
import * as isomorphicFetch from "cross-fetch"
import 'isomorphic-fetch';

chai.should();
describe("OperationsBase", () => {
  const operationsBase = new OperationsBase();

  afterEach(() => {
    sinon.restore();
  })

  it("isSimpleIdentifier", () => {
    expect(operationsBase.isSimpleIdentifier("")).to.be.equals(false);
    expect(operationsBase.isSimpleIdentifier(" Test")).to.be.equals(false);
    expect(operationsBase.isSimpleIdentifier("Test 1")).to.be.equals(false);
    expect(operationsBase.isSimpleIdentifier("Test!")).to.be.equals(false);
    expect(operationsBase.isSimpleIdentifier("!Test")).to.be.equals(false);
    expect(operationsBase.isSimpleIdentifier("0Test")).to.be.equals(false);
    expect(operationsBase.isSimpleIdentifier(
      "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest"
      )).to.be.equals(false);
    expect(operationsBase.isSimpleIdentifier("Test")).to.be.equals(true);
    expect(operationsBase.isSimpleIdentifier("_Test")).to.be.equals(true);
    expect(operationsBase.isSimpleIdentifier("Test0")).to.be.equals(true);
    expect(operationsBase.isSimpleIdentifier("Test_name")).to.be.equals(true);
    expect(operationsBase.isSimpleIdentifier("_")).to.be.equals(true);
  });

  it("isNullOrWhitespace", () => {
    expect(operationsBase.isNullOrWhitespace("")).to.be.equals(true);
    expect(operationsBase.isNullOrWhitespace("       ")).to.be.equals(true);
    expect(operationsBase.isNullOrWhitespace("Test")).to.be.equals(false);
    expect(operationsBase.isNullOrWhitespace("  Test  ")).to.be.equals(false);
  });

  it("isValid", () => {
    const stub = sinon.stub(OperationsBase.prototype, "isNullOrWhitespace");
    stub.returns(false);
    stub.withArgs("").returns(true);

    const prop: ECProperty = {
      ecSchemaName: "Name",
      ecClassName: "Class",
      ecPropertyName: "Property",
      ecPropertyType: DataType.Integer
    };
    expect(operationsBase.isValidECProperty(prop)).to.be.equals(true);

    prop.ecClassName = "";
    expect(operationsBase.isValidECProperty(prop)).to.be.equals(false);

    prop.ecClassName = "Class";
    prop.ecPropertyName = "";
    expect(operationsBase.isValidECProperty(prop)).to.be.equals(false);

    prop.ecPropertyName = "Property";
    prop.ecSchemaName = "";
    expect(operationsBase.isValidECProperty(prop)).to.be.equals(false);

    prop.ecSchemaName = "Name";
    prop.ecPropertyType = DataType.Undefined;
    expect(operationsBase.isValidECProperty(prop)).to.be.equals(false);
  });

  it("fetch", async () => {
    const stub = sinon.stub(operationsBase, "fetch");
    let myOptions = { status: 200, statusText: "Test" };
    const body = {
      "Test": "test"
    }
    let response: Response = new Response(JSON.stringify(body), myOptions);
    stub.resolves(response);
    let realResponse = await operationsBase.fetchData("-", {});
    expect(realResponse).to.not.be.undefined;

    myOptions = { status: 204, statusText: "Test" };
    response = new Response(JSON.stringify(body), myOptions);
    stub.resolves(response);
    realResponse = await operationsBase.fetchData("-", {});
    expect(realResponse).to.not.be.undefined;

    myOptions = { status: 400, statusText: "Test" };
    response = new Response(JSON.stringify(body), myOptions);
    stub.resolves(response);
    await expect(operationsBase.fetchData("-", {})).to.be.rejected;

    let isoFetch = operationsBase.fetch;
    expect(isoFetch).to.not.be.undefined;
  });

  it("createRequest", () => {
    let response: RequestInit;
    response = operationsBase.createRequest("GET", "5");
    expect(response).to.not.be.undefined;
    expect(response.body).to.be.undefined;
    expect(response.method).to.be.equals("GET");
    expect(response.headers).to.be.deep.equals({
      Authorization: '5',
      Accept: 'application/vnd.bentley.itwin-platform.v1+json'
    });
    response = operationsBase.createRequest("PATCH", "10", "Object");
    expect(response).to.not.be.undefined;
    expect(response.body).to.be.equals("Object");
    expect(response.method).to.be.equals("PATCH");
    expect(response.headers).to.be.deep.equals({
      Authorization: '10',
      Accept: 'application/vnd.bentley.itwin-platform.v1+json',
      'Content-Type': "application/json",
    });
  })
});