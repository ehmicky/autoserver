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

Network [protocol](protocols.md), e.g. HTTP.

## Method

[Protocol](protocols.md) method, e.g. `GET` or `POST`.

## GraphQL method

`query` or `mutation`. The first is for [`find`](crud.md#find-command) CRUD
command, the second for all others.

## JSON-RPC method

[JSON-RPC](jsonrpc.md) `method` field, indicating the current
[command](crud.md#rpc), e.g. `find_users`.

## Payload

[Request](protocols.md#request) payload

## Headers

[Protocol](protocols.md) headers

## Status

Response's status, e.g. `SUCCESS` or `SERVER_ERROR`

## Format

[File format](formats.md), e.g. YAML or JSON, used in configuration files,
client request payloads and server responses.

## Charset

[Character set](formats.md#charsets), e.g. `utf-8` or `ascii`.

## RPC system

Main semantics of the request, e.g. [GraphQL](graphql.md), [REST](rest.md) or
[JSON-RPC](jsonrpc.md).

## Arguments

Options passed to a [request](rpc.md#rpc)

## Action

A sets a commands, tied to a specific command type.

E.g. in GraphQL, `find_users(...) { ... }`

## Command

Actual database query, from a server perspective. An action is converted to
one or several commands. E.g. a `patch` command will first trigger a `find`
command to query the current models to patch.

## Functions

[Functions](functions.md) specified in configuration, that allows injecting
custom logic.

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

Thrown [exception](error.md)

## Error response

Response containing [error information](error.md)

## Error reason

Generic [error type](error.md)

## Collection

Like a [database table](collections.md) or collection

## Model

Individual object inside a collection

## Nested collection

[Attribute](relations.md) inside a collection targeting another collection

## Target collection

[Collection](relations.md) targeted by a nested collection

## Attribute

A collection's [attribute](collections.md#attributes.md),
i.e. like a database column or key

## Property

Any object property

## Instruction

Top-level [instruction](usage.md), e.g. `run`.
