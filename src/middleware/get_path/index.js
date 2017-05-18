'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { httpGetPath } = require('./http');


const middlewares = {
  http: httpGetPath,
};
const getKey = ({ input: { info: { protocol } } }) => protocol;

// Sends the response at the end of the request
const getPath = getSwitchMiddleware({
  middlewares,
  getKey,
  name: 'getPath',
});


module.exports = {
  getPath,
};
