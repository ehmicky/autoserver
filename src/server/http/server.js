'use strict';


const http = require('http');

const { console/*, fakeRequest */ } = require('../../utilities');
const { requestHandler } = require('./request_handler');


const port = process.env.PORT || 5001;
const host = process.env.HOST || 'localhost';

const start = function () {
  return http
    .createServer(requestHandler)
    .listen(port, host, listeningHandler);
};

const listeningHandler = function () {
  console.log(`Listening on ${host}:${port}`);
  //fakeRequest({ host, port });
};


module.exports = {
  start,
};
