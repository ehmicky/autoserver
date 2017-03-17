'use strict';


require('./debugging');

const { startServer } = require('./server');


startServer();


module.exports = {
  startServer,
};