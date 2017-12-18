'use strict';

const http = require('http');
const { promisify } = require('util');

const { throwError } = require('../../../error');

// Start HTTP server
const startServer = function ({
  opts: { hostname, port },
  config: { env },
  handleRequest,
}) {
  // Create server
  const server = http.createServer();
  const promise = waitForConnection({ server });

  // In development, Nodemon restarts the server.
  // Pending sockets slow down that restart, so we disable keep-alive.
  if (env === 'dev') {
    // eslint-disable-next-line fp/no-mutation
    server.keepAliveTimeout = 1;
  }

  // Handle server lifecycle events
  handleClientRequest({ server, handleRequest });

  // Start server
  server.listen(port, hostname);

  return promise;
};

const waitForConnection = function ({ server }) {
  const serverOn = promisify(server.on.bind(server));

  const successPromise = successListener({ server, serverOn });
  const errorPromise = errorListener({ serverOn });
  return Promise.race([successPromise, errorPromise]);
};

// Connection success
const successListener = async function ({ server, serverOn }) {
  await serverOn('listening');

  const { address, port } = server.address();
  return { server, hostname: address, port };
};

// Connection failure
const errorListener = async function ({ serverOn }) {
  const error = await serverOn('error');

  const message = 'Could not start HTTP server';
  throwError(message, { reason: 'PROTOCOL', innererror: error });
};

const handleClientRequest = function ({ server, handleRequest }) {
  server.on('request', function requestHandler (req, res) {
    handleRequest({ req, res });
  });
};

module.exports = {
  startServer,
};
