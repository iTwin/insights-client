/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import { delay } from "../common/Utils";

describe("Utils", () => {
  it("delay halts execution when awaited", async () => {
    const start = new Date();
    await delay(100);
    const end = new Date();
    expect(end.getTime() - start.getTime()).to.be.greaterThanOrEqual(100);
  });
});
