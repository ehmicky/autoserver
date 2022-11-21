<img alt="autoserver logo" src="https://raw.githubusercontent.com/ehmicky/design/main/autoserver/autoserver.svg" width="500"/>

[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/autoserver)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Create a full-featured REST/GraphQL API from a configuration file.

# Development status

This project is still in active development, and is not ready for production.
[Key features](docs/dev/ROADMAP.md) are currently missing.

If you want to follow our progress in the meantime, you are welcome to star this
repository.

# Overview

Create a simple
[configuration file](docs/server/configuration/configuration.md#configuration-file)
describing your data model:

```yml
engine: 0
collections:
  users:
    description: User of the API
    attributes:
      id:
        type: string
      age:
        type: integer
      score:
        type: number
        alias: high_score
        default: 10
        validate:
          minimum: 20
      reports:
        type: reports[]
  reports:
    attributes:
      id:
        type: string
      content:
        type: string
  default:
    database: mongodb
databases:
  mongodb:
    hostname: localhost
    password: secret_mongodb_password
    dbname: my_database_name
protocols:
  http:
    port: 5001
```

Then start a full-featured web API.

```bash
$ autoserver
```

Clients will now be able to perform [GraphQL](docs/client/rpc/graphql.md)
requests:

```graphql
{
  find_users(
    filter: { score: { _gt: 100 } }
    order: "score"
  ) {
    id
    age
    score
    reports: { content }
  }
}
```

Or [REST](docs/client/rpc/rest.md) requests:

```HTTP
GET /rest/users/?filter.score._gt=100&order=score&populate=reports
```

```json
{
  "data": [
    {
      "id": "15",
      "age": 32,
      "score": 150,
      "reports": { "id": "65", "content": "..." }
    },
    {
      "id": "251",
      "age": 24,
      "score": 168,
      "reports": { "id": "67", "content": "..." }
    },
    {
      "id": "7",
      "age": 51,
      "score": 192,
      "reports": { "id": "10", "content": "..." }
    }
  ]
}
```

# Features

- [Multiple RPC systems](docs/client/rpc/README.md), including
  [REST](docs/client/rpc/rest.md), [GraphQL](docs/client/rpc/graphql.md) and
  [JSON-RPC](docs/client/rpc/jsonrpc.md)
- [GraphQL debugging](docs/client/rpc/graphql.md), including introspection,
  interactive debugger and GraphQL schema printing
- [Multiple databases](docs/server/databases/README.md) support, including
  [MongoDB](docs/server/databases/mongodb.md) and an
  [in-memory database](docs/server/databases/memorydb.md). Different databases
  can be used at the same time.
- [Multiple protocols](docs/client/protocols/README.md) handling, with support
  for [HTTP/1.1](docs/server/protocols/http.md) only at the moment
- [Multiple formats](docs/client/protocols/formats.md) support for the
  configuration files, the client request payloads and the server responses,
  including [JSON](docs/client/protocols/formats.md#json),
  [YAML](docs/client/protocols/formats.md#yaml),
  [x-www-form-urlencoded](docs/client/protocols/formats.md#x-www-form-urlencoded),
  [JavaScript](docs/server/configuration/formats.md#javascript),
  [Hjson](docs/client/protocols/formats.md#hjson),
  [JSON5](docs/client/protocols/formats.md#json5) and
  [INI](docs/client/protocols/formats.md#ini)
- automatic [logging](docs/server/quality/logging.md) and
  [performance monitoring](docs/server/quality/logging.md#performance-monitoring)
- extensive
  [error handling and reporting](docs/server/usage/error.md#exceptions)
- [CRUD commands](docs/client/request/crud.md): find, create, patch, upsert,
  delete. Each command can be performed on a single model or on several models.
- [Advanced mutations](docs/client/request/patch.md) like incrementing, regular
  expression replacement, cross-attributes mutations, slicing, etc.
- [relations, nested commands](docs/client/request/relations.md) and populating
  between models, including for mutations
- [filtering](docs/client/arguments/filtering.md)
- [sorting](docs/client/arguments/sorting.md)
- [selecting](docs/client/arguments/selecting.md)
- [renaming attributes](docs/client/arguments/renaming.md)
- [pagination](docs/client/arguments/pagination.md)
- [input validation](docs/server/data_model/validation.md#data-validation)
- [authorization](docs/server/data_model/authorization.md), including
  [readonly](docs/server/data_model/authorization.md#readonly-attributes)
  attributes
- [default values](docs/server/data_model/default.md)
- [computed attributes and normalization](docs/server/data_model/transformation.md)
- [aliases](docs/server/data_model/compatibility.md#aliases)
- automatic attributes:
  [`created_time`, `updated_time`](docs/server/plugins/timestamp.md),
  [`created_by`, `updated_by`](docs/server/plugins/author.md)
- [compression](docs/client/arguments/compression.md) of both the response and
  the request, for any protocol. [Brotli](https://en.wikipedia.org/wiki/Brotli)
  support.
- [dry runs](docs/client/arguments/dryrun.md)
- [silent outputs](docs/client/arguments/silent.md)
- [plugins](docs/server/plugins/README.md)
- [custom logic](docs/server/configuration/functions.md) can be added in
  JavaScript

# Documentation

The documentation is [here](docs/README.md).

# Badge

The following badge can be added to your project:
[![autoserver](https://img.shields.io/badge/auto-server-406890.svg?logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNDU5IDQ1OSIKICAgdmlld0JveD0iMCAwIDQwNS4yMjY5OSA0MDUuMjI4IgogICBoZWlnaHQ9IjQwNS4yMjgiCiAgIHdpZHRoPSI0MDUuMjI2OTkiCiAgIHk9IjBweCIKICAgeD0iMHB4IgogICBpZD0iTGF5ZXJfMSIKICAgdmVyc2lvbj0iMS4xIj48bWV0YWRhdGEKICAgaWQ9Im1ldGFkYXRhMTA4NSI+PHJkZjpSREY+PGNjOldvcmsKICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcwogICBpZD0iZGVmczEwODMiIC8+CjxnCiAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNi44ODcsLTI2Ljg4NykiCiAgIGlkPSJnMTA3OCI+Cgk8cGF0aAogICBzdHlsZT0iZmlsbDojMTJhNWVhIgogICBpZD0icGF0aDEwNzQiCiAgIGQ9Im0gNDMyLjExMywyMDMuODkgLTQzLjM0OCwtMTQuNjMxIGMgLTMuOTQ0LC0xNS42NDYgLTEwLjEzNCwtMzAuMzk3IC0xOC4yMDYsLTQzLjkgTCAzOTAuODgyLDEwNC4zNDcgMzczLjI2Nyw4Ni43MyAzNzIuMjc4LDg1LjczNyAzNTQuNjU0LDY4LjEyIDMxMy42NDIsODguNDQgQyAzMDAuMTQzLDgwLjM2NyAyODUuMzkyLDc0LjE3OCAyNjkuNzQ5LDcwLjIzNyBMIDI1NS4xMSwyNi44ODcgaCAtMjQuOTExIC0xLjM5NSAtMjQuOTE0IGwgLTE0LjYyNyw0My4zNTEgYyAtMTUuNjUsMy45NDEgLTMwLjM5NywxMC4xMyAtNDMuOTA0LDE4LjIwMyBsIC00MS4wMTIsLTIwLjMyIC0xNy42MTgsMTcuNjE2IC0wLjk5MiwwLjk4OSAtMTcuNjIsMTcuNjIgMjAuMzIzLDQxLjAxMiBjIC04LjA2OSwxMy41MDMgLTE0LjI1NCwyOC4yNTQgLTE4LjE5NSw0My44OTYgTCAyNi44ODcsMjAzLjg5IHYgMjQuOTE1IDEuMzkyIDI0LjkxNSBsIDQzLjM1OCwxNC42MzUgYyAzLjk0MSwxNS42NDYgMTAuMTI2LDMwLjM5NyAxOC4xOTUsNDMuODkzIGwgLTIwLjMyMyw0MS4wMTYgMTcuNjIsMTcuNjE2IDAuOTg1LDAuOTkzIDE3LjYyNCwxNy42MiA0MS4wMTIsLTIwLjMyNCBjIDEzLjUwNyw4LjA3MyAyOC4yNTQsMTQuMjU5IDQzLjg5NiwxOC4xOTkgbCAxNC42MzUsNDMuMzU1IGggMjQuOTE1IDEuMzk1IDI0LjkxMSBsIDE0LjYzOSwtNDMuMzU1IGMgMTUuNjQzLC0zLjk0IDMwLjM5NCwtMTAuMTI2IDQzLjg5MywtMTguMTk5IGwgNDEuMDEyLDIwLjMyNCAxNy42MiwtMTcuNjIgMC45OTMsLTAuOTg1IDE3LjYxNiwtMTcuNjI0IC0yMC4zMjMsLTQxLjAxNiBjIDguMDcyLC0xMy40OTUgMTQuMjYyLC0yOC4yNDcgMTguMjA2LC00My44OTMgbCA0My4zNDgsLTE0LjYzNSBWIDIzMC4xOTcgMjI4LjgwNSAyMDMuODkgWiBNIDIyOS41MDQsMzU0LjkwNiBjIC02OS4yNTksMCAtMTI1LjQwNSwtNTYuMTQ3IC0xMjUuNDA1LC0xMjUuNDA2IDAsLTY5LjI1NSA1Ni4xNDYsLTEyNS40MDkgMTI1LjQwNSwtMTI1LjQwOSA2OS4yNTUsMCAxMjUuNDA5LDU2LjE1NCAxMjUuNDA5LDEyNS40MDkgMCw2OS4yNTkgLTU2LjE1NCwxMjUuNDA2IC0xMjUuNDA5LDEyNS40MDYgeiIgLz4KCTxwYXRoCiAgIHN0eWxlPSJjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiMxMmE1ZWE7ZmlsbC1ydWxlOmV2ZW5vZGQiCiAgIGlkPSJwYXRoMTA3NiIKICAgZD0ibSAzMTQuMjUyLDIxOS41MzMgYyAtNy44MzQsLTQuOTM3IC0xNS44NjYsLTkuNTkxIC0yMy44MzMsLTE0LjMxNyAtMjYuOTI0LC0xNS45NjIgLTUzLjg1OCwtMzEuOTEyIC04MC43ODIsLTQ3Ljg2IC00LjU2MSwtMi43MDUgLTkuMDgyLC01LjQ2NCAtMTMuNjg4LC04LjA3NSAtMTAuMTk0LC01Ljc1NiAtMTguMzcxLC0xLjI3IC0xOS4wMDIsMTAuMzY5IC0wLjA3MywxLjMxOSAtMC4wNzIsMi42NDggLTAuMDgyLDMuOTc2IC0wLjAwNCwwLjU4MiAtMC4wMDksMS4yMjIgLTAuMDEzLDEuODk3IHYgMTM2LjY4NSBjIDEuMzk4LDguNTIgOC44MzUsMTIuMTIyIDE3LjMxOSw3Ljc1IDEwLjE1MywtNS4yMjkgMjAuMDE4LC0xMS4wNDIgMjkuOTc5LC0xNi42NjMgMTcuMDc4LC05LjY0OSAzNC4xNDIsLTE5LjMzNSA1MS4xOTgsLTI5LjAyOSAxMi45NzQsLTcuMzggMjYuMDE5LC0xNC42MzMgMzguODUyLC0yMi4yNTYgMTAuNzkzLC02LjQyNiAxMC43NjQsLTE1Ljc0IDAuMDUyLC0yMi40NzcgeiIgLz4KPC9nPgo8L3N2Zz4=)](https://github.com/ehmicky/autoserver)

```markdown
[![autoserver](https://img.shields.io/badge/auto-server-406890.svg?logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNDU5IDQ1OSIKICAgdmlld0JveD0iMCAwIDQwNS4yMjY5OSA0MDUuMjI4IgogICBoZWlnaHQ9IjQwNS4yMjgiCiAgIHdpZHRoPSI0MDUuMjI2OTkiCiAgIHk9IjBweCIKICAgeD0iMHB4IgogICBpZD0iTGF5ZXJfMSIKICAgdmVyc2lvbj0iMS4xIj48bWV0YWRhdGEKICAgaWQ9Im1ldGFkYXRhMTA4NSI+PHJkZjpSREY+PGNjOldvcmsKICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcwogICBpZD0iZGVmczEwODMiIC8+CjxnCiAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNi44ODcsLTI2Ljg4NykiCiAgIGlkPSJnMTA3OCI+Cgk8cGF0aAogICBzdHlsZT0iZmlsbDojMTJhNWVhIgogICBpZD0icGF0aDEwNzQiCiAgIGQ9Im0gNDMyLjExMywyMDMuODkgLTQzLjM0OCwtMTQuNjMxIGMgLTMuOTQ0LC0xNS42NDYgLTEwLjEzNCwtMzAuMzk3IC0xOC4yMDYsLTQzLjkgTCAzOTAuODgyLDEwNC4zNDcgMzczLjI2Nyw4Ni43MyAzNzIuMjc4LDg1LjczNyAzNTQuNjU0LDY4LjEyIDMxMy42NDIsODguNDQgQyAzMDAuMTQzLDgwLjM2NyAyODUuMzkyLDc0LjE3OCAyNjkuNzQ5LDcwLjIzNyBMIDI1NS4xMSwyNi44ODcgaCAtMjQuOTExIC0xLjM5NSAtMjQuOTE0IGwgLTE0LjYyNyw0My4zNTEgYyAtMTUuNjUsMy45NDEgLTMwLjM5NywxMC4xMyAtNDMuOTA0LDE4LjIwMyBsIC00MS4wMTIsLTIwLjMyIC0xNy42MTgsMTcuNjE2IC0wLjk5MiwwLjk4OSAtMTcuNjIsMTcuNjIgMjAuMzIzLDQxLjAxMiBjIC04LjA2OSwxMy41MDMgLTE0LjI1NCwyOC4yNTQgLTE4LjE5NSw0My44OTYgTCAyNi44ODcsMjAzLjg5IHYgMjQuOTE1IDEuMzkyIDI0LjkxNSBsIDQzLjM1OCwxNC42MzUgYyAzLjk0MSwxNS42NDYgMTAuMTI2LDMwLjM5NyAxOC4xOTUsNDMuODkzIGwgLTIwLjMyMyw0MS4wMTYgMTcuNjIsMTcuNjE2IDAuOTg1LDAuOTkzIDE3LjYyNCwxNy42MiA0MS4wMTIsLTIwLjMyNCBjIDEzLjUwNyw4LjA3MyAyOC4yNTQsMTQuMjU5IDQzLjg5NiwxOC4xOTkgbCAxNC42MzUsNDMuMzU1IGggMjQuOTE1IDEuMzk1IDI0LjkxMSBsIDE0LjYzOSwtNDMuMzU1IGMgMTUuNjQzLC0zLjk0IDMwLjM5NCwtMTAuMTI2IDQzLjg5MywtMTguMTk5IGwgNDEuMDEyLDIwLjMyNCAxNy42MiwtMTcuNjIgMC45OTMsLTAuOTg1IDE3LjYxNiwtMTcuNjI0IC0yMC4zMjMsLTQxLjAxNiBjIDguMDcyLC0xMy40OTUgMTQuMjYyLC0yOC4yNDcgMTguMjA2LC00My44OTMgbCA0My4zNDgsLTE0LjYzNSBWIDIzMC4xOTcgMjI4LjgwNSAyMDMuODkgWiBNIDIyOS41MDQsMzU0LjkwNiBjIC02OS4yNTksMCAtMTI1LjQwNSwtNTYuMTQ3IC0xMjUuNDA1LC0xMjUuNDA2IDAsLTY5LjI1NSA1Ni4xNDYsLTEyNS40MDkgMTI1LjQwNSwtMTI1LjQwOSA2OS4yNTUsMCAxMjUuNDA5LDU2LjE1NCAxMjUuNDA5LDEyNS40MDkgMCw2OS4yNTkgLTU2LjE1NCwxMjUuNDA2IC0xMjUuNDA5LDEyNS40MDYgeiIgLz4KCTxwYXRoCiAgIHN0eWxlPSJjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiMxMmE1ZWE7ZmlsbC1ydWxlOmV2ZW5vZGQiCiAgIGlkPSJwYXRoMTA3NiIKICAgZD0ibSAzMTQuMjUyLDIxOS41MzMgYyAtNy44MzQsLTQuOTM3IC0xNS44NjYsLTkuNTkxIC0yMy44MzMsLTE0LjMxNyAtMjYuOTI0LC0xNS45NjIgLTUzLjg1OCwtMzEuOTEyIC04MC43ODIsLTQ3Ljg2IC00LjU2MSwtMi43MDUgLTkuMDgyLC01LjQ2NCAtMTMuNjg4LC04LjA3NSAtMTAuMTk0LC01Ljc1NiAtMTguMzcxLC0xLjI3IC0xOS4wMDIsMTAuMzY5IC0wLjA3MywxLjMxOSAtMC4wNzIsMi42NDggLTAuMDgyLDMuOTc2IC0wLjAwNCwwLjU4MiAtMC4wMDksMS4yMjIgLTAuMDEzLDEuODk3IHYgMTM2LjY4NSBjIDEuMzk4LDguNTIgOC44MzUsMTIuMTIyIDE3LjMxOSw3Ljc1IDEwLjE1MywtNS4yMjkgMjAuMDE4LC0xMS4wNDIgMjkuOTc5LC0xNi42NjMgMTcuMDc4LC05LjY0OSAzNC4xNDIsLTE5LjMzNSA1MS4xOTgsLTI5LjAyOSAxMi45NzQsLTcuMzggMjYuMDE5LC0xNC42MzMgMzguODUyLC0yMi4yNTYgMTAuNzkzLC02LjQyNiAxMC43NjQsLTE1Ljc0IDAuMDUyLC0yMi40NzcgeiIgLz4KPC9nPgo8L3N2Zz4=)](https://github.com/ehmicky/autoserver)
```

# Contribute

See the [developer's documentation](docs/dev/README.md).

# Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/autoserver/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/autoserver/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
