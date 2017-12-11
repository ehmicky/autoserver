'use strict';

const { DESCRIPTION } = require('../formats');

const schemaPath = {
  name: 'config',
  description: `Path to the configuration file. The following formats are available: ${DESCRIPTION}`,
  validate: {
    type: 'string',
    required: true,
  },
};

const runInstruction = {
  name: 'run',
  aliases: '*',
  description: 'Start the server',
  examples: [
    ['Start the server', '--protocols.http.port 5001'],
  ],
  options: [schemaPath],
};

const availableInstructions = [
  runInstruction,
];

module.exports = {
  availableInstructions,
};
