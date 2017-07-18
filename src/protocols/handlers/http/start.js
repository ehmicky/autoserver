'use strict';

const http = require('http');
const { promisify } = require('util');

const { ENV } = require('../../../utilities');

// Start HTTP server
const startServer = function ({
  opts: { host, port },
  processLog,
  handleRequest,
  handleListening,
}) {
  // Create server
  const server = http.createServer();
  const promise = getServerPromise({ server });

  // In development, Nodemon restarts the server.
  // Pending sockets slow down that restart, so we disable keep-alive.
  if (ENV === 'dev') {
    server.keepAliveTimeout = 1;
  }

  // Add functions related to server exits
  Object.assign(server, { stopServer, countPendingRequests });

  // Handle server lifecycle events
  handleClientRequest({ server, handleRequest });
  handleServerListening({ server, handleListening });
  handleClientError({ server, log: processLog });

  // Start server
  server.listen(port, host);

  return promise;
};

const getServerPromise = function ({ server }) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    server.on('listening', () => resolve(server));
    server.on('error', error => reject(error));
  });
};

// Try a graceful server exit
const stopServer = async function () {
  await promisify(this.close.bind(this))();
};

// Count number of pending requests, to log information on server exits
const countPendingRequests = async function () {
  const count = await promisify(this.getConnections.bind(this))();
  return count;
};

const handleServerListening = function ({ server, handleListening }) {
  server.on('listening', function listeningHandler () {
    const { address: usedHost, port: usedPort } = this.address();
    handleListening({ server, host: usedHost, port: usedPort });
  });
};

const handleClientRequest = function ({ server, handleRequest }) {
  server.on('request', function requestHandler (req, res) {
    handleRequest({ req, res });
  });
};

// Report TCP client errors
const handleClientError = function ({ server, log }) {
  server.on('clientError', async (error, socket) => {
    const message = 'Client TCP socket error';
    await log.process({ value: error, message });

    socket.end('');
  });
};

module.exports = {
  startServer,
};
