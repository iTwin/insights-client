# Change Log - @itwin/insights-client

## 0.17.0
Tuesday, 3 February, 2025
### Minor
- Fixed security vulnerabilities in dependencies.
- Updated `fast-xml-parser` from `^4.0.9` to `^5.3.4`.
- Updated `@itwin/build-tools` and `@itwin/core-bentley` from `^4.8.6` to `^5.5.2`.
- Updated `@itwin/oidc-signin-tool` from `^4.3.7` to `^5.1.0`.
- Updated `typescript` from `^5.0.0` to `^5.9.3`.
- Removed unused `chromium` dev dependency.

## 0.16.0
Tuesday, 21 January, 2025
### Minor
- Added `createdDateTime` and `modifiedDateTime` in `NamedGroupMinimal`

## 0.15.1
Tuesday, 17 December, 2024
### Patch
- Fixed a 'fetch' illegal invocation error for browsers.

## 0.15.0
Tuesday, 12 November, 2024
### Minor
- Upgraded `cross-fetch` to version `4.0.0`.
- Added retries on responses with status codes `408`, `500`, `502`, `503`, `504`, `521`, `522`, `524`, in addition to handling just `429`.
- Added retries on request errors with codes `ETIMEDOUT`, `ECONNRESET`, `EADDRINUSE`, `ECONNREFUSED`, `EPIPE`, `ENOTFOUND`, `ENETUNREACH`, `EAI_AGAIN`, and `ECONNABORTED`.
- Added a delay fallback for non-number Retry-After headers for `429` responses.

## 0.14.0
Thursday, 19 September, 2024
### Minor
- Added `NamedGroupsClient`.
- `OperationsBase` now requires a base path.

## 0.13.0
Tuesday, 10 September, 2024
### Minor
- Added `odata` link to the `ReportLinks` response object interface.

## 0.12.0
Wednesday, 14 August, 2024
### Minor
- Removed `groupingAndMappingBasePath` parameter from `OperationsBase` constructor. The `Grouping and Mapping` related clients now read from `basePath`. 

## 0.11.1
Wednesday, 14 August, 2024
### Patch
- `CVE-2024-39338` patch.

## 0.11.0
Thursday, 8 August, 2024
### Minor
- Updated `carbon-calculation` interfaces and clients to support the new EC3 workflow. 
  - Interfaces matching `EC3(Configuration|Job).*` are used in both workflows.
  - Interfaces matching `EC3Report(Configuration|Job).*` refer to the old workflow (coupled with reports)
  - Interfaces matching `EC3Extraction(Configuration|Job).*` refer to the new workflow (coupled with extractions)

## 0.10.3
Wednesday, 19 June, 2024
### Patch
- Added ODataTable annotations to the OData metadata response.

## 0.10.2
Monday, 10 June, 2024
### Patch
- Exposed IOCLCAJobsClient interface
  
## 0.10.1
Wednesday, 3 April, 2024
### Patch
- Exposed common types
  - `PreferReturn`

## 0.10.0
Tuesday, 2 April, 2024
### Minor
- Reverted minor version due to incorrect property fields.

## 0.9.0
Monday, 1 April, 2024
### Minor
- Re-Added `Undefined` field to `DataType`, `QuantityType` and `CalculatedPropertyType`.

## 0.8.0
Thu, 28 March, 2024
### Minor
- New `Metadata` property for all Group CRUD operations.

## 0.7.0
Fri, 15 March, 2024
### Minor
- Removed old versions of `Mappings Client` from reporting.
- Removed old version of `Extraction Client` from reporting.
- Removed old exports from reporting/index.ts
- Added `grouping-and-mapping` folder for new version clients.
- Added new `Mappings, Groups, Properties, Extraction, CDM, AuditTrail` clients to grouping-and-mapping.
- Added new interfaces for grouping-and-mapping clients.
- Added grouping-and-mapping integration tests and unit tests.
- Updated `GlobalSetup.ts` with new grouping-and-mapping clients.
- Updated integration tests to use the new grouping-and-mapping clients.
- Updated exports in `insights-client.ts` to export new clients from grouping-and-mapping.
- Moved `Errors.ts` to `common` folder.

## 0.6.0
Tuesday, 12 December, 2023
### Minor
- Fixed `ExtractionLog` `message` type.

## 0.5.4
Tuesday, 12 December, 2023
### Patches
- Added `GroupCreateCopy` and `SourceGroupReference` interfaces.
- Added new base path `GROUPING_AND_MAPPING_BASE_PATH`.
- Added `copyGroup` function to implement group copying functionaliy.

## 0.5.3
Tuesday, 19 September, 2023
### Patches
- Added `ExtractionRunRequest` interface.
- Added optional `extractionRequest` parameter in `runExtraction` function to specify Extraction properties.

## 0.5.2
Tuesday, 12 July, 2023
### Patches
- Added `AggregationClient` and `IAggregationClient` files to clients and `AggregationProperties` to interfaces for implementing the aggregation functionalities.
- Added funtions in `IReportsClient`, `ReportsClient` and `Reports` to implement the aggregation functionalities.
- Added the unit tests and integration tests for the aggregation client functionalities.

## 0.5.1
Fri, 7 Jul 2023
### Patches
- Added handling of responses with status code 429 Too Many Requests. Now the client will retry such responses, delaying each retry by the amount of seconds specified in the Retry-After response header. A maximum of 3 attempts will be made per request.

## 0.5.0
Wed, 5 Jul 2023
### Minor
- ### Changes to Interfaces
  - `EC3ConfigurationClient` `getConfigurations` return type has been corrected to match actual response.
    - `EC3Configuration` > `EC3ConfigurationMinimal`

## 0.4.0
Thu, 3 Mar 2023
### Minor
- Removed `url` dependency.
- Environment variables for example, `IMJS_URL_PREFIX`, have been removed.
- ### Renamed OneClickLCA Client and methods

  - `OneClickLCAClient` > `OCLCAJobsClient`

    - `getOneclicklcaAccessToken` > `getOCLCAAccessToken`
    - `getOneclicklcaJobStatus` > `getOCLCAJobStatus`
    - `createOneclicklcaJob` > `createJob`

- ### Renamed Interfaces

  - `JobCreate` > `OCLCAJobCreate`
  - `JobCreation` > `OCLCAJob`
  - `JobCreationResponse` > `OCLCAJobSingle`
  - `JobLinks` > `OCLCAJobLinks`
  - `JobStatus` > `OCLCAJobStatus`
  - `JobStatusLinks` > `OCLCAJobStatusLinks`
  - `JobStatusResponse` > `OCLCAJobStatusSingle`

- ### Changes to Interfaces
  - In `OCLCAJobStatus.status`, the type `StatusEnum` and associated namespace were removed and replaced with `CarbonUploadState`.

## 0.3.4
Fri, 25 Nov 2022
### Patches
- Added missing base path exports.

## 0.3.3
Tue, 15 Nov 2022
### Patches
- Added EC3 Jobs client.
- Added EC3 Configurations client.
