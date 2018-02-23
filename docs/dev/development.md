# Dev server

First `npm install`.

An example configuration is available at `/examples`. To start a server with
that configuration, use either:
  - `npm start`: production mode
  - `npm run watch`: dev mode.
    Auto-reloads, using [Nodemon](https://github.com/remy/nodemon).
    Allows debugging in Chrome developer tools, using `node --inspect`.
  - `npm run debug`: like `npm start` but using `node --inspect-brk`,
    i.e. will put a breakpoint on server start.

A local HTTP server will be spawned at `http://localhost:5001`.

# Building

Building is performed with `npm run build` (one-time) or
`npm run build_watch` (watch mode).

At the moment, the only task performed in to transform some files from YAML to
JSON.

# Testing

There is no automated testing yet.

`npm test` will:
  - run linting, using [ESLint](http://eslint.org/)
  - check for code duplication
  - check for dead links in the documentation

# Troubleshooting

  - Please use Node.js v9.6.1
