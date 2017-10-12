'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../utilities');
const { throwError } = require('../error');

const { getFlatOpts } = require('./flat_opts');

// Validates unknown options
const checkUnknownOpts = function ({ options, availableOpts }) {
  const flatOpts = getFlatOpts({ options, availableOpts });
  checkUnknown({ flatOpts });

  return { options, flatOpts };
};

const checkUnknown = function ({ flatOpts }) {
  const unknownOpts = flatOpts
    .filter(({ unknown }) => unknown)
    .map(({ name }) => name);

  if (unknownOpts.length === 0) { return; }

  const optionWord = pluralize('option', unknownOpts.length);
  const optionList = getWordsList(unknownOpts, { op: 'and', quotes: true });
  const message = `Unknown ${optionWord}: ${optionList}`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  checkUnknownOpts,
};
