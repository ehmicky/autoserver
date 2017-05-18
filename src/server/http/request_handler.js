'use strict';


const { start } = require('../chain');

const httpRequestHandler = async function (opts) {
  // Apply options
  const startFunc = await start(opts);

  return async function (req, res) {
    const info = {};
    const protocol = { req, res };
    const response = await startFunc({ req, res, info, protocol });
    return response;
  };
};


module.exports = {
  httpRequestHandler,
};
