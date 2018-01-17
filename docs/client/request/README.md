# Requests

Client can perform the following [CRUD commands](crud.md):
[`find`](crud.md#find-command), [`create`](crud.md#create-command),
[`upsert`](crud.md#upsert-command), [`patch`](crud.md#patch-command),
[`delete`](crud.md#delete-command).

[`patch` commands](patch.md) can perform
[advanced mutations](patch.md#advanced-patch-command) such as `_add` or `_push`.

Nested collections can be deeply
[populated](relations.md#populating-nested-collections),
[modified](relations.md#modifying-nested-collections) and
[deleted](relations.md#deleting-nested-collections).

If anything went wrong, an [error response](error.md#error-responses) will be
sent.
