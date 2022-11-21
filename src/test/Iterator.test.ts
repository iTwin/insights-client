/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import { EntityListIteratorImpl } from "../common/iterators/EntityListIteratorImpl";
import { toArray } from "../common/iterators/IteratorUtil";
use(chaiAsPromised);

describe("mappings Client", () => {
  it("toArray", async () => {
    const it = new EntityListIteratorImpl(async () => {
      return {
        entities: [0, 1, 2],
        next: undefined,
      };
    });
    expect((await toArray(it)).length).to.be.eq(3);
  });
});
