'use strict';

const { getExtNames, DESCRIPTION } = require('../../formats');

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
  description: `File containing the data model and business logic. The following formats are available: ${DESCRIPTION}`,
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

const options = [
  schema,
];

module.exports = {
  ...instruction,
  options,
};
