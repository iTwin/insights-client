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
  const operationsBase = new OperationsBase("mock") as unknown as IOperationsBase;

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
      "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest",
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

  it("fetch retries on 429", async () => {
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    const headers = new Headers();
    headers.set("Retry-After", "1");
    fetchStub.onFirstCall().resolves(new Response(null, { status: 429, headers }));
    fetchStub.onSecondCall().resolves(new Response(null, { status: 204 }));

    const response = await operationsBase.fetchJSON("url", {});
    expect(response).to.not.be.undefined;
  });

  it("fetch has a maximum of 3 attempts for 429 responses", async () => {
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    const headers = new Headers();
    headers.set("Retry-After", "0");
    fetchStub.resolves(new Response(null, { status: 429, headers }));

    await expect(operationsBase.fetchJSON("url", {})).to.be.rejected;
    expect(fetchStub.callCount).to.be.eq(3);
  });

  it("fetch has no Retry-After header handling after last attempt", async () => {
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    const zeroHeaders = new Headers();
    zeroHeaders.set("Retry-After", "0");
    fetchStub.onFirstCall().resolves(new Response(null, { status: 429, headers: zeroHeaders }));
    fetchStub.onSecondCall().resolves(new Response(null, { status: 429, headers: zeroHeaders }));
    const lastHeaders = new Headers();
    const headerStub = sinon.stub(lastHeaders, "get");
    fetchStub.onThirdCall().resolves(new Response(null, { status: 429, headers: lastHeaders }));

    await expect(operationsBase.fetchJSON("url", {})).to.be.rejected;
    expect(headerStub.callCount).to.be.eq(0);
  });

  it("fetch retries on ECONNRESET", async () => {
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    fetchStub.onFirstCall().rejects({ code: "ECONNRESET" });
    fetchStub.onSecondCall().resolves(new Response(null, { status: 204 }));

    const response = await operationsBase.fetchJSON("url", {});
    expect(response).to.not.be.undefined;
    expect(fetchStub.callCount).to.be.eq(2);
  });

  it("fetch retries on InternalServerError", async () => {
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    fetchStub.onFirstCall().resolves(new Response(null, { status: 500 }));
    fetchStub.onSecondCall().resolves(new Response(null, { status: 204 }));

    const response = await operationsBase.fetchJSON("url", {});
    expect(response).to.not.be.undefined;
    expect(fetchStub.callCount).to.be.eq(2);
  });

  it("fetch throws on unknown error", async () => {
    const err = new Error();
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    fetchStub.onFirstCall().rejects(err);

    await expect(operationsBase.fetchJSON("url", {})).to.be.rejectedWith(err);
    expect(fetchStub.callCount).to.be.eq(1);
  });

  it("fetch throws on error with unknown code", async () => {
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    fetchStub.onFirstCall().rejects({ code: "not handled" });

    await expect(operationsBase.fetchJSON("url", {})).to.be.rejected;
    expect(fetchStub.callCount).to.be.eq(1);
  });

  it("fetch throws on errow without code", async () => {
    const fetchStub = sinon.stub(operationsBase, "fetch" as any);
    fetchStub.onFirstCall().rejects({});

    await expect(operationsBase.fetchJSON("url", {})).to.be.rejected;
    expect(fetchStub.callCount).to.be.eq(1);
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
