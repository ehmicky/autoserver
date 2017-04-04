'use strict';


const { start } = require('../chain');
const { sendError } = require('../../middleware');

const httpRequestHandler = async function (opts) {
  // Apply options
  const startFunc = await start(opts);
  const sendErrorFunc = sendError(opts);

  return async function (req, res) {
    try {
      const response = await startFunc({ req, res });
      return response;
    } catch (exception) {
      sendErrorFunc({ exception, input: { req, res }, protocol: 'http' });
    }
  };
};


module.exports = {
  httpRequestHandler,
};
