/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import { expect } from "chai";
import type { AccessToken } from "@itwin/core-bentley";
import { TestConfig } from "../TestConfig";
import { ReportingClient } from "./../../reporting/reportingClient";

chai.should();
describe("ReportingClient", () => {
  const reportingCLient: ReportingClient = new ReportingClient();
  const projectId = "8b4b17c9-2a99-4e83-9637-c587bef27e30";
  const imodelId = "8d73d54f-a340-4fad-b579-07403541cd99";
  const mappingId = "30dc87ab-2661-449f-b5c1-e8961226f3c4";
  const groupId = "4e5fc52b-25af-474e-9ecf-33756c2cece4";
  let accessToken: AccessToken;

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
    accessToken =
      "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlFBSU1TLkJFTlRMRVkiLCJwaS5hdG0iOiJhOG1lIn0.eyJzY29wZSI6WyJpbnNpZ2h0czpyZWFkIiwiaW5zaWdodHM6bW9kaWZ5Il0sImNsaWVudF9pZCI6Iml0d2luLWRldmVsb3Blci1jb25zb2xlLXFhIiwiYXVkIjpbImh0dHBzOi8vcWEtaW1zLmJlbnRsZXkuY29tL2FzL3Rva2VuLm9hdXRoMiIsImh0dHBzOi8vcWEtaW1zb2lkYy5iZW50bGV5LmNvbS9hcy90b2tlbi5vYXV0aDIiLCJodHRwczovL3FhMi1pbXMuYmVudGxleS5jb20vYXMvdG9rZW4ub2F1dGgyIiwiaHR0cHM6Ly9xYTItaW1zb2lkYy5iZW50bGV5LmNvbS9hcy90b2tlbi5vYXV0aDIiLCJodHRwczovL3FhLWltc29pZGMuYmVudGxleS5jb20vcmVzb3VyY2VzIiwiaHR0cHM6Ly9xYTItaW1zLmJlbnRsZXkuY29tL3Jlc291cmNlcyIsImJlbnRsZXktYXBpLW1hbmFnZW1lbnQiXSwic3ViIjoiNjQyNjViNTMtNWQyZC00YWMyLTg4OGMtOGRiNDM5NDYyMmMzIiwicm9sZSI6IlNJVEVfQURNSU5JU1RSQVRPUiIsIm9yZyI6IjE1OTc3YmNlLWJiM2EtNGNiZi1iNzkwLTlkZmQ1NTM0ZDQ5YiIsInN1YmplY3QiOiI2NDI2NWI1My01ZDJkLTRhYzItODg4Yy04ZGI0Mzk0NjIyYzMiLCJpc3MiOiJodHRwczovL3FhLWltcy5iZW50bGV5LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6ImF0cF91c2VyMkBiZW50bGV5Lm04ci5jbyIsImdpdmVuX25hbWUiOiJhZG1pbjIiLCJzaWQiOiI2QnM0Q2NiRWZkV1QxS2pEZ0JsdGkyTjJObW8uVVVGSlRWTXRRbVZ1ZEd4bGVTMVZVdy5EVVpoLmkyQXpCZENLQ2oyMTQxUUVUUjNKekY0aFAiLCJuYmYiOjE2NDUwMzc2MjUsInVsdGltYXRlX3NpdGUiOiIxMDA0MTQ0NDI2IiwidXNhZ2VfY291bnRyeV9pc28iOiJFUyIsImF1dGhfdGltZSI6MTY0NTAzNzkyNSwibmFtZSI6ImF0cF91c2VyMkBiZW50bGV5Lm04ci5jbyIsIm9yZ19uYW1lIjoiQmVudGxleUNPTk5FQ1RRQSIsImZhbWlseV9uYW1lIjoiVGVzdGVyMiIsImVtYWlsIjoiYXRwX3VzZXIyQGJlbnRsZXkubThyLmNvIiwiZXhwIjoxNjQ1MDQxNTI3fQ.ZmkIQSVSPxgK1DilL5ANmqzw9A8WhPpZfH5f9-KkCXaQADHaLT2NZSZ2TGMfKjFC0mmz1flg1tBFHHqjm_oiGER8zOLv64qTxNv2EnSLXlzoVomaxjwHXB-DSha7zGaBUIJm6vRWpYId08SMvwZ3UBnZW1N_gT78oRAvmoJk7jgC7WcdMWNuPXYLUcsqWpt-kOPP2rNe4uVDPP7zJs88QVtUogroocBZ1snBDS-cP9Q7UGjTGTSpGGzRINfsY0jAdJI0wSmMcB8wfvCMKM5oDlbX-VRe-3fvCdMb_mj4EZX2qN6wpf9GgVRYhJB0WOFP8XA-mEdxFMiQWIYNmzJ54g";
  });

  it("Get reportis", async () => {
    const reports = await reportingCLient.getReports(accessToken, projectId);
    expect(reports.reports).to.not.be.undefined;
    expect(reports.reports).to.not.be.empty;
  });

  it("Get mappings", async () => {
    const mappings = await reportingCLient.getMappings(accessToken, imodelId);
    expect(mappings).to.not.be.undefined;
    expect(mappings).to.not.be.empty;
  });

  it("Get groups", async () => {
    const groups = await reportingCLient.getGroups(
      accessToken,
      imodelId,
      mappingId
    );
    expect(groups.groups).to.not.be.undefined;
    expect(groups.groups).to.not.be.empty;
  });

  it("Get properties", async () => {
    const properties = await reportingCLient.getGroupProperties(
      accessToken,
      imodelId,
      mappingId,
      groupId
    );
    expect(properties.properties).to.be.not.undefined;
    expect(properties.properties).to.not.be.empty;
  });
});
