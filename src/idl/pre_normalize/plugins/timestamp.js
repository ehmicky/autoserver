'use strict';

const { attributesPlugin } = require('./attributes');

// Plugin that adds default timestamps to each model:
//   created_time {string} - set on model creation
//   updated_time {string} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
const timestampPlugin = function ({ idl, opts }) {
  return attributesPlugin({ getAttributes })({ idl, opts });
};

const getAttributes = () => ({
  created_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was created',
    examples: ['2017-04-26T11:19:45Z'],
    readonly: true,
    transform: {
      value: '($NOW)',
      test: '($COMMAND === "create")',
    },
    validate: {
      format: 'date-time',
    },
  },
  updated_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was last updated',
    examples: ['2017-04-26T11:19:45Z'],
    readonly: true,
    transform: '($NOW)',
    validate: {
      format: 'date-time',
    },
  },
});

module.exports = {
  timestampPlugin,
};
