'use strict';


// Buffer logging calls, to ensure those calls get the full requestInfo
// information
const loggingBuffer = function () {
  return async function loggingBuffer(input) {
    const { log } = input;

    let response;
    try {
      // Buffer logging calls
      log._setBuffered(true);
      response = await this.next(input);
    } finally {
      // Release logging calls, now that all possiblelog.add() calls
      // have been performed
      log._setBuffered(false);
    }
    return response;
  };
};


module.exports = {
  loggingBuffer,
};
