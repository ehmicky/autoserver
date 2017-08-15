'use strict';

const { ALL_TYPES } = require('../../events');

// Runtime option `events`
const getEvent = type => ({
  name: `events.${type}`,
  validate: {
    type: 'function',
  },
});

const events = ALL_TYPES.map(getEvent);

const eventObj = {
  name: 'events',
  default: {},
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
  validate: {
    type: ['string[]', 'boolean'],
  },
});

const eventFilter = eventFilterNames.map(getEventFilter);

const eventFilterObj = {
  name: 'eventFilter',
  default: {},
  validate: { type: 'object' },
};

// Runtime option `eventLevel`
const eventLevel = {
  name: 'eventLevel',
  default: 'info',
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
