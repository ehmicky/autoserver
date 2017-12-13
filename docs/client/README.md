# Client

## Protocols

Client requests are sent over [HTTP](protocols/README.md).

## RPC

Any of the following [RPC systems](rpc/README.md) can be used:
[REST](rpc/rest.md), [GraphQL](rpc/graphql.md) and [JSON-RPC](rpc/jsonrpc.md).

## Request

[Client requests](request/README.md) are regular
[CRUD commands](request/crud.md).
Advanced [`patch` commands](request/patch.md) can be performed.

[Nested collections](request/relations.md) can be manipulated on both read and
write requests.

If anything went wrong, an [error response](request/error.md) will be sent.

## Arguments

The following [arguments](arguments/README.md) are available:
  - [`id`](arguments/filtering.md#id-argument)
  - [`filter`](arguments/filtering.md)
  - [`data`](request/crud.md#create-command)
  - [`order`](arguments/sorting.md)
  - [`populate`](request/relations.md#populating-nested-collections)
    and [`cascade`](request/relations.md#deleting-nested-collections)
  - pagination: [`pagesize`](arguments/pagination.md#page-size),
    [`page`](arguments/pagination.md#offset-pagination),
    [`after`](arguments/pagination.md#cursor-pagination) and
    [`before`](arguments/pagination.md#backward-iteration)
  - [`select`](arguments/selecting.md)
  - [`rename`](arguments/renaming.md)
  - [`silent`](arguments/silent.md)
  - [`dryrun`](arguments/dryrun.md)
  - [`params`](arguments/params.md)

The following query variable is also available:
[`compress`](arguments/compression.md).

# Client (summary)

The following [commands](request/crud.md) and [arguments](arguments/README.md)
are available.

Only the `data` argument is required (for
[`create`](request/crud.md#create-command),
[`upsert`](request/crud.md#upsert-command) and
[`patch`](request/crud.md#patch-command)).

```graphql
find_collection({ id|filter, order, populate, pagesize, before|after|page,
select, rename, silent, params })
```

```graphql
create_collection({ data|data, select, rename, silent, dryrun, params })
```

```graphql
upsert_collection({ data|data, select, rename, silent, dryrun, params })
```

```graphql
patch_collection({ data, id|filter, pagesize, after, select, rename, silent,
dryrun, params })
```

```graphql
delete_collection({ id|filter, cascade, select, rename, silent, dryrun,
params })
```

# Client (table of contents)

[Protocols](protocols/README.md)
  - [HTTP](protocols/http.md)
  - [Format of the request payload and server response](protocols/formats.md)

[RPC](rpc/README.md)
  - [REST](rpc/rest.md)
  - [GraphQL](rpc/graphql.md)
  - [JSON-RPC](rpc/jsonrpc.md)

[Request](request/README.md)
  - [CRUD](request/crud.md)
  - [Patch commands](request/patch.md)
  - [Relations](request/relations.md)
  - [Error responses](request/error.md)

[Arguments](arguments/README.md)
  - [Filtering](arguments/filtering.md)
  - [Sorting](arguments/sorting.md)
  - [Pagination](arguments/pagination.md)
  - [Renaming attributes](arguments/renaming.md)
  - [Selecting attributes](arguments/selecting.md)
  - [Silent runs](arguments/silent.md)
  - [Dry run](arguments/dryrun.md)
  - [Custom parameters](arguments/params.md)
  - [Compression](arguments/compression.md)
