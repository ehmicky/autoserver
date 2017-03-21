'use strict';


const { start } = require('../chain');
const { sendError } = require('../../middleware');

const httpRequestHandler = async function (req, res) {
  try {
    const response = await start({ req, res });
    return response;
  } catch (exception) {
    sendError({ exception, input: { req, res }, protocol: 'http' });
  }
};


module.exports = {
  httpRequestHandler,
};