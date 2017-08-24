'use strict';

const { throwError } = require('../../error');
const { GOALS } = require('../../constants');

// Fill in:
//  - `mInput.method`: protocol-specific method, e.g. 'POST'
//  - `mInput.goal`: protocol-agnostic method, e.g. 'create'
// Meant to be used by operation layer.
const parseMethod = function ({ specific, protocolHandler }) {
  const method = getMethod({ specific, protocolHandler });
  const goal = getGoal({ method, protocolHandler });

  return { method, goal };
};

const getMethod = function ({ specific, protocolHandler }) {
  const method = protocolHandler.getMethod({ specific });

  if (typeof method !== 'string') {
    const message = `'method' must be a string, not '${method}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return method;
};

const getGoal = function ({ method, protocolHandler }) {
  const goal = protocolHandler.getGoal({ method });
  validateGoal({ goal, method });
  return goal;
};

const validateGoal = function ({ goal, method }) {
  if (!goal) {
    const message = `Unsupported protocol method: '${method}'`;
    throwError(message, { reason: 'UNSUPPORTED_METHOD' });
  }

  if (typeof goal !== 'string') {
    const message = `'goal' must be a string, not '${goal}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (!GOALS.includes(goal)) {
    const message = `Invalid 'goal' '${goal}', must be one of: ${GOALS.join(', ')}`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  parseMethod,
};
