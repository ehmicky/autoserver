'use strict';


const { start: httpStart } = require('./http');


// Start server for each protocol, for the moment only HTTP
const start = function () {
  httpStart();
};


module.exports = {
  start,
};