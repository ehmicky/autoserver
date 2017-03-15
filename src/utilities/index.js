'use strict';


const { connectToPromise } = require('./connect_to_promise');
const { console } = require('./console');
const { fakeRequest } = require('./fake_request');


module.exports = {
  connectToPromise,
  console,
  fakeRequest,
};