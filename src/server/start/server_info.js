'use strict';

const { makeImmutable } = require('../../utilities');
const { getServerInfo } = require('../../info');

const addServerInfo = function ({ apiServer, serverOpts }) {
  const {
    serverId,
    serverName,
    apiEngine: { version },
  } = getServerInfo({ serverOpts });
  const info = { id: serverId, name: serverName, version };

  makeImmutable(info);
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(apiServer, { info });

  return { apiServer };
};

module.exports = {
  addServerInfo,
};
