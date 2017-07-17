'use strict';

// Returns the function with the two added functions:
//   - func.cork() will buffer calls, i.e. it will become a noop
//   - func.uncork() will release all buffered calls
// Works with async functions as well.
const buffer = function (func, context = null) {
  const state = getBufferState();
  const newFunc = bufferedFunc.bind(context, state, func);

  const cork = corkFunc.bind(null, state);
  const uncork = uncorkFunc.bind(context, state, func);
  Object.assign(newFunc, { cork, uncork });

  return newFunc;
};

const getBufferState = () => ({
  isBuffered: false,
  bufferedCalls: [],
});

const bufferedFunc = async function (state, func, ...args) {
  if (state.isBuffered) {
    state.bufferedCalls.push(args);
    return;
  }

  await func.call(this, ...args);
};

const corkFunc = function (state) {
  state.isBuffered = true;
};

const uncorkFunc = async function (state, func) {
  for (const args of state.bufferedCalls) {
    await func.call(this, ...args);
  }
  state.isBuffered = false;
};

module.exports = {
  buffer,
};
