'use strict';


const http = require('http');

const { host, port } = require('../../config');
const { addStopMethods } = require('./stop');


// Start HTTP server
const startServer = function ({ handleRequest, handleListening, processLog }) {
  const server = http.createServer(function requestHandler(req, res) {
    handleRequest({ req, res });
  });

  addStopMethods(server);
  server.protocolName = 'HTTP';

  server.listen(port, host, function listeningHandler() {
    handleListening({ protocol: 'HTTP', host, port });
  });

  handleClientError({ server, log: processLog });

  const promise = new Promise((resolve, reject) => {
    server.on('listening', () => resolve(server));
    server.on('error', () => reject());
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
  httpStartServer: startServer,
};
