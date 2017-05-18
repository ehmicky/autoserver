'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { httpGetPath } = require('./http');


const middlewares = {
  http: httpGetPath,
};
const getKey = ({ input: { protocol: { name } } }) => name;

// Sends the response at the end of the request
const getPath = getSwitchMiddleware({
  middlewares,
  getKey,
  name: 'getPath',
});


module.exports = {
  getPath,
};
