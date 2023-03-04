# Insights Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the **@itwin/insights-client** package that wraps sending requests to the reporting service. Visit the [Insights API](https://developer.bentley.com/apis/insights/) and [Carbon calculation API](https://developer.bentley.com/apis/carbon-calculation/) for more documentation on the insights service.

### Authorization for running tests

- Create .env file and configure the following variables:

```
TEST_PROJECT_NAME=
TEST_IMODEL_NAME=
AUTH_AUTHORITY=
AUTH_CLIENT_ID=
AUTH_CLIENT_SECRET=
AUTH_REDIRECT_URL=
APIS_IMODELS_BASE_URL=
APIS_IMODELS_VERSION=
APIS_IMODELS_SCOPES=
APIS_PROJECTS_BASE_URL=
APIS_PROJECTS_SCOPES=
TEST_USERS_ADMIN1_EMAIL=
TEST_USERS_ADMIN1_PASSWORD=
TEST_USERS_ADMIN2_FULLY_FEATURED_EMAIL=
TEST_USERS_ADMIN2_FULLY_FEATURED_PASSWORD=
TEST_BEHAVIOR_OPTIONS_RECREATE_IMODEL=
```

- Test project and imodel will be created automatically with provided names.
- You can then run `npm run test:integration`.
- There are currently no tests for `oneClickLcaClient`

## Build Instructions

Install dependencies and build source

```
npm install
npm run build
```

Run tests

```
npm run test
```

Run linters

```
npm run lint
```

## Helper files

.githooks

- copyright-linter

  To use custom hooks, run the command:

  ```
  git config --local core.hooksPath .githooks/
  ```
