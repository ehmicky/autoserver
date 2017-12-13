# Concepts

This project is rather generic and conceptual, so we define specific words
in order to avoid any confusion

## Users

User of this library, i.e. maintaining the server-side

## Clients

Users of a server maintainer, i.e. using the client-side

## Middleware

Requests/responses are passed through a series of functions called middleware.

## Layer

Group of middleware.

## Protocol

Network [protocol](../client/syntax/protocols.md), e.g. HTTP.

## Method

[Protocol](../client/syntax/protocols.md) method, e.g. `GET` or `POST`.

## GraphQL method

`query` or `mutation`. The first is for
[`find`](../client/query/crud.md#find-command) CRUD command, the second for all
others.

## JSON-RPC method

[JSON-RPC](../client/syntax/jsonrpc.md) `method` field, indicating the current
[command](../client/query/crud.md), e.g. `find_users`.

## Payload

[Request](../client/syntax/protocols.md) payload

## Headers

[Protocol](../client/syntax/protocols.md) headers

## Status

Response's status, e.g. `SUCCESS` or `SERVER_ERROR`

## Format

[File format](../client/arguments/formats.md), e.g. YAML or JSON, used in configuration
files, client request payloads and server responses.

## Charset

[Character set](../client/arguments/formats.md#charsets), e.g. `utf-8` or `ascii`.

## RPC system

Main semantics of the request, e.g. [GraphQL](../client/syntax/graphql.md),
[REST](../client/syntax/rest.md) or [JSON-RPC](../client/syntax/jsonrpc.md).

## Arguments

Options passed to a [request](../client/syntax/rpc.md#rpc)

Also used to designate function arguments.

## Parameters

Arguments passed to
[configuration functions](../server/usage/functions.md#parameters).

## Variables

Variable, from a programming point of view.

Also used for query variables, path variables, GraphQL variables and
environment variables.

## Action

A sets a commands, tied to a specific command type.

E.g. in GraphQL, `find_users(...) { ... }`

## Command

Actual database query, from a server perspective. An action is converted to
one or several commands. E.g. a `patch` command will first trigger a `find`
command to query the current models to patch.

## Functions

[Functions](../server/usage/functions.md) specified in configuration, that allows
injecting custom logic.

## Utilities

Set of generic code under `src/utilities/`

## Request

Client request, e.g. HTTP request

## Response

Response of the request, i.e. what the client receives

## Result

Database query result. Each request usually assemble several results into
a single response.

## Response type

Abstracted content type, e.g. `collection`.

## Error

Thrown [exception](../server/usage/error.md)

## Error response

Response containing [error information](../server/usage/error.md)

## Error reason

Generic [error type](../server/usage/error.md)

## Collection

Like a [database table](../server/configuration/collections.md) or collection

## Model

Individual object inside a collection

## Nested collection

[Attribute](../server/configuration/relations.md) inside a collection targeting another
collection

## Target collection

[Collection](../server/configuration/relations.md) targeted by a nested collection

## Attribute

A collection's [attribute](../server/configuration/collections.md#attributes),
i.e. like a database column or key

## Property

Any object property

## Instruction

Top-level [instruction](../server/usage/usage.md), e.g. `run`.
