'use strict';


const http = require('http');

const { addStopFunctions } = require('./stop');


// Start HTTP server
const startServer = function ({
  serverState: { handleRequest, handleListening, processLog },
  serverOpts: { HTTP: { host, port } },
}) {
  const server = http.createServer(function requestHandler(req, res) {
    handleRequest({ req, res });
  });

  addStopFunctions(server);
  server.protocolName = 'HTTP';

  server.on('listening', function listeningHandler() {
    const { address: usedHost, port: usedPort } = this.address();
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
  HTTP: {
    startServer,
  },
};
