# Change Log - @itwin/insights-client
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
