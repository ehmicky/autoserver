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

const getEventFilter = filterName => ({
  name: `eventFilter.${filterName}`,
  validate: {
    type: ['string[]', 'boolean'],
  },
});

const eventFilter = eventFilterNames.map(getEventFilter);

const eventFilterObj = {
  name: 'eventFilter',
  validate: { type: 'object' },
};

// Runtime option `eventLevel`
const eventLevel = {
  name: 'eventLevel',
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
