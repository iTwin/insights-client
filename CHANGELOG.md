# Change Log - @itwin/insights-client

## 0.5.0
Wed, 31 May 2023

Minor
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
