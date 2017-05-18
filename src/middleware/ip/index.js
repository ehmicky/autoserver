'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { httpGetIp } = require('./http');


const middlewares = {
  http: httpGetIp,
};
const getKey = ({ input: { protocol: { name } } }) => name;

// Sends the response at the end of the request
const getIp = getSwitchMiddleware({
  middlewares,
  getKey,
  name: 'getIp',
});


module.exports = {
  getIp,
};
