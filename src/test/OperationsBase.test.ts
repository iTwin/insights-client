/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import type { ECProperty } from "../reporting";
import { DataType } from "../reporting";
import { OperationsBase } from "../reporting/OperationsBase";
import "isomorphic-fetch";
use(chaiAsPromised);

interface IOperationsBase {
  createRequest(operation: string, accessToken: string, content?: string): RequestInit;
  fetchData(nextUrl: string, requestOptions: RequestInit): Promise<Response>;
  fetchJSON<T>(nextUrl: string, requestOptions: RequestInit): Promise<T>;
  isSimpleIdentifier(name: string | null | undefined): boolean;
  isNullOrWhitespace(input: string | null | undefined): boolean;
  isValidECProperty (prop: ECProperty): boolean;
  topIsValid(top: number | undefined): boolean;
}

describe("OperationsBase", () => {
  const operationsBase = new OperationsBase() as unknown as IOperationsBase;

  afterEach(() => {
    sinon.restore();
  });

  it("isSimpleIdentifier", () => {
    expect(operationsBase.isSimpleIdentifier("")).to.be.false;
    expect(operationsBase.isSimpleIdentifier(" Test")).to.be.false;
    expect(operationsBase.isSimpleIdentifier("Test 1")).to.be.false;
    expect(operationsBase.isSimpleIdentifier("Test!")).to.be.false;
    expect(operationsBase.isSimpleIdentifier("!Test")).to.be.false;
    expect(operationsBase.isSimpleIdentifier("0Test")).to.be.false;
    expect(operationsBase.isSimpleIdentifier(
      "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest"
    )).to.be.false;
    expect(operationsBase.isSimpleIdentifier("Test")).to.be.true;
    expect(operationsBase.isSimpleIdentifier("_Test")).to.be.true;
    expect(operationsBase.isSimpleIdentifier("Test0")).to.be.true;
    expect(operationsBase.isSimpleIdentifier("Test_name")).to.be.true;
    expect(operationsBase.isSimpleIdentifier("_")).to.be.true;
  });

  it("isNullOrWhitespace", () => {
    expect(operationsBase.isNullOrWhitespace("")).to.be.true;
    expect(operationsBase.isNullOrWhitespace("       ")).to.be.true;
    expect(operationsBase.isNullOrWhitespace("Test")).to.be.false;
    expect(operationsBase.isNullOrWhitespace("  Test  ")).to.be.false;
  });

  it("isValid", () => {
    const stub = sinon.stub(operationsBase, "isNullOrWhitespace");
    stub.returns(false);
    stub.withArgs("").returns(true);

    const prop: ECProperty = {
      ecSchemaName: "Name",
      ecClassName: "Class",
      ecPropertyName: "Property",
      ecPropertyType: DataType.Integer,
    };
    expect(operationsBase.isValidECProperty(prop)).to.be.true;

    prop.ecClassName = "";
    expect(operationsBase.isValidECProperty(prop)).to.be.false;

    prop.ecClassName = "Class";
    prop.ecPropertyName = "";
    expect(operationsBase.isValidECProperty(prop)).to.be.false;

    prop.ecPropertyName = "Property";
    prop.ecSchemaName = "";
    expect(operationsBase.isValidECProperty(prop)).to.be.false;

    prop.ecSchemaName = "Name";
    prop.ecPropertyType = DataType.Undefined;
    expect(operationsBase.isValidECProperty(prop)).to.be.false;
  });

  it("fetch", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    let myOptions = { status: 200, statusText: "Test" };
    const body = {
      test: "test",
    };
    let response: Response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    let realResponse = await operationsBase.fetchJSON("-", {});
    expect(realResponse).to.not.be.undefined;

    myOptions = { status: 204, statusText: "Test" };
    response = new Response("", myOptions);
    fetchStub.resolves(response);
    realResponse = await operationsBase.fetchJSON("-", {});
    expect(realResponse).to.not.be.undefined;

    myOptions = { status: 400, statusText: "Test" };
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    await expect(operationsBase.fetchJSON("-", {})).to.be.rejected;

    myOptions = { status: 200, statusText: "Test" };
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    realResponse = await operationsBase.fetchData("-", {});
    expect(realResponse).to.not.be.undefined;

    myOptions = { status: 400, statusText: "Test" };
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    await expect(operationsBase.fetchData("-", {})).to.be.rejected;
  });

  it("createRequest", () => {
    let response: RequestInit;
    response = operationsBase.createRequest("GET", "5");
    expect(response).to.not.be.undefined;
    expect(response.body).to.be.undefined;
    expect(response.method).to.be.eq("GET");
    expect(response.headers).to.be.deep.eq({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: "5",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    });
    response = operationsBase.createRequest("PATCH", "10", "Object");
    expect(response).to.not.be.undefined;
    expect(response.body).to.be.eq("Object");
    expect(response.method).to.be.eq("PATCH");
    expect(response.headers).to.be.deep.eq({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Authorization": "10",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Accept": "application/vnd.bentley.itwin-platform.v1+json",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Content-Type": "application/json",
    });
  });
});
