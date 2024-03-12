/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { MappingCreate } from "../../../grouping-and-mapping";
import { accessToken, mappingsClient, testIModel } from "../../utils";

describe("Extraction Client", ()=> {
  let mappingId: string;
  // let extractionId: string;

  before(async () => {
    const newMap: MappingCreate = {
      mappingName: "Test",
      iModelId: testIModel.id,
    };
    const map = await mappingsClient.createMapping(accessToken, newMap);
    mappingId = map.id;

  });

  after(async () => {
    await mappingsClient.deleteMapping(accessToken, mappingId);
  });
});
