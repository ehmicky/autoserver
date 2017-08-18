'use strict';

const options = [
  ...require('./env'),
  ...require('./events'),
  ...require('./server_name'),
  ...require('./pagination'),
  ...require('./http'),
];

const runOptions = { options, topLevel: 'runtime' };

module.exports = {
  run: runOptions,
};
