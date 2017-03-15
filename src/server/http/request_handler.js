'use strict';


const app = require('../app');


const requestHandler = async function (req, res) {
  const response = await app.start(req, res);
  return response;
};


module.exports = {
  requestHandler,
};