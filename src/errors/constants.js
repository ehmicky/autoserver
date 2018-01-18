'use strict';

const ERROR_TYPE = Symbol('error');

const ALLOWED_OPTS = ['reason', 'innererror', 'extra'];

const MISSING_MESSAGE = 'Missing error message';

module.exports = {
  ERROR_TYPE,
  ALLOWED_OPTS,
  MISSING_MESSAGE,
};
