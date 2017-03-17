'use strict';


const app = require('../app');


const httpRequestHandler = async function (req, res) {
  const response = await app.start({ req, res });
  return response;
};


module.exports = {
  httpRequestHandler,
};