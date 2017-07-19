'use strict';

const { EngineError } = require('../../error');
const { GOALS } = require('../../constants');

// Fill in:
//  - `input.method`: protocol-specific method, e.g. 'POST'
//  - `input.goal`: protocol-agnostic method, e.g. 'create'
// Meant to be used by operation layer.
const parseMethod = async function (input) {
  const { specific, protocolHandler, log } = input;

  const method = getMethod({ specific, protocolHandler });
  const goal = getGoal({ method, protocolHandler });

  log.add({ method, goal });
  Object.assign(input, { method, goal });

  const response = await this.next(input);
  return response;
};

const getMethod = function ({ specific, protocolHandler }) {
  const method = protocolHandler.getMethod({ specific });

  if (typeof method !== 'string') {
    const message = `'method' must be a string, not '${method}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return method;
};

const getGoal = function ({ method, protocolHandler }) {
  const goal = protocolHandler.getGoal({ method });

  if (!goal) {
    const message = `Unsupported protocol method: '${method}'`;
    throw new EngineError(message, { reason: 'UNSUPPORTED_METHOD' });
  }

  if (typeof goal !== 'string') {
    const message = `'goal' must be a string, not '${goal}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (!GOALS.includes(goal)) {
    const message = `Invalid 'goal' '${goal}', must be one of: ${GOALS.join(', ')}`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return goal;
};

module.exports = {
  parseMethod,
};
