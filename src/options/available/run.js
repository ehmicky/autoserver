'use strict';

const { getDescription, getExtNames } = require('../../formats');

const instruction = {
  name: 'run',
  aliases: '*',
  description: 'Start the server',
  examples: [
    ['Start the server', '--protocols.http.port 5001'],
  ],
};

const schema = {
  name: 'schema',
  description: 'File containing the data model and business logic',
  subConfFiles: [{
    filename: 'schema',
    extNames: getExtNames('conf'),
    instruction: 'run',
  }],
  validate: {
    type: 'string',
    required: true,
  },
};

const config = {
  name: 'config',
  description: `Configuration file (${getDescription('conf')})`,
  validate: {
    type: 'string',
  },
};

const options = [
  config,
  schema,
];

module.exports = {
  ...instruction,
  options,
};
