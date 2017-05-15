'use strict';


const { log } = require('../../../utilities');


const httpLogger = async function () {
  return async function httpLogger(input) {
    logRequest(input);

    const response = await this.next(input);
    return response;
  };
};

const logRequest = function ({
  req: { httpVersion, method, url, headers },
  info: { ip }
}) {
  const protocol = `HTTP${httpVersion}`;
  headers = JSON.stringify(headers);
  const message = [ protocol, method, url, ip, headers ].join(' ');
  log.log(message);
};


module.exports = {
  httpLogger,
};
