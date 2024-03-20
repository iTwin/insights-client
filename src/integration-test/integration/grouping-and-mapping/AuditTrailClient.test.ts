/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { accessToken, auditTrailClient, testIModel } from "../../utils";

describe("Audit trail client integration tests", ()=>{
  it("Audit Trail Client - Get Audit Trail", async ()=>{
    const auditTrail = await auditTrailClient.getAuditTrail(accessToken, testIModel.id);
    expect(auditTrail).not.be.undefined;
  });

  it("Audit Trail Client - Get Audit Trail with path and top parameters", async ()=>{
    const auditTrail = await auditTrailClient.getAuditTrail(accessToken, testIModel.id, "mappings", undefined, undefined, 2);

    expect(auditTrail.auditTrailEntries.length).to.be.equal(2);
    expect(auditTrail._links.next).not.be.undefined;
  });
});
