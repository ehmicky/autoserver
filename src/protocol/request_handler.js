'use strict';


const defineLayers = require('../define_layers');


const handler = async function requestHandler(req, res) {
  const response = await defineLayers.start(req, res);
  return response;
};


module.exports = handler;