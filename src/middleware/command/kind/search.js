'use strict';

const { uniq, intersection } = require('lodash');
const { toSentence } = require('underscore.string');

const { throwError } = require('../../../error');
const { crawlFilter } = require('../../../database');

// `model.kind` 'search' allows for complex `args.filter`
const searchValidator = function ({ args, modelName }) {
  const types = getFilterTypes({ args });
  const typesA = intersection(types, searchFilterTypes);
  if (typesA.length === 0) { return; }

  const message = getErrorMessage({ types: typesA });
  const messageA = `In 'filter' argument, must not ${message} because the model '${modelName}' does not support it`;
  throwError(messageA, { reason: 'WRONG_KIND' });
};

const getFilterTypes = function ({ args: { filter } }) {
  const types = crawlFilter(filter, ({ type }) => type);
  const typesA = uniq(types);
  return typesA;
};

const getErrorMessage = function ({ types }) {
  if (types.includes('or')) {
    return 'use an array of alternatives';
  }

  const typesStr = types.map(val => `'${val}'`);
  const typesStrA = toSentence(typesStr, ', ', ' nor ');
  return `use the operators: ${typesStrA}`;
};

const searchFilterTypes = [
  'neq',
  'in',
  'nin',
  'like',
  'nlike',
  'all',
  'some',
  'or',
];

module.exports = {
  searchValidator,
};
