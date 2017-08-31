'use strict';

const { config, idl } = require('../shared');

const instruction = require('./instruction');

const options = [
  config,

  idl,
  ...require('./env'),
  ...require('./events'),
  ...require('./server_name'),
  ...require('./pagination'),
  ...require('./http'),
];

module.exports = {
  ...instruction,
  options,
};
