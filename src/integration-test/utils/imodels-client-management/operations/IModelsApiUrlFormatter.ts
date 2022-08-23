/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { OrderBy } from "../base/interfaces/CommonInterfaces";
import type { Dictionary } from "../base/interfaces/UtilityTypes";
import type { GetChangesetListUrlParams } from "./changeset/ChangesetOperationParams";
import type { GetBriefcaseListUrlParams } from "./briefcase/BriefcaseOperationParams";
import type { CheckpointParentEntityId } from "./checkpoint/CheckpointOperationParams";
import type { GetIModelListUrlParams } from "./imodel/IModelOperationParams";
import type { GetNamedVersionListUrlParams } from "./named-version/NamedVersionOperationParams";

type OrderByForAnyEntity = OrderBy<{ [key: string]: unknown }, string>;
type UrlParameterValue = string | number | OrderByForAnyEntity;

export class IModelsApiUrlFormatter {
  private readonly _regexIgnoreCaseOption = "i";
  private readonly _groupNames = {
    iModelId: "iModelId",
    changesetIndex: "changesetIndex",
    namedVersionId: "namedVersionId",
  };
  private readonly _checkpointUrlRegex = new RegExp(`/iModels/(?<${this._groupNames.iModelId}>.*?)/changesets/(?<${this._groupNames.changesetIndex}>.*?)/checkpoint`, this._regexIgnoreCaseOption);
  private readonly _namedVersionUrlRegex = new RegExp(`/iModels/(?<${this._groupNames.iModelId}>.*?)/namedversions/(?<${this._groupNames.namedVersionId}>.*)`, this._regexIgnoreCaseOption);

  constructor(protected readonly baseUrl: string) {
  }

  public getCreateIModelUrl(): string {
    return this.baseUrl;
  }

  public getSingleIModelUrl(params: { iModelId: string }): string {
    return `${this.baseUrl}/${params.iModelId}`;
  }

  public getIModelListUrl(params: { urlParams: GetIModelListUrlParams }): string {
    return `${this.baseUrl}${this.formQueryString({ ...params.urlParams })}`;
  }

  public getBriefcaseListUrl(params: { iModelId: string, urlParams?: GetBriefcaseListUrlParams }): string {
    return `${this.baseUrl}/${params.iModelId}/briefcases${this.formQueryString({ ...params.urlParams })}`;
  }

  public getChangesetListUrl(params: { iModelId: string, urlParams?: GetChangesetListUrlParams }): string {
    return `${this.baseUrl}/${params.iModelId}/changesets${this.formQueryString({ ...params.urlParams })}`;
  }

  public getNamedVersionListUrl(params: { iModelId: string, urlParams?: GetNamedVersionListUrlParams }): string {
    return `${this.baseUrl}/${params.iModelId}/namedversions${this.formQueryString({ ...params.urlParams })}`;
  }

  public getCheckpointUrl(params: { iModelId: string } & CheckpointParentEntityId): string {
    const parentEntityUrlPath = params.namedVersionId
      ? `namedversions/${params.namedVersionId}`
      : `changesets/${params.changesetId ?? params.changesetIndex}`;

    return `${this.baseUrl}/${params.iModelId}/${parentEntityUrlPath}/checkpoint`;
  }

  protected formQueryString(urlParameters: Dictionary<UrlParameterValue> | undefined): string {
    let queryString = "";
    for (const urlParameterKey in urlParameters) {
      if (!Object.prototype.hasOwnProperty.call(urlParameters, urlParameterKey)) {
        continue;
      }

      const urlParameterValue = urlParameters[urlParameterKey];
      if (!this.shouldAppendToUrl(urlParameterValue)) {
        continue;
      }

      queryString = this.appendToQueryString(queryString, urlParameterKey, urlParameterValue);
    }

    return queryString;
  }

  private shouldAppendToUrl(urlParameterValue: UrlParameterValue): boolean {
    if (urlParameterValue === null || urlParameterValue === undefined) {
      return false;
    }

    if (typeof urlParameterValue === "string" && !urlParameterValue.trim()) {
      return false;
    }

    return true;
  }

  private appendToQueryString(existingQueryString: string, parameterKey: string, parameterValue: UrlParameterValue): string {
    const separator = existingQueryString.length === 0 ? "?" : "&";
    return `${existingQueryString}${separator}${parameterKey}=${this.stringify(parameterValue)}`;
  }

  private stringify(urlParameterValue: UrlParameterValue): string {
    if (this.isOrderBy(urlParameterValue)) {
      let result: string = urlParameterValue.property;
      if (urlParameterValue.operator) {
        result += ` ${urlParameterValue.operator}`;
      }

      return result;
    }

    return urlParameterValue.toString();
  }

  private isOrderBy(parameterValue: UrlParameterValue): parameterValue is OrderByForAnyEntity {
    return (parameterValue as OrderByForAnyEntity).property !== undefined;
  }
}
