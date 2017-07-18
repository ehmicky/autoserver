'use strict';

// Buffer logging calls, to ensure those calls get the full requestInfo
// information
const loggingBuffer = async function (input) {
  const { log } = input;
  const perf = log.perf.start('initial.loggingBuffer', 'middleware');

  try {
    // Buffer logging calls
    await log.setBuffered(true);
    perf.stop();

    const response = await this.next(input);
    return response;
  } finally {
    // Release logging calls, now that all possiblelog.add() calls
    // have been performed
    perf.start();
    await log.setBuffered(false);
    perf.stop();
  }
};

module.exports = {
  loggingBuffer,
};
