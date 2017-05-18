'use strict';


const http = require('http');

const { log, getPromise } = require('../../utilities');
const { port, host } = require('../../config');


const startServer = async function ({ handleRequest }) {
  const server = http.createServer(requestHandler.bind(null, handleRequest));
  const promise = getPromise();
  server.listen(port, host, function () {
    listeningHandler();
    promise.resolve(server);
  });
  return promise;
};

const requestHandler = async function (handleRequest, req, res) {
  const info = {};
  const protocol = { specific: { req, res } };
  const response = await handleRequest({ info, protocol });
  return response;
};

const listeningHandler = function () {
  log.log(`[HTTP] Listening on ${host}:${port}`);
};


module.exports = {
  httpStartServer: startServer,
};
