'use strict';


const http = require('http');

const { host, port } = require('../../../config');
const { addStopFunctions } = require('./stop');


// Start HTTP server
const startServer = function ({
  serverState: { handleRequest, handleListening, processLog },
}) {
  const server = http.createServer(function requestHandler(req, res) {
    handleRequest({ req, res });
  });

  addStopFunctions(server);
  server.protocolName = 'HTTP';

  server.listen(port, host, function listeningHandler() {
    const { address: usedHost, port: usedPort } = server.address();
    handleListening({ protocol: 'HTTP', host: usedHost, port: usedPort });
  });

  handleClientError({ server, log: processLog });

  const promise = new Promise((resolve, reject) => {
    server.on('listening', () => resolve(server));
    server.on('error', error => reject(error));
  });

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
  HTTP: {
    startServer,
  },
};
