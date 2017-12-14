'use strict';

const { monitor } = require('../../perf');

const { emitMessageEvent } = require('./message');
const { addExitHandler } = require('./error');

// Add event handling, message event and monitoring capabilities to the function
const wrapCloseFunc = function (func) {
  const funcA = closeFunc.bind(null, func);

  const eFunc = addExitHandler(funcA);

  const mFunc = monitor(eFunc, getEventLabel, 'main');
  return mFunc;
};

const closeFunc = async function (func, opts) {
  await emitMessageEvent({ ...opts, step: 'start' });

  await func(opts);

  await emitMessageEvent({ ...opts, step: 'end' });

  // Exit status
  return { [opts.adapter.name]: true };
};

const getEventLabel = function ({ type, adapter: { name } }) {
  return `${type}.${name}`;
};

module.exports = {
  wrapCloseFunc,
};
