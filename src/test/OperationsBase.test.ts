/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import * as sinon from "sinon";
import "isomorphic-fetch";
import { OperationsBase } from "../common/OperationsBase";
use(chaiAsPromised);

interface IOperationsBase {
  createRequest(operation: string, accessToken: string, content?: string): RequestInit;
  fetchData(nextUrl: string, requestOptions: RequestInit): Promise<Response>;
  fetchJSON<T>(nextUrl: string, requestOptions: RequestInit): Promise<T>;
  isSimpleIdentifier(name: string | null | undefined): boolean;
  isNullOrWhitespace(input: string | null | undefined): boolean;
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

  it("fetch", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    let myOptions = { status: 200, statusText: "Test" };
    const body = {
      test: "test",
    };
    let response: Response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    let realResponse = await operationsBase.fetchJSON("url", {});
    expect(realResponse).to.not.be.undefined;

    myOptions = { status: 204, statusText: "Test" };
    response = new Response(undefined, myOptions);
    fetchStub.resolves(response);
    realResponse = await operationsBase.fetchJSON("url", {});
    expect(realResponse).to.not.be.undefined;

    myOptions = { status: 400, statusText: "Test" };
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    await expect(operationsBase.fetchJSON("url", {})).to.be.rejected;

    myOptions = { status: 200, statusText: "Test" };
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    realResponse = await operationsBase.fetchData("url", {});
    expect(realResponse).to.not.be.undefined;

    myOptions = { status: 400, statusText: "Test" };
    response = new Response(JSON.stringify(body), myOptions);
    fetchStub.resolves(response);
    await expect(operationsBase.fetchData("url", {})).to.be.rejected;
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
