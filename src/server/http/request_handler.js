'use strict';


const app = require('../app');
const { sendError } = require('../../protocol');

const httpRequestHandler = async function (req, res) {
  try {
    const response = await app.start({ req, res });
    return response;
  } catch (exception) {
    sendError({ exception, input: { req, res }, protocol: 'http' });
  }
};


module.exports = {
  httpRequestHandler,
};