'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { httpLogger } = require('./http');


const middlewares = {
  http: httpLogger,
};
const getKey = ({ input: { info: { protocol } } }) => protocol;

// Sends the response at the end of the request
const logger = getSwitchMiddleware({ middlewares, getKey });


module.exports = {
  logger,
};
