'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { httpLogger } = require('./http');


const middlewares = {
  http: httpLogger,
};
const getKey = ({ input: { protocol: { name } } }) => name;

// Sends the response at the end of the request
const logger = getSwitchMiddleware({
  middlewares,
  getKey,
  name: 'logger',
});


module.exports = {
  logger,
};
