'use strict';


// Buffer logging calls, to ensure those calls get the full requestInfo
// information
const loggingBuffer = function () {
  return async function loggingBuffer(input) {
    const { log } = input;

    const perf = log.perf.start('loggingBuffer', 'middleware');

    let response;
    try {
      // Buffer logging calls
      await log._setBuffered(true);

      perf.stop();
      response = await this.next(input);
      perf.start();
    } finally {
      // Release logging calls, now that all possiblelog.add() calls
      // have been performed
      await log._setBuffered(false);
    }

    perf.stop();

    return response;
  };
};


module.exports = {
  loggingBuffer,
};
