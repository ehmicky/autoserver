'use strict';


const parsing = require('../../parsing');


// Fill in:
//  - `input.url`: full URL
//  - `input.path`: URL's path
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
// Meant to be used mainly by router.
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
