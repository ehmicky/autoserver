'use strict';

// Returns the function with the two added functions:
//   - func.cork() will buffer calls, i.e. it will become a noop
//   - func.uncork() will release all buffered calls
// Works with async functions as well.
const buffer = function (func, ctx = null) {
  const state = getBufferState();
  const newFunc = bufferedFunc.bind(ctx, { state, func, ctx });

  const cork = corkFunc.bind(null, { state });
  const uncork = uncorkFunc.bind(null, { state, func, ctx });
  Object.assign(newFunc, { cork, uncork });

  return newFunc;
};

const getBufferState = () => ({
  isBuffered: false,
  bufferedCalls: [],
});

const bufferedFunc = async function ({ state, func, ctx }, ...args) {
  if (state.isBuffered) {
    state.bufferedCalls.push(args);
    return;
  }

  await func.call(ctx, ...args);
};

const corkFunc = function ({ state }) {
  state.isBuffered = true;
};

const uncorkFunc = async function ({ state, func, ctx }) {
  const promises = state.bufferedCalls.map(args => func.call(ctx, ...args));
  await Promise.all(promises);

  state.isBuffered = false;
};

module.exports = {
  buffer,
};
