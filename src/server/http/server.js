'use strict';


const http = require('http');

const { console } = require('../../utilities');
const { httpRequestHandler } = require('./request_handler');
const { port, host } = require('../../config');


const startServer = function (options) {
  const promise = new Promise((resolve, reject) => {
    try {
      const server = http
        .createServer(httpRequestHandler(options))
        .listen(port, host, function () {
          listeningHandler();
          resolve(server);
        });
    } catch (exception) {
      reject(exception);
    }
  });
  return promise;
};

const listeningHandler = function () {
  console.log(`Listening on ${host}:${port}`);
};


module.exports = {
  httpStartServer: startServer,
};
