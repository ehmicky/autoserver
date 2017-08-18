'use strict';

const { ALL_TYPES } = require('../../../events');

// Runtime option `events`
const getEvent = type => ({
  name: `events.${type}`,
  default: null,
  description: getDescription({ type }),
  group: 'Events',
  validate: {
    type: 'function',
  },
});

const getDescription = function ({ type }) {
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

// Runtime option `eventFilter`
const eventFilterNames = [
  'payload',
  'response',
  'argData',
  'actionResponses',
  'headers',
  'queryVars',
  'params',
  'settings',
];

const eventFilterDefault = {
  payload: ['id'],
  response: ['id'],
  argData: ['id'],
  actionResponses: ['id'],
  headers: false,
  queryVars: false,
  params: false,
  settings: false,
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

// Runtime option `eventLevel`
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
