/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import { Mapping, MappingCreate, MappingExtractionCollection, MappingList, MappingUpdate } from "./Mappings";
import { EntityListIterator } from "../../common/iterators/EntityListIterator";

export interface IMappingsClient {
  /**
    * Creates a Mapping for an iModel.
    * @param {string} accessToken OAuth access token with imodels:modify or itwin-platform scope.
    * @param {MappingCreate} mapping Request body.
    * @memberof MappingsClient
    * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/create-mapping/
    */
  createMapping(accessToken: AccessToken, mapping: MappingCreate): Promise<Mapping>;

  /**
   * Deletes a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with imodels:modify or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/delete-mapping/
   */
  deleteMapping(accessToken: AccessToken, mappingId: string): Promise<Response>;

  /**
   * Gets a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-mapping/
   */
  getMapping(accessToken: AccessToken, mappingId: string): Promise<Mapping>;

  /**
   * Gets an async paged iterator of Mappings for an iModel.
   * This method returns an iterator which loads pages of mappings as it is being iterated over.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} iModelId The iModel Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-mappings/
   */
  getMappingsIterator(accessToken: AccessToken, iModelId: string, top?: number): EntityListIterator<Mapping>;

  /**
   * Gets all Mappings for an iModel. This method returns the full list of mappings.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} iModelId The iModel Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-mappings/
   */
  getMappings( accessToken: AccessToken, iModelId: string, top?: number): Promise<MappingList>;

  /**
   * Updates a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} mappingId The Mapping Id.
   * @param {MappingUpdate} mappingUpdate Request body.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/update-mapping/
   */
  updateMapping(accessToken: AccessToken, mappingId: string, mappingUpdate: MappingUpdate): Promise<Mapping>;

  /**
   * Gets a list of extractions executed on a mapping.
   * @param {string} accessToken OAuth access token with imodels:read or itwin-platform scope.
   * @param {string} mappingId The Mapping id
   * @param {number} top Optional max items to be sent in response
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-mapping-extractions/
   */
  getMappingExtractions(accessToken: AccessToken, mappingId: string, top?: number): Promise<MappingExtractionCollection>;
}
