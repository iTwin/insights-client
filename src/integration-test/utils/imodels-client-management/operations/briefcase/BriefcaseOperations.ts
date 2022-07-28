/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { EntityListIterator } from "../../../../../reporting/iterators/EntityListIterator";
import { EntityListIteratorImpl } from "../../../../../reporting/iterators/EntityListIteratorImpl";
import { Briefcase, BriefcasesResponse, OperationsBase, PreferReturn } from "../../base";
import { OperationOptions } from "../OperationOptions";
import { GetBriefcaseListParams } from "./BriefcaseOperationParams";

export class BriefcaseOperations<TOptions extends OperationOptions> extends OperationsBase<TOptions> {
  /**
   * Gets Briefcases of a specific iModel. This method returns Briefcases in their full representation. The returned iterator
   * internally queries entities in pages. Wraps the
   * {@link https://developer.bentley.com/apis/imodels/operations/get-imodel-briefcases/ Get iModel Briefcases}
   * operation from iModels API.
   * @param {GetBriefcaseListParams} params parameters for this operation. See {@link GetBriefcaseListParams}.
   * @returns {EntityListIterator<Briefcase>} iterator for Briefcase list. See {@link EntityListIterator}, {@link Briefcase}.
   */
  public getRepresentationList(params: GetBriefcaseListParams): EntityListIterator<Briefcase> {
    return new EntityListIteratorImpl(async () => this.getEntityCollectionPage<Briefcase>({
      authorization: params.authorization,
      url: this._options.urlFormatter.getBriefcaseListUrl({ iModelId: params.iModelId, urlParams: params.urlParams }),
      preferReturn: PreferReturn.Representation,
      entityCollectionAccessor: (response: unknown) => (response as BriefcasesResponse<Briefcase>).briefcases
    }));
  }
}
