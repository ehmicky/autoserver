# What this is

This is prototype for a web server that generates a GraphQL endpoint taking only a single declarative file as input. Please see how this file looks like at `/src/idl/example.json`.

The idea: have a stable and robust API engine, and only have to edit simple/non-verbose declarative files for 80% of what is currently done in the backend, including: validation, authorization, CRUD, side-effects, etc.

The current architecture is optimized for being deployed as a single stateless FaaS that boots fast, then dies once request is over.

The details of the HTTP protocol are abstracted away from the rest of the application, so it is theoritically protocol-agnostic (e.g. could server over WebSocket without much hassle).

This is a stub, there is still a lot to do:
  - no error handling
  - no security
  - not connected to actual data sources. Using dummy data only for the moment.
  - lots of basic HTTP features you would assume are not there (e.g. CORS, caching, etc.)
  - validation, authorization, etc.

Many of this will be very fast to implement, I just need to get to it!

# How to start

`npm install` then `npm start`

This will start a local server at `localhost:5001`

Use your browser to go to `localhost:5001/graphiql` and start exploring the data.

# Troubleshooting

Please use Node.js v7.7.2