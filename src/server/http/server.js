'use strict';


const http = require('http');

const { log, getPromise } = require('../../utilities');
const { httpRequestHandler } = require('./request_handler');
const { port, host } = require('../../config');


const startServer = async function (options) {
  const requestHandler = await httpRequestHandler(options);
  const server = http.createServer(requestHandler);
  const promise = getPromise();
  server.listen(port, host, function () {
    listeningHandler();
    promise.resolve(server);
  });
  return promise;
};

const listeningHandler = function () {
  log.log(`[HTTP] Listening on ${host}:${port}`);
};


module.exports = {
  httpStartServer: startServer,
};
