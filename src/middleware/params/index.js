'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { httpFillParams } = require('./http');


const middlewares = {
  http: httpFillParams,
};
const getKey = ({ input: { protocol: { name } } }) => name;

// Sends the response at the end of the request
const fillParams = getSwitchMiddleware({
  middlewares,
  getKey,
  name: 'fillParams',
});


module.exports = {
  fillParams,
};
