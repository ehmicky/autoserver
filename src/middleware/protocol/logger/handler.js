'use strict';


const { getReason } = require('../../../error');
const { infoSym } = require('../../../logging');
const { getRequestInfo } = require('./request_info');


// logInfo:
//   - requestId
//   - timestamp
//   - ip
//   - protocol
//   - protocolFullName
//   - url
//   - path
//   - route
//   - protocolMethod
//   - method
//   - status
//   - protocolStatus
//   - params
//   - queryVars
//   - pathVars
//   - headers
//   - payload
//   - protocolArgs
//   - interface
//   - actions:
//      - ACTION_PATH:
//          - model
//          - args (original)
//          - responses OBJ_ARR:
//             - content
//   - response (the one that was sent): content, type
//   - error reason
// logInfo.lean: shortened version (see `lean.js` for more info)

// Main request logging middleware.
// Each request creates exactly one log, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error logging middleware.

// TODO: explanation comments here
const logger = function ({ log }) {
  return async function httpLogger(input) {
    const { logInfo } = input;

    try {
      const response = await this.next(input);

      handleLog({ log, logInfo });

      return response;
    } catch (error) {
      if (!(error instanceof Error)) {
        error = new Error(String(error));
      }

      const errorReason = getReason({ error });
      logInfo.add({ errorReason });
      handleLog({ log, logInfo });

      throw error;
    }
  };
};

const handleLog = function ({ log, logInfo }) {
  const info = logInfo[infoSym];
  const requestInfo = getRequestInfo(info);
  const message = getMessage(requestInfo);
  const level = levelMap[requestInfo.status] || 'error';

  log[level](message, { type: 'request', requestInfo });
};

const levelMap = {
  INTERNALS: 'debug',
  SUCCESS: 'log',
  CLIENT_ERROR: 'warn',
  SERVER_ERROR: 'error',
};

const getMessage = function ({
  protocolFullName,
  protocolMethod,
  path,
  protocolStatus,
  error,
  actions = {},
  fullAction,
}) {
  const action = error ? fullAction : Object.keys(actions).join(' ');
  const message = [
    protocolStatus,
    error,
    '-',
    protocolFullName,
    protocolMethod,
    path,
    action,
  ].filter(val => val)
    .join(' ');
  return message;
};


//   - requestId
//   - timestamp
//   - ip
//   - protocol
//   - protocolFullName
//   - url
//   - path
//   - route
//   - protocolMethod
//   - method
//   - status
//   - protocolStatus
//   - params
//   - queryVars
//   - pathVars
//   - headers
//   - payload
//   - protocolArgs
//   - interface
//   - actions:
//      - ACTION_PATH:
//          - model
//          - args (original)
//          - responses OBJ_ARR:
//             - content
//   - response (the one that was sent): content, type
//   - error

module.exports = {
  logger,
};
