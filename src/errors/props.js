'use strict';

const pluralize = require('pluralize');
const { decapitalize } = require('underscore.string');

const { getWordsList } = require('../utilities');

const { throwError } = require('./main');
const REASONS = require('./reasons');

// Get generic standard error properties, according to error reason
const getProps = function (error) {
  const reason = getReason(error);
  const props = REASONS[reason];
  return props;
};

// Get error reason
const getReason = function ({ reason = 'UNKNOWN' } = { reason: 'SUCCESS' }) {
  if (REASONS[reason] === undefined) { return 'UNKNOWN'; }

  return reason;
};

// Throw exception for a specific error reason
const throwPb = function ({ reason, message, ...rest }) {
  const { message: prefix, extra = {} } = getReasonMessage({ reason, ...rest });
  const messageA = addPrefix({ message, prefix });
  throwError(messageA, { reason, extra });
};

// Each error reason can have its own message prefix and additional props
const getReasonMessage = function ({ reason, ...rest }) {
  const { getMessage } = getProps({ reason });

  if (getMessage === undefined) {
    return { message: '' };
  }

  const models = getModels(rest);
  const { message, extra } = getMessage({ models, ...rest });
  return { message, extra };
};

const addPrefix = function ({ message, prefix }) {
  if (message === undefined) { return prefix; }
  if (prefix === undefined) { return message; }

  return `${prefix}, ${decapitalize(message)}`;
};

// Try to make error messages start the same way when referring to models
const getModels = function ({ ids, op = 'and', clientCollname }) {
  if (clientCollname === undefined) {
    return 'Those models';
  }

  if (ids === undefined) {
    return `Those '${clientCollname}' models`;
  }

  const idsA = getWordsList(ids, { op, quotes: true });
  const models = `The '${clientCollname}' ${pluralize('model', ids.length)} with 'id' ${idsA}`;
  return models;
};

module.exports = {
  getProps,
  getReason,
  throwPb,
};
