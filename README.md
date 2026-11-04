# Insights Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the **@itwin/insights-client** package that wraps sending requests to the reporting service. Visit the [Insights API](https://developer.bentley.com/apis/insights/) and [Carbon calculation API](https://developer.bentley.com/apis/carbon-calculation/) for more documentation on the insights service.

### Named Groups tags

The [Named Groups API](https://developer.bentley.com/apis/named-groups/) is a **Technical Preview**, available for testing only. **Do not use it in production.**

Named Groups support optional `tags: string[]` on create and update requests. Every minimal/full group response includes a tags array, empty when the group has no tags. Update requests can replace tags without changing other fields; send `tags: []` to clear them, or omit `tags` to leave them unchanged. The client validates the service limits of 20 tags, 128 characters per tag, allowed characters, and case-insensitive uniqueness.

```ts
import { NamedGroupsClient, PreferReturn } from "@itwin/insights-client";

const client = new NamedGroupsClient();
const group = await client.createNamedGroup(accessToken, {
  iTwinId,
  displayName: "Structural elements",
  query: "SELECT ECInstanceId, ECClassId FROM BisCore.PhysicalElement",
  tags: ["Structural", "Phase-1"],
});
await client.updateNamedGroup(accessToken, group.id, { tags: ["Structural", "Phase-2"] });

const groups = await client.getNamedGroups(accessToken, iTwinId, PreferReturn.Minimal, { tag: "Structural" });
for await (const taggedGroup of client.getNamedGroupsIterator(accessToken, iTwinId, PreferReturn.Representation, { top: 100, tag: "Structural" })) {
  console.log(taggedGroup.tags);
}
```

The optional query options object accepts `top` and `tag`; the tag filter is URL-encoded by the client. Existing positional overloads remain supported. Iterators follow the service-provided next-page links.

### Authorization for running tests

- Create .env file and configure the following variables:

```
TEST_ITWIN_NAME=<name to use for test iTwin>
TEST_IMODEL_NAME=<name to use for test iModel>
AUTH_AUTHORITY="https://ims.bentley.com"
AUTH_CLIENT_ID=<client id of a "Web App" client created in https://developer.bentley.com>
AUTH_CLIENT_SECRET=<client secret of a "Web App" client created in https://developer.bentley.com>
AUTH_REDIRECT_URL=<redirect url of a "Web App" client created in https://developer.bentley.com>
AUTH_SCOPES=itwin-platform
APIS_REPORTING_BASE_URL=https://api.bentley.com/insights/reporting
APIS_CARBONCALCULATION_BASE_URL=https://api.bentley.com/insights/carbon-calculation
APIS_GROUPING_AND_MAPPING_BASE_URL=https://api.bentley.com/grouping-and-mapping
APIS_NAMED_GROUPS_BASE_URL=https://api.bentley.com/named-groups
APIS_IMODELS_BASE_URL=https://api.bentley.com/imodels
APIS_IMODELS_VERSION=itwin-platform.v2
APIS_ITWINS_BASE_URL=https://api.bentley.com/itwins
TEST_USERS_ADMIN1_EMAIL=<email of your test user>
TEST_USERS_ADMIN1_PASSWORD=<password of your test user>
TEST_BEHAVIOR_OPTIONS_RECREATE_IMODEL=<1 to recreate iModel for each test suite run>
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
