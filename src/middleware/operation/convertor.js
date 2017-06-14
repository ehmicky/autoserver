'use strict';


// Converts from Protocol format to Operation format
const operationConvertor = function () {
  return async function operationConvertor({
    goal,
    queryVars,
    pathVars,
    params,
    settings,
    payload,
    route,
    jsl,
    log,
  }) {
    const perf = log.perf.start('operation.convertor', 'middleware');

    // Not kept: protocol, protocolFullName, timestamp, requestId, ip, url,
    // path, method, headers
    const newInput = {
      goal,
      queryVars,
      pathVars,
      params,
      settings,
      payload,
      route,
      jsl,
      log,
    };

    perf.stop();
    const response = await this.next(newInput);
    return response;
  };
};


module.exports = {
  operationConvertor,
};
