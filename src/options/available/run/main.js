'use strict';

const { config, schema } = require('../shared');

// eslint-disable-next-line import/order
const instruction = require('./instruction');

const options = [
  config,

  schema,
  ...require('./env'),
  ...require('./events'),
  ...require('./server_name'),
  ...require('./limits'),
  ...require('./http'),
  ...require('./db'),
];

module.exports = {
  ...instruction,
  options,
};
