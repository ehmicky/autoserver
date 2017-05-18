'use strict';


const { start } = require('../chain');
const { sendError } = require('../../middleware');

const httpRequestHandler = async function (opts) {
  // Apply options
  const startFunc = await start(opts);
  const sendErrorFunc = await sendError(opts);

  return async function (req, res) {
    const info = {};
    const protocol = {};
    try {
      const response = await startFunc({ req, res, info, protocol });
      return response;
    } catch (exception) {
      sendErrorFunc({ exception, input: { req, res }, info });
    }
  };
};


module.exports = {
  httpRequestHandler,
};
