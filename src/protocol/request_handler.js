'use strict';


const layers = require('../layers');


const handler = async function (req, res) {
  const response = await layers.start(req, res);
  return response;
};


module.exports = handler;