'use strict';

const { ALL_TYPES } = require('../../../events');

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

const events = ALL_TYPES.map(getEvent);

const eventObj = {
  name: 'events',
  default: {},
  description: 'Events options',
  group: 'Events',
  validate: { type: 'object' },
};

// `run` option `eventFilter`
const eventFilterNames = [
  'payload',
  'response',
  'argsData',
  'headers',
  'queryVars',
];

const eventFilterDefault = {
  payload: ['id'],
  response: ['id'],
  argsData: ['id'],
  headers: false,
  queryVars: false,
};

const getEventFilter = filterName => ({
  name: `eventFilter.${filterName}`,
  default: eventFilterDefault[filterName],
  description: `Filters the event payload '${filterName}'`,
  group: 'Events',
  validate: {
    type: ['string[]', 'boolean'],
  },
});

const eventFilter = eventFilterNames.map(getEventFilter);

const eventFilterObj = {
  name: 'eventFilter',
  default: {},
  description: 'Events payload filtering options',
  group: 'Events',
  validate: { type: 'object' },
};

// `run` option `eventLevel`
const eventLevel = {
  name: 'eventLevel',
  default: 'info',
  description: 'Filters events according to their importance',
  group: 'Events',
  validate: {
    type: 'string',
    enum: ['info', 'log', 'warn', 'error', 'silent'],
  },
};

module.exports = [
  eventObj,
  ...events,
  eventFilterObj,
  ...eventFilter,
  eventLevel,
];
