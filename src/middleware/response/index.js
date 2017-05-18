'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { httpSendResponse } = require('./http');


const middlewares = {
  http: httpSendResponse,
};
const getKey = ({ input: { info: { protocol } } }) => protocol;

// Sends the response at the end of the request
const sendResponse = getSwitchMiddleware({
  middlewares,
  getKey,
  name: 'sendResponse',
});


module.exports = {
  sendResponse,
};
