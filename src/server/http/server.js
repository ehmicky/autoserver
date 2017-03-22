'use strict';


const http = require('http');

const { console } = require('../../utilities');
const { httpRequestHandler } = require('./request_handler');
const { port, host } = require('../../config');


const startServer = function (options) {
  return http
    .createServer(httpRequestHandler(options))
    .listen(port, host, listeningHandler);
};

const listeningHandler = function () {
  console.log(`Listening on ${host}:${port}`);
};


module.exports = {
  httpStartServer: startServer,
};
