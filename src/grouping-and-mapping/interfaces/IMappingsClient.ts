import { AccessToken } from "@itwin/core-bentley";
import { Mapping, MappingCreate } from "./Mappings";

export interface IMappingsClient{
  /**
     * Creates a Mapping for an iModel.
     * @param {string} accessToken OAuth access token with scope `insights:modify`.
     * @param {MappingCreate} mapping Request body.
     * @memberof ReportingClient
     * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/create-mapping/
     */
  createMapping(
    accessToken: AccessToken,
    mapping: MappingCreate
  ): Promise<Mapping>;

  /**
   * Deletes a Mapping for an iModel.
   * @param {string} accessToken OAuth access token with scope `insights:modify`.
   * @param {string} mappingId The Mapping Id.
   * @memberof ReportingClient
   * @link https://developer.bentley.com/apis/grouping-and-mapping/operations/delete-mapping/
   */
  deleteMapping(
    accessToken: AccessToken,
    mappingId: string
  ): Promise<Response>;
}
