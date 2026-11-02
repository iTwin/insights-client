/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/naming-convention */
import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { PreferReturn } from "../../common/Common";
import { RequiredError } from "../../common/Errors";
import { toArray } from "../../common/iterators/IteratorUtil";
import { NamedGroupsClient } from "../../named-groups/clients/NamedGroupsClient";
import { INamedGroupsClient } from "../../named-groups/interfaces/INamedGroupsClient";
import { NamedGroup, NamedGroupContainer, NamedGroupCreate, NamedGroupList, NamedGroupMinimalList, NamedGroupUpdate } from "../../named-groups/interfaces/NamedGroups";

use(chaiAsPromised);

describe("NamedGroups Client Unit tests", () => {
  const groupsClient: NamedGroupsClient = new NamedGroupsClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(groupsClient, "fetchJSON" as any);
    requestStub = sinon.stub(groupsClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Groups client - Create group", async () => {
    const newGroup: NamedGroupCreate = {
      iTwinId: "iTwinId",
      displayName: "AllElements 🚀",
      description: "Group description",
      query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
      metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
    };

    const returns: NamedGroupContainer = {
      group: {
        id: "1",
        displayName: "AllElements",
        description: "Group description",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
        createdDateTime: "2021-09-03T10:48:45+00:00",
        modifiedDateTime: "2022-01-10T13:44:56+00:00",
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const group = await groupsClient.createNamedGroup("authToken", newGroup);
    expect(group.id).to.be.eq("1");
    expect(group.displayName).to.equal(returns.group.displayName);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "POST",
      "authToken",
      JSON.stringify(newGroup),
    )).to.be.true;
  });

  it("Groups client - Delete group", async () => {
    const returns = {
      status: 204,
    };
    fetchStub.resolves(returns);

    const response = await groupsClient.deleteNamedGroup("authToken", "groupId");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/groupId",
      "pass",
    )).to.be.true;

    expect(response.status).to.be.eq(204);
  });

  it("Groups client - Get group", async () => {
    const returns: NamedGroupContainer = {
      group: {
        id: "1",
        displayName: "AllElements",
        description: "Group description",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
        createdDateTime: "2021-09-03T10:48:45+00:00",
        modifiedDateTime: "2022-01-10T13:44:56+00:00",
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const group = await groupsClient.getNamedGroup("authToken", "1");
    expect(group.id).to.deep.equal("1");
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/1",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;
  });

  it("Groups client - Get groups minimal", async () => {
    const minimalReturns = {
      groups: [
        {
          id: "1",
          displayName: "PhysicalElements",
          description: "A group of physical elements",
          query: "SELECT ECInstanceId, ECClassId FROM BisCore.PhysicalElement",
        },
        {
          id: "2",
          displayName: "AllElements",
          description: "A group of all elements",
          query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        },
      ],
    };

    fetchStub.resolves(minimalReturns);
    const groupsList = await groupsClient.getNamedGroups("authToken", "iTwinId", PreferReturn.Minimal);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/?iTwinId=iTwinId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
      undefined,
      "minimal",
    )).to.be.true;
    expect(groupsList.groups.length).to.equal(2);
  });

  it("Groups client - Get groups representation", async () => {
    const fullReturns = {
      groups: [{
        id: "1",
        displayName: "PhysicalElements",
        description: "A group of physical elements",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.PhysicalElement",
        metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      },
      {
        id: "2",
        displayName: "AllElements",
        description: "A group of all elements",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        metadata: [{ key: "key1", value: "value1" }],
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      }],
      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/named-groups/?iTwinId=iTwinId",
        },
      },
    };

    fetchStub.resolves(fullReturns);
    const groupsList = await groupsClient.getNamedGroups("authToken", "iTwinId", PreferReturn.Representation);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/?iTwinId=iTwinId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
      undefined,
      "representation",
    )).to.be.true;
    expect(groupsList.groups.length).to.equal(2);
    expect(groupsList.groups.every((group) => Array.isArray(group.metadata))).to.be.true;
  });

  it("Groups client - Update a group", async () => {
    const updateGroup: NamedGroupUpdate = {
      displayName: "AllElements",
      description: "Updated description",
      query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
      metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
    };

    const returns: NamedGroupContainer = {
      group: {
        id: "1",
        displayName: "AllElements",
        description: "Updated description",
        query: "SELECT ECInstanceId, ECClassId FROM BisCore.Element",
        metadata: [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }],
        createdDateTime: "2021-09-03T10:48:45+00:00",
        modifiedDateTime: "2022-01-10T13:44:56+00:00",
        _links: {
          iTwin: {
            href: "https://api.bentley.com/itwins/iTwinId",
          },
        },
      },
    };
    fetchStub.resolves(returns);

    const group = await groupsClient.updateNamedGroup("authToken", "1", updateGroup);
    expect(group.id).to.be.eq("1");
    expect(group.description).to.equal(updateGroup.description);
    expect(fetchStub.calledWith(
      "https://api.bentley.com/named-groups/1",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "PATCH",
      "authToken",
      JSON.stringify(updateGroup),
    )).to.be.true;
  });

  describe("tags", () => {
    const client: INamedGroupsClient = groupsClient;
    const responseGroup: NamedGroup = {
      id: "1",
      displayName: "PhysicalElements",
      description: "A group of physical elements",
      query: "SELECT ECInstanceId, ECClassId FROM BisCore.PhysicalElement",
      metadata: [{ key: "discipline", value: "structural" }],
      tags: ["Structural", "Phase-1"],
      createdDateTime: "2021-09-03T10:48:45Z",
      modifiedDateTime: "2022-01-10T01:44:56Z",
      _links: { iTwin: { href: "https://api.bentley.com/itwins/iTwinId" } },
    };

    for (const tags of [undefined, [], ["Structural", "Phase-1"]]) {
      const label = tags === undefined ? "omitted" : JSON.stringify(tags);

      it(`creates a group with tags ${label}`, async () => {
        const body: NamedGroupCreate = {
          iTwinId: "iTwinId",
          displayName: responseGroup.displayName,
          query: responseGroup.query,
          ...(tags === undefined ? {} : { tags }),
        };
        fetchStub.resolves({ group: { ...responseGroup, tags } });

        const group = await client.createNamedGroup("authToken", body);

        expect(group.tags).to.deep.equal(tags);
        expect(requestStub.firstCall.args).to.deep.equal(["POST", "authToken", JSON.stringify(body)]);
        const payload = JSON.parse(requestStub.firstCall.args[2]);
        if (tags === undefined) {
          expect(payload).not.to.have.property("tags");
        } else {
          expect(payload.tags).to.deep.equal(tags);
        }
      });

      it(`updates a group with tags ${label}`, async () => {
        const body: NamedGroupUpdate = tags === undefined ? { description: "Updated" } : { tags };
        fetchStub.resolves({ group: { ...responseGroup, ...body } });

        const group = await client.updateNamedGroup("authToken", responseGroup.id, body);

        expect(group.tags).to.deep.equal(tags ?? responseGroup.tags);
        expect(requestStub.firstCall.args).to.deep.equal(["PATCH", "authToken", JSON.stringify(body)]);
        expect(fetchStub.firstCall.args).to.deep.equal(["https://api.bentley.com/named-groups/1", "pass"]);
        const payload = JSON.parse(requestStub.firstCall.args[2]);
        if (tags === undefined) {
          expect(payload).not.to.have.property("tags");
        } else {
          expect(payload.tags).to.deep.equal(tags);
        }
      });

      it(`reads a group with tags ${label}`, async () => {
        fetchStub.resolves({ group: { ...responseGroup, tags } });

        const group = await client.getNamedGroup("authToken", responseGroup.id);

        expect(group.tags).to.deep.equal(tags);
        expect(requestStub.firstCall.args).to.deep.equal(["GET", "authToken"]);
        expect(fetchStub.firstCall.args[0]).to.equal("https://api.bentley.com/named-groups/1");
      });
    }

    for (const body of [{}, { tags: undefined }]) {
      it(`still rejects an empty update (${Object.keys(body).join(",")})`, async () => {
        await expect(client.updateNamedGroup("authToken", "1", body))
          .to.be.rejectedWith(RequiredError, "At least one property must be provided for update.");
        expect(fetchStub.called).to.be.false;
        expect(requestStub.called).to.be.false;
      });
    }

    for (const preferReturn of [undefined, PreferReturn.Minimal, PreferReturn.Representation]) {
      const { metadata: _metadata, ...withoutMetadata } = responseGroup;
      const groups = preferReturn === PreferReturn.Representation ? [responseGroup] : [withoutMetadata];

      for (const tag of [undefined, "", "Structural", "Phase 1 & review/steel+#?=%\u00e9"]) {
        it(`lists ${preferReturn ?? "default"} groups with tag ${JSON.stringify(tag)}`, async () => {
          fetchStub.resolves({ groups, _links: {} });

          const result: NamedGroupMinimalList | NamedGroupList = preferReturn === PreferReturn.Representation
            ? await client.getNamedGroups("authToken", "iTwinId", preferReturn, 2, tag)
            : await client.getNamedGroups("authToken", "iTwinId", preferReturn, 2, tag);

          const url = new URL(fetchStub.firstCall.args[0]);
          expect(url.origin + url.pathname).to.equal("https://api.bentley.com/named-groups/");
          expect(Array.from(url.searchParams.keys())).to.deep.equal(tag === undefined ? ["iTwinId", "$top"] : ["iTwinId", "$top", "tag"]);
          expect(url.searchParams.get("iTwinId")).to.equal("iTwinId");
          expect(url.searchParams.get("$top")).to.equal("2");
          expect(url.searchParams.get("tag")).to.equal(tag ?? null);
          expect(url.hash).to.equal("");
          expect(requestStub.firstCall.args).to.deep.equal(["GET", "authToken", undefined, preferReturn]);
          expect(result.groups[0].tags).to.deep.equal(responseGroup.tags);
          expect(result.groups[0]).to.deep.equal(groups[0]);
          if (tag === undefined) {
            expect(url.toString()).to.equal("https://api.bentley.com/named-groups/?iTwinId=iTwinId&%24top=2");
          }
        });
      }

      for (const tag of [undefined, "Phase 1 & review/steel+#?=%\u00e9"]) {
        for (const byPage of [false, true]) {
          it(`iterates ${preferReturn ?? "default"} groups ${byPage ? "by page" : "by item"} with tag ${JSON.stringify(tag)}`, async () => {
            const firstUrl = new URL("https://api.bentley.com/named-groups/");
            firstUrl.searchParams.set("iTwinId", "iTwinId");
            firstUrl.searchParams.set("$top", "1");
            if (tag !== undefined) {
              firstUrl.searchParams.set("tag", tag);
            }
            const nextUrl = new URL(firstUrl);
            nextUrl.searchParams.set("$continuationToken", "server+token/=?");
            const secondGroup = { ...groups[0], id: "2" };
            fetchStub.onFirstCall().resolves({ groups, _links: { next: { href: nextUrl.toString() } } });
            fetchStub.onSecondCall().resolves({ groups: [secondGroup], _links: {} });

            const iterator = preferReturn === PreferReturn.Representation
              ? client.getNamedGroupsIterator("authToken", "iTwinId", preferReturn, 1, tag)
              : client.getNamedGroupsIterator("authToken", "iTwinId", preferReturn, 1, tag);
            expect(fetchStub.called).to.be.false;
            if (byPage) {
              expect(await toArray(iterator.byPage())).to.deep.equal([groups, [secondGroup]]);
            } else {
              expect(await toArray(iterator)).to.deep.equal([...groups, secondGroup]);
            }

            expect(fetchStub.callCount).to.equal(2);
            expect(fetchStub.firstCall.args).to.deep.equal([firstUrl.toString(), "pass"]);
            expect(fetchStub.secondCall.args).to.deep.equal([nextUrl.toString(), "pass"]);
            expect(requestStub.calledOnce).to.be.true;
            expect(requestStub.firstCall.args).to.deep.equal(["GET", "authToken", undefined, preferReturn]);
          });
        }
      }
    }

    it("filters without specifying a preference or page size", async () => {
      fetchStub.resolves({ groups: [], _links: {} });

      await client.getNamedGroups("authToken", "iTwinId", undefined, undefined, "Structural");

      expect(fetchStub.firstCall.args[0]).to.equal("https://api.bentley.com/named-groups/?iTwinId=iTwinId&tag=Structural");
      expect(await toArray(client.getNamedGroupsIterator("authToken", "iTwinId", undefined, undefined, "Structural"))).to.deep.equal([]);
      expect(fetchStub.secondCall.args[0]).to.equal(fetchStub.firstCall.args[0]);
    });

    for (const top of [0, -1, 1001]) {
      it(`preserves page size validation with a tag (top=${top})`, async () => {
        await expect(client.getNamedGroups("authToken", "iTwinId", undefined, top, "Structural"))
          .to.be.rejectedWith(RequiredError, "Parameter top was outside of the valid range [1-1000].");
        expect(() => client.getNamedGroupsIterator("authToken", "iTwinId", undefined, top, "Structural"))
          .to.throw(RequiredError, "Parameter top was outside of the valid range [1-1000].");
        expect(fetchStub.called).to.be.false;
      });
    }
  });
});
