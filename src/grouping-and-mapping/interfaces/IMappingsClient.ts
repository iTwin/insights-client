import { AccessToken } from "@itwin/core-bentley";
import { Mapping, MappingCreate, MappingUpdate } from "./Mappings";

export interface IMappingsClient {
  /**
     * Creates a Mapping for an iModel.
     * @param {string} accessToken OAuth access token with scope `imodels:modify`.
     * @param {MappingCreate} mapping Request body.
     * @memberof MappingsClient
     * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/create-mapping/
     */
  createMapping(accessToken: AccessToken, mapping: MappingCreate): Promise<Mapping>;

  /**
   * Deletes a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with scope `imodels:modify`.
   * @param {string} mappingId The Mapping Id.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/delete-mapping/
   */
  deleteMapping(accessToken: AccessToken, mappingId: string): Promise<Response>;

  /**
   * Gets a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with scope `imodels:read`.
   * @param {string} mappingId The Mapping Id.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-mapping/
   */
  getMapping(accessToken: AccessToken, mappingId: string): Promise<Mapping>;

  /**
   * Gets all mappings of an iModel.
   * @param {string} accessToken OAuth access token with scope `imodels:read`.
   * @param {string} iModelId The iModel Id.
   * @param {number} top Optional max items to be sent in response.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/get-mappings/
   */
  // getMappings(accessToken: AccessToken, iModelId: string, top?: number): Promise<Mapping[]>;

  /**
   * Updates a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with scope `imodels:modify`.
   * @param {string} mappingId The Mapping Id.
   * @memberof MappingsClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/update-mapping/
   */
  updateMapping(accessToken: AccessToken, mappingId: string, mappingUpdate: MappingUpdate): Promise<Mapping>;
}
