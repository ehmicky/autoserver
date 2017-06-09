# What this is

This is prototype for a web server engine.

You simply pass a [single declarative file](https://github.com/autoserver-org/autoserver/blob/master/examples/pet.schema.yml) as input, and the server generates a
GraphQL server.
The file format is based on standard [JSON schema](http://json-schema.org/), written as YAML.

The server is fully-featured, i.e. there should not be much need for custom
code beyond that declarative file.

# What's already built

  - GraphQL endpoint
  - GraphQL introspection, including model type, optional/required, naming,
    description, deprecation status
  - GraphiQL interactive debugger
  - GraphQL schema can be printed as HTML
  - CRUD actions: find, create, update, replace, upsert, delete.
    Each action can be performed on a single model (e.g. createOne)
    or on several models (e.g. createMany).
  - simple filters, e.g. `findUsers(filter: {name: "John"})`
    or `findUser(filter: {id: 1})`
  - complex filters, e.g. `findUsers(filter: {age: "$ > 30"})`
  - sorting, e.g. `findUsers(order_by: "name-,job_title+")`
  - selecting (handled natively by GraphQL)
  - pagination
  - dry runs
  - nested actions. One can not only query but also mutate nested models in a
    single action.
  - validation of both input and output
  - default values
  - computed values, e.g. name = first_name + last_name
  - automatic attributes: created_time, updated_time, created_by, updated_by
  - transformation on input|output, e.g. when client and database have
    different data models
  - HTTP body/query handling
  - error handling
  - basic logging
  - basic routing

# What is work in progress

Includes (but is not limited to):
  - compatibility/deprecation
  - authorization
  - aggregation
  - migrations
  - security
  - some HTTP features (CORS, caching, etc.)
  - performance optimization (could be 5 to 10 times faster with some basic
    tweaks, since much of the work can be done compile-time)
  - using real database connection (at the moment, all data lives in memory,
    using a JavaScript array)

# Example

Start the server with:

```javascript
startServer({ conf: 'my_schema.yml' });
```

`my_schema.yml` contains:

```yml
$schema: tag:apiengine,2017:v1.0.0
models:
  user:
    required: [id]
    properties:
      id: {}
      name: {}
      friends:
        items:
          model: user
```

Users can then perform the following GraphQL query:

```graphql
query {
  findUsers(filter: {id: "1"}) {
    id
    name
    findFriends(order_by: "name") {
      name
    }
  }
}
```

Which will respond with:

```json
{
  "data": {
    "findUsers": {
      "id": "1",
      "name": "Anthony",
      "findFriends": [
        { "name": "Agatha" },
        { "name": "Miranda" },
        { "name": "Tony" }
      ]
    }
  }
}
```

This is a minimalistic example. A lot is possible: validation, authorization,
default values, nested actions, all CRUD, etc.

# How to start

First `npm run build` (not `npm install`)

If in production, run with `npm start`

If in development, run with `NODE_ENV=dev npm start`.
This will start in watch mode (using `nodemon` and `node --inspect`).

A local server at `localhost:5001` will be spawned.
Can be configured with environment variables `PORT` and `HOST`.

There are three ways of exploring the API:
  - direct GraphQL calls to `localhost:5001/graphql`
  - interactive exploration with `localhost:5001/graphiql`.
    Click on "docs" to see the schema.
  - schema printed as HTML with `localhost:5001/graphql/schema`

# Tooling

We recommend using the Chrome extension [Node Inspector Manager](https://github.com/june07/NIM) for
Chrome devtools debugging.
Note that when using nodemon, restarting the server will crash if there is a
pending request (or if there was one in the last few seconds).
This is because NIM tries to reconnect to node debugger while nodemon
is restarting.
A workaround is to restart the server again, or to wait for pending requests to
be resolved before restarting.

We are using [editorconfig](http://editorconfig.org/), so please install the plugin for your IDE.

# Troubleshooting

  - Please use Node.js v8.1.0
  - Orphans are not currently handled (but this will be fixed).
    This means if you are trying to query or mutate a model which contains a
    foreign key to a non-existing model, the action will crash.
    E.g. this means that to delete a model, all other model referencing it must
    remove their foreign keys first, otherwise they won't be accessible anymore.
