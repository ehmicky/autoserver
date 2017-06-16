'use strict';


const { handleError } = require('./error');
const { handleFailure } = require('./failure');


// Error handler, which sends final response, if errors
const errorHandler = async function (input) {
  const { log, protocolHandler, specific } = input;

  try {
    const response = await this.next(input);
    return response;
  } catch (error) {
    try {
      const perf = log.perf.start('initial.errorHandler', 'exception');
      await handleError({ log, error });
      perf.stop();
    // If error handler itself fails
    } catch (innererror) {
      await handleFailure({ log, error: innererror });
    // Make sure a response is sent, or the socket will hang
    } finally {
      const status = protocolHandler.failureProtocolStatus;
      protocolHandler.send.nothing({ specific, status });
    }
  }
};


module.exports = {
  errorHandler,
};
