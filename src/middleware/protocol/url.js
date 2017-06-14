'use strict';


const parsing = require('../../parsing');


// Fill in:
//  - `input.url`: full URL, e.g. used for logging
//  - `input.path`: URL's path, e.g. used by router
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
const parseUrl = function () {
  return async function parseUrl(input) {
    const { protocol, log, specific } = input;
    const perf = log.perf.start('protocol.parseUrl', 'middleware');

    const url = parsing[protocol].url.getUrl({ specific });
    const path = parsing[protocol].url.getPath({ specific });

    log.add({ url, path });
    Object.assign(input, { url, path });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  parseUrl,
};
