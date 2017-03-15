'use strict';


const { chain } = require('./chain');
const { MiddlewareModifier, bind, test, branch, repeat, repeatEnd, repeatUnless } = require('./modifiers');
const { MiddlewareWrapper } = require('./wrapper');
const { flatten, middlewaresSymbol } = require('./nesting');
const { createDebugMiddleware } = require('./debug');


module.exports = {

  // For chain consumers
  chain,

  bind,
  test,
  branch,
  repeat,
  repeatEnd,
  repeatUnless,

  createDebugMiddleware,

  // For modifiers creators
  MiddlewareModifier,
  MiddlewareWrapper,

  flatten,
  middlewaresSymbol,

};

