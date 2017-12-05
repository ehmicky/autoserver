'use strict';

const { TYPES } = require('../../../events');

// `run` option `events`
const getEvent = function (type) {
  const description = getEventDescription({ type });

  return {
    name: `events.${type}`,
    subConfFiles: [{
      filename: `event.${type}`,
      extNames: ['js'],
      loader: 'javascript',
    }],
    default: null,
    description,
    group: 'Events',
    validate: { type: 'function' },
  };
};

const getEventDescription = function ({ type }) {
  if (type === 'any') {
    return `Function fired when any event happens`;
  }

  return `Function fired when '${type}' happens`;
};

const events = TYPES.map(getEvent);

const eventObj = {
  name: 'events',
  default: {},
  description: 'Events options',
  group: 'Events',
  validate: { type: 'object' },
};

// `run` option `level`
const level = {
  name: 'level',
  description: 'Filters events according to their importance',
  default: 'info',
  group: 'Events',
  validate: {
    type: 'string',
    enum: ['info', 'log', 'warn', 'error', 'silent'],
  },
};

module.exports = [
  eventObj,
  ...events,
  level,
];
