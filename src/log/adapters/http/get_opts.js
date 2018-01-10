'use strict';

const { URL } = require('url');

// Parse `opts.url`, also ensuring it is a valid URL
const getOpts = function ({ opts: { url } }) {
  if (url === undefined) { return; }

  const {
    hostname,
    port,
    auth,
    pathname = '',
    search = '',
    hash = '',
  } = new URL(url);
  const portA = port ? Number(port) : undefined;
  const path = `${pathname}${search}${hash}`;

  return { hostname, port: portA, auth, path };
};

module.exports = {
  getOpts,
};
