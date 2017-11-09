# Concepts

This project is rather generic and conceptual, so we define specific words
in order to avoid any confusion

## Server maintainer

User of this library, i.e. maintaining the server-side

## Clients

Users of a server maintainer, i.e. using the client-side

## Request/response

Client request/response, e.g. HTTP request/response

## Middleware

Requests/responses are passed through a series of functions called middleware.

## Layer

Group of middleware. Layers follow each other in a stack, i.e. a request go
from the first layer to the last one, and a response does the opposite.

Each layer has its own format, which is converted between layers by middleware
called convertors.

## Protocol

Network protocol, e.g. HTTP.

## Method

Protocol-agnostic method, e.g. `GET` or `POST`.

## GraphQL method

`query` or `mutation`. The first is for `find` CRUD command, the second for all
others.

## JSON-RPC method

JSON-RPC `method` field, indicating the current command, e.g. `find_users`.

## Payload

Request payload

## Headers

Protocol-specific request options

## Protocol status

Protocol-specific status, e.g. HTTP status code

## Status

Protocol-agnostic status, e.g. `SUCCESS` or `SERVER_ERROR`

## RPC system

Main semantics of the request, e.g. "GraphQL query", "GraphiQL debugging" or
"GraphQL schema printing"

## Args

Options passed to a request

## Action

A sets a commands, tied to a specific command type.

E.g. in GraphQL, `findUsers(...) { ... }`

## Command

Actual database query, from a server perspective. An action is converted to
one or several commands. E.g. a `patch` command will first trigger a `find`
command to query the current models to patch.

## Schema functions

[Functions](functions.md) specified in schema, that allows injecting
custom logic.

## User variables

Server-specified [variables](functions.md#user-variables)

## Client parameters

Client-specified [variables](functions.md#client-parameters)

## Options

Options passed to server when starting it

## Events

[Events](events.md) fired through [`run`](run.md) option `events` callbacks.

## Utilities

Set of generic code under src/utilities/

## Response

Response of the main request, i.e. what the client receives

## Result

Database query result. Each request usually assemble several results into
a single response.

## Response type

Abstracted content type, e.g. `collection`.

## Error

Thrown exception

## Error response

Response containing error information

## Error reason

Generic error type

## Model

Like a [database table](models.md) or collection

## Nested model

[Attribute](relations.md) inside a model targeting another model

## Target model

[Model](relations.md) targeted by a nested model

## Attribute

A model's [attribute](models.md#attributes.md),
i.e. like a database column or key

## Property

Any object property

## Schema

Main [configuration file](schema.md)

## Instruction

Top-level instruction, e.g. `run`.
