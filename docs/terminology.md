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

There are six layers:
  - initial: setup things like error handling
  - protocol: handle protocol-related things like query variables, URL, headers,
    payload, routing. Abstracts away protocol from next layers
  - operation: parse GraphQL-related information into actions.
    Abstracts away GraphQL from next layers.
  - action: convert CRUD action into generic commands
  - command: apply transformations, default values, pagination, etc.
  - database: perform the actual database query. Also perform data validation.

Each layer has its own format, which is converted between layers by middleware
called convertors.

## Protocol

Network protocol, e.g. `HTTP`.

## Method

Protocol-specific method, e.g. `GET` or `POST`.

## Goal

Like method, but protocol-agnostic, e.g. `find` or `create`.

## Payload

Request payload

## Headers

Protocol-specific request options

## Protocol status

Protocol-specific status, e.g. HTTP status code

## Status

Protocol-agnostic status, e.g. `SUCCESS` or `SERVER_ERROR`

## Operation

Main semantics of the request, e.g. "GraphQL query", "GraphiQL debugging" or
"GraphQL schema printing"

## GraphQL method

`query` or `mutation`. The first is for `find` CRUD action, the second for all
others.

## Action

Conceptually a high-level database query, from a client perspective.

E.g. in GraphQL, `findUsers(...) { ... }`

## Args

Options passed to an action

## Command

Actual database query, from a server perspective. An action is converted to
one or several commands. E.g. an `update` action actually performs two
commands: first a `read` command, then an `update` command.

## Params

Client-specified [JSL variables](jsl.md#jsl-parameters)

## Settings

Client-specified request-wide [argument](settings.md).

## Runtime options

Options passed to server when starting it

## Helpers

Client-specified JSL

## Utilities

Set of generic code under src/utilities/

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

[Attribute](models.md#nested-models) inside a model targeting another model

## Target model

[Model](models.md#nested-models) targeted by a nested model

## Attribute

A model's [attribute](models.md#attributes.md),
i.e. like a database column or key

## Property

Any object property

## IDL

Main [configuration file](idl.md)

## JSL

[JavaScript notation](jsl.md) that allows injecting custom logic.
