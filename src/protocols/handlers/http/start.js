'use strict';


const http = require('http');

const { ENV } = require('../../../utilities');
const { addStopFunctions } = require('./stop');


// Start HTTP server
const startServer = function ({
  serverState: { handleRequest, handleListening, processLog },
  serverOpts: { HTTP: { host, port } },
}) {
  const server = http.createServer(function requestHandler(req, res) {
    handleRequest({ protocol: 'HTTP', req, res });
  });

  server.protocolName = 'HTTP';

  // In development, Nodemon restarts the server.
  // Pending sockets slow down that restart, so we disable keep-alive.
  if (ENV === 'dev') {
    server.keepAliveTimeout = 1;
  }

  addStopFunctions({ server });

  server.on('listening', function listeningHandler() {
    const { address: usedHost, port: usedPort } = this.address();
    Object.assign(server, { host: usedHost, port: usedPort });
    handleListening({ protocol: 'HTTP', host: usedHost, port: usedPort });
  });

  const promise = new Promise((resolve, reject) => {
    server.on('listening', () => resolve(server));
    server.on('error', error => reject(error));
  });

  handleClientError({ server, log: processLog });

  server.listen(port, host);

  return promise;
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
