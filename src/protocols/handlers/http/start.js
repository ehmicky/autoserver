'use strict';

const http = require('http');

// Start HTTP server
const startServer = function ({
  opts: { host, port },
  serverOpts: { env },
  processLog,
  handleRequest,
}) {
  // Create server
  const server = http.createServer();
  const promise = getServerPromise({ server });

  // In development, Nodemon restarts the server.
  // Pending sockets slow down that restart, so we disable keep-alive.
  if (env === 'dev') {
    // eslint-disable-next-line fp/no-mutation
    server.keepAliveTimeout = 1;
  }

  // Handle server lifecycle events
  handleClientRequest({ server, handleRequest });
  handleClientError({ server, processLog });

  // Start server
  server.listen(port, host);

  return promise;
};

const getServerPromise = function ({ server }) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    server.on('listening', () => {
      const { address: usedHost, port: usedPort } = server.address();
      resolve({ server, host: usedHost, port: usedPort });
    });
    server.on('error', error => reject(error));
  });
};

const handleClientRequest = function ({ server, handleRequest }) {
  server.on('request', function requestHandler (req, res) {
    handleRequest({ req, res });
  });
};

// Report TCP client errors
const handleClientError = function ({ server, processLog }) {
  server.on('clientError', async (error, socket) => {
    const message = 'Client TCP socket error';
    await processLog({ error, message });

    socket.end('');
  });
};

module.exports = {
  startServer,
};
