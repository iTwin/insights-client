/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/**
 * Reporting
 * - Reporting is a resource for aggregating iTwin data to build custom dashboards and integrate iTwin data with your business applications.
 * - Create digital twin based reports which can be consumed through business intelligence applications such as Power BI.
 * - Leverage the OData feed Data Access to generate reports by combining data from multiple data streams in the digital twin.
 */

export * from "./interfaces/CalculatedProperties"; // TODO: REMOVE
export * from "./interfaces/CustomCalculations";  // TODO: REMOVE
export * from "../common/Errors";
export * from "./interfaces/ExtractionProcess";
export * from "./interfaces/GroupProperties"; // TODO: REMOVE
export * from "./interfaces/Groups"; // TODO: REMOVE
export * from "./interfaces/Mappings"; // TODO: REMOVE
export * from "./interfaces/OData";
export * from "./interfaces/Reports";
export * from "./interfaces/AggregationProperties";
export * from "./clients/MappingsClient"; // TODO: REMOVE
export * from "./clients/ReportsClient";
export * from "./clients/ODataClient";
export * from "./clients/ExtractionClient";
export * from "./clients/AggregationsClient";
export * from "./clients/IMappingsClient"; // TODO: REMOVE
export * from "./clients/IReportsClient";
export * from "./clients/IODataClient";
export * from "./clients/IExtractionClient";
export * from "./clients/IAggregationsClient";
