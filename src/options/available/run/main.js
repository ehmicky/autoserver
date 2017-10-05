'use strict';

const { config, idl } = require('../shared');

// eslint-disable-next-line import/order
const instruction = require('./instruction');

const options = [
  config,

  idl,
  ...require('./env'),
  ...require('./http'),
  ...require('./events'),
  ...require('./server_name'),
  ...require('./limits'),
];

module.exports = {
  ...instruction,
  options,
};
