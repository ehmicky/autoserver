'use strict';


const { onlyOnce } = require('../utilities');
const { EngineError } = require('../error');


const processErrorHandler = function ({ opts }) {
  checkUniqueCall();
};

// Since `startServer()` manipulates process, e.g. by intercepting signals
// or calling process.exit(), we consider it owns it, which implies:
//   - only once instance of this engine per process
//   - this engine cannot share a process with other significant modules/parts
const checkUniqueCall = function () {
  try {
    uniqueCall();
  } catch (innererror) {
    const message = '\'startServer()\' can only be called once per process.';
    throw new EngineError(message, { reason: 'MULTIPLE_SERVERS', innererror });
  }
};
const uniqueCall = onlyOnce(() => {}, { error: true });


module.exports = {
  processErrorHandler,
};
