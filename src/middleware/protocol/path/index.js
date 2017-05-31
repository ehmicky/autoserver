'use strict';


const { mapAsync } = require('../../../utilities');
const { httpGetPath } = require('./http');


// Retrieve request path, so it can be used e.g. by routing middleware and
// logger
const getPath = async function (opts) {
  const map = await mapAsync(getPathMap, async func => await func(opts));

  return async function getPath(input) {
    const { protocol, log } = input;
    const { url, path } = map[protocol](input);

    log.add({ url, path });
    Object.assign(input, { url, path });

    const response = await this.next(input);
    return response;
  };
};

const getPathMap = {
  http: httpGetPath,
};


module.exports = {
  getPath,
};
