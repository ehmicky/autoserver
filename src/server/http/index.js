'use strict';


const http = require('http');

const { getPromise } = require('../../utilities');
const { host, port } = require('../../config');


// Start HTTP server
const startServer = function ({ handleRequest, handleListening }) {
  const server = http.createServer(function requestHandler(req, res) {
    handleRequest({ req, res });
  });

  server.listen(port, host, function listeningHandler() {
    handleListening({ protocol: 'HTTP', host, port });
  });

  const promise = getPromise();
  server.on('listening', () => promise.resolve(server));

  return promise;
};


module.exports = {
  httpStartServer: startServer,
};
