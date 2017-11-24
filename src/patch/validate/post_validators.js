'use strict';

const { checkNull } = require('./types');
const { applyCheck } = require('./check');

// Apply validation after $model.ATTR has been resolved
const POST_VALIDATORS = [
  checkNull,
  applyCheck,
];

module.exports = {
  POST_VALIDATORS,
};
