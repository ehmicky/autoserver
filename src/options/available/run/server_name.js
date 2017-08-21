'use strict';

// `run` option `serverName`
const serverName = {
  name: 'serverName',
  description: 'Unique name of the server',
  validate: {
    type: 'string',
  },
};

module.exports = [
  serverName,
];
