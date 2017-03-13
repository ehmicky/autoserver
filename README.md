# What this is

This is prototype for a web server that generates a GraphQL endpoint taking only a [single declarative file](https://github.com/autoserver-org/autoserver/blob/master/src/idl/example.json) input.

The idea:
have a stable and robust API engine, and only have to edit a simple and non-verbose declarative files for 80% of what is currently done in the backend, including: validation, authorization, CRUD (including sorting, querying, etc.), side-effects, etc.

Architectural notes:
  - optimized for being deployed as a single stateless FaaS that boots fast, then dies once request is over.
  - meant to be deployed behind an API gateway, i.e. there is no real URL routing performed (apart from dummy one)
  - protocol-agnostic, i.e. an HTTP layer abstracts away HTTP details from the rest of the application. Main goal: allowing to add other protocols (such as WebSocket) without much effort. Other goal: isolate HTTP intricacies from the rest of the logic.
  - IDL-agnostic, i.e. GraphQL layer is separated away from rest of application. Similar goal as above. Allow multi-IDL API, e.g. providing both GraphQL and REST for external consumers.

This is a stub, there is still a lot to do:
  - no error handling
  - no security
  - not connected to actual data sources. Using dummy data only for the moment.
  - query-only, no mutation
  - no query parameters, sorting, pagination, etc.
  - lots of basic HTTP features you would assume are not there yet (e.g. CORS, caching, etc.)
  - validation
  - authorization
  - default values, timestamps, computed values
  - aggregation
  - migrations
  
Many of this will be fast to implement, I just need to get to it!

# How to start

First `npm install`

If in production, run with `npm start`

If in development, run with `NODE_ENV=dev npm start`. This will start in watch mode (using `nodemon` and `node --inspect`).

This will start a local server at `localhost:5001`

Port number can be changed using `PORT` environment variable.

Use your browser to go to `localhost:5001/graphiql` and start exploring the data. Click on "docs" to see the schema.

We recommend using the Chrome extension [Node Inspector Manager](https://github.com/june07/NIM) for Chrome devtools debugging.

# Troubleshooting

Please use Node.js v7.7.2
