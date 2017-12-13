# Arguments

Each [CRUD command](../request/crud.md) has its own set of
[arguments](../rpc/README.md#rpc).

The following [arguments](../rpc/README.md#rpc) are available:
  - [`id`](filtering.md#id-argument)
  - [`filter`](filtering.md)
  - [`data`](../request/crud.md#create-command)
  - [`order`](sorting.md)
  - [`populate`](../request/relations.md#populating-nested-collections)
    and [`cascade`](../request/relations.md#deleting-nested-collections)
  - pagination: [`pagesize`](pagination.md#page-size),
    [`page`](pagination.md#offset-pagination),
    [`after`](pagination.md#cursor-pagination) and
    [`before`](pagination.md#backward-iteration)
  - [`select`](selecting.md)
  - [`rename`](renaming.md)
  - [`silent`](silent.md)
  - [`dryrun`](dryrun.md)
  - [`params`](params.md)

The following query variable is also available: [`compress`](compression.md).
