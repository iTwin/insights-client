/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/**
 * Grouping and mapping
 * The Grouping and Mapping API is a tool for re imagining your iModel data in a more concise, precise,
 * and optimized representation for any variety of downstream applications.
 * Specific solutions built on top of iModels often do not require the full breadth of the contained data, and different solutions often require redundant
 * configuration steps to filter iModel data down to the needed subset.
 * With the Grouping and Mapping API you can define any number of Mappings, Groups, and Properties as a one-time,
 * reusable configuration that codes a reduced view of the data which can then be reused as configuration across all applicable workflows.
 */
export * from "./interfaces/Mappings";
export * from "./interfaces/IMappingsClient";
export * from "./clients/MappingsClient";

export * from "./interfaces/Groups";
export * from "./interfaces/IGroupsClient";
export * from "./clients/GroupsClient";

export * from "./interfaces/Properties";
export * from "./interfaces/IPropertiesClient";
export * from "./clients/PropertiesClient";

export * from "./interfaces/Extraction";
export * from "./interfaces/IExtractionClient";
export * from "./clients/ExtractionClient";

export * from "./interfaces/CDM";
export * from "./interfaces/ICDMClient";
export * from "./clients/CDMClient";

export * from "./interfaces/AuditTrail";
export * from "./interfaces/IAuditTrailClient";
export * from "./clients/AuditTrailClient";
