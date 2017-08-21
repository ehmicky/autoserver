'use strict';

const options = [
  ...require('../config'),

  ...require('./idl'),
  ...require('./env'),
  ...require('./events'),
  ...require('./server_name'),
  ...require('./pagination'),
  ...require('./http'),
];

const runOptions = {
  options,
  name: 'run',
  aliases: '*',
  description: 'Start the server',
  examples: [
    ['Start the server', 'run --http.port=5001'],
  ],
};

module.exports = {
  ...runOptions,
};
