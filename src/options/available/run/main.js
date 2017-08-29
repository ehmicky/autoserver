'use strict';

const { config, idl } = require('../shared');

const options = [
  config,

  idl,
  ...require('./env'),
  ...require('./events'),
  ...require('./server_name'),
  ...require('./pagination'),
  ...require('./http'),
];

const runOptions = {
  options,
  name: 'run',
  // This means this is the default instruction
  aliases: '*',
  description: 'Start the server',
  examples: [
    ['Start the server', '--http.port=5001'],
  ],
};

module.exports = {
  ...runOptions,
};
