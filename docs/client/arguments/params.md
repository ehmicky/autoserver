# Client-specific parameters

Clients can specify [parameters](../../server/usage/functions.md#parameters) on
any specific request, using the `params` [argument](../syntax/rpc.md#rpc) with
an object value.

[Parameters](../../server/usage/functions.md#parameters) are custom pieces of
information passed to the server. How those parameters are interpreted is
server-specific.

```graphql
query {
  find_users(id: "1", params: { password: "admin" }) {
    id
  }
}
```

They can also be set using the
[protocol header](../syntax/protocols.md) `params`, with a JSON object
as value. For example, with HTTP:

```HTTP
X-Apiengine-Params: {"password": "admin"}
```
