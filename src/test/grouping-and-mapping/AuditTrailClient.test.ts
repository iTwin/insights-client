/* eslint-disable @typescript-eslint/naming-convention */
/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AuditTrailClient } from "../../grouping-and-mapping/clients/AuditTrailClient";
import { AuditTrailCollection } from "../../grouping-and-mapping/interfaces/AuditTrail";
import { expect } from "chai";
import * as sinon from "sinon";

describe("Audit trail client test", ()=> {
  const auditTrailClient: AuditTrailClient = new AuditTrailClient();
  let fetchStub: sinon.SinonStub;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(auditTrailClient, "fetchJSON" as any);
    requestStub = sinon.stub(auditTrailClient, "createRequest" as any);
    requestStub.returns("pass");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Audit Trail Client - Get AuditTrail no optional parameters", async ()=> {
    const returns: AuditTrailCollection = {
      auditTrailEntries: [],
      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/grouping-and-mapping/audit?iModelId=iModelId",
        },
      },
    };
    fetchStub.resolves(returns);

    const auditTrail = await auditTrailClient.getAuditTrail("authToken", "iModelId");

    expect(auditTrail).not.be.undefined;
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/audit?iModelId=iModelId",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;

  });

  it("Audit Trail Client - Get AuditTrail with path and top parameter", async ()=> {
    const returns: AuditTrailCollection = {
      auditTrailEntries: [{
        timestamp: "2023-08-02T10:37:29.4840808+00:00",
        path: "mappings/mappingId",
        userEmail: "john.doe@example.com",
        action: "Update",
        changes: [{
          property: "mappingName",
          oldValue: "Mapping_name_old",
          newValue: "Mapping_name_new",
        },
        {
          property: "extractionEnabled",
          oldValue: "false",
          newValue: "true",
        },
        ],
      }],
      _links: {
        next: undefined,
        self: {
          href: "https://api.bentley.com/grouping-and-mapping/audit?iModelId=iModelId&path=mappings&$top=1",
        },
      },
    };
    fetchStub.resolves(returns);

    const auditTrail = await auditTrailClient.getAuditTrail("authToken", "iModelId", "mappings", undefined, undefined, 1);

    expect(auditTrail).not.be.undefined;
    expect(fetchStub.calledWith(
      "https://api.bentley.com/grouping-and-mapping/audit?iModelId=iModelId&path=mappings&$top=1",
      "pass",
    )).to.be.true;
    expect(requestStub.calledWith(
      "GET",
      "authToken",
    )).to.be.true;
  });
});
