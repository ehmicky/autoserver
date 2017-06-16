'use strict';


// Fill in:
//  - `input.url`: full URL, e.g. used for logging
//  - `input.path`: URL's path, e.g. used by router
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
const parseUrl = function () {
  return async function parseUrl(input) {
    const { protocolHandler, log, specific } = input;
    const perf = log.perf.start('protocol.parseUrl', 'middleware');

    const origin = protocolHandler.getOrigin({ specific });
    const path = protocolHandler.getPath({ specific });
    const url = `${origin}${path}`;

    log.add({ url, path, origin });
    Object.assign(input, { url, path, origin });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  parseUrl,
};
