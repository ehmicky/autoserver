'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { httpFillParams } = require('./http');


const middlewares = {
  http: httpFillParams,
};
const getKey = ({ input: { info: { protocol } } }) => protocol;

// Sends the response at the end of the request
const fillParams = getSwitchMiddleware({ middlewares, getKey });


module.exports = {
  fillParams,
};
