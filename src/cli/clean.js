'use strict';

const { isEqual } = require('lodash');

const { recursePickBy, omit } = require('../utilities');

// Post-process CLI options
const cleanOpts = function ({ opts }) {
  const optsA = recursePickBy(opts, isCorrectOpt);

  // Remove parser-specific values
  const optsB = omit(optsA, '$0');

  return optsB;
};

const isCorrectOpt = function (val, name) {
  // Remove empty values
  if (val === undefined || isEqual(val, {})) { return false; }

  // Remove dasherized options
  if (DASHERIZED_REGEXP.test(name)) { return false; }

  return true;
};

const DASHERIZED_REGEXP = /-/;

module.exports = {
  cleanOpts,
};
