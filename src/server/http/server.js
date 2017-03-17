'use strict';


const http = require('http');

const { console/*, fakeRequest */ } = require('../../utilities');
const { httpRequestHandler } = require('./request_handler');


const port = process.env.PORT || 5001;
const host = process.env.HOST || 'localhost';

const startServer = function () {
  return http
    .createServer(httpRequestHandler)
    .listen(port, host, listeningHandler);
};

const listeningHandler = function () {
  console.log(`Listening on ${host}:${port}`);
  //fakeRequest({ host, port });
};


module.exports = {
  httpStartServer: startServer,
};
