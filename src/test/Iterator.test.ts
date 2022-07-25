/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as chaiAsPromised from "chai-as-promised"
import { expect, use } from "chai";
import * as sinon from "sinon";
import { MappingsClient, Mapping, MappingCreate, MappingUpdate, Group, GroupCreate, GroupUpdate, GroupProperty, GroupPropertyCreate, DataType, QuantityType, ECProperty, CalculatedProperty, CalculatedPropertyCreate, CalculatedPropertyType, CustomCalculation, CustomCalculationCreate, MappingCopy } from "../reporting";
import { EntityListIteratorImpl } from "../reporting/iterators/EntityListIteratorImpl";
import { toArray } from "../reporting/iterators/IteratorUtil"
use(chaiAsPromised);

describe("mappings Client", () => {

  it("toArray", async () => {
    const it = new EntityListIteratorImpl(async () => {
      return {
        entities: new Array(0, 1, 2),
        next: undefined
      }
    });
    expect((await toArray(it)).length).to.be.eq(3);
  });

  
});
