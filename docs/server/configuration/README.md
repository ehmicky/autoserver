# Configuration

The data model and business logic is specified in the
[configuration](configuration.md) used by the [`run`](../usage/run.md)
instruction.

There are several ways to define the [configuration](configuration.md):
  - as a [file](configuration.md#configuration-file)
  - as an [environment variable](configuration.md#environment-variables)
  - as a [command line option](../usage/README.md#usage)
  - as a [Node.js option](../usage/README.md#node.js).

When using a [configuration file](configuration.md#configuration-file), several
[formats](formats.md) can be used.
It can also be broken down into several files or import Node.js modules using
[references](references.md).

# Functions

Custom logic can be added to the configuration by using JavaScript
[functions](functions.md).

Those functions take a set of [parameters](functions.md#parameters) as input
describing the current context, for example the current request. Both the
[clients](../../client/arguments/params.md) and the
[server](functions.md#server-specific-parameters) can also define their own
parameters.
