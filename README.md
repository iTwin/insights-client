# Insights Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the __@itwin/insights-client__ package that wraps sending requests to the project service. Visit the [Insights API](https://developer.bentley.com/apis/insights/) and [Carbon calculation API](https://developer.bentley.com/apis/carbon-calculation/) for more documentation on the insights service.

## Environment Variables

```
# ---- Optional URL prefix for dev/qa environments ----
IMJS_URL_PREFIX=""

# ----Authorization for running tests ----
IMJS_OIDC_BROWSER_TEST_CLIENT_ID=""
IMJS_OIDC_BROWSER_TEST_REDIRECT_URI=""
IMJS_OIDC_BROWSER_TEST_SCOPES=""
IMJS_TEST_REGULAR_USER_NAME=""
IMJS_TEST_REGULAR_USER_PASSWORD=""
```

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
