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

// `run` option `filter`
const FILTER_NAMES = [
  'payload',
  'response',
  'data',
  'query',
];

const FILTER_DEFAULT = {
  payload: ['id', 'operationName'],
  response: ['id'],
  data: ['id'],
  query: ['operationName'],
};

const getFilter = filterName => ({
  name: `filter.${filterName}`,
  default: FILTER_DEFAULT[filterName],
  description: `Filters the event payload '${filterName}'`,
  group: 'Events',
  validate: {
    type: ['string[]', 'boolean'],
    unique: true,
  },
});

const filter = FILTER_NAMES.map(getFilter);

const filterObj = {
  name: 'filter',
  default: {},
  description: 'Events payload filtering options',
  group: 'Events',
  validate: { type: 'object' },
};

// `run` option `level`
const level = {
  name: 'level',
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
  filterObj,
  ...filter,
  level,
];
