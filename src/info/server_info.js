'use strict';


const {
  hostname: getHostname,
  type: getOsType,
  platform: getPlatform,
  release: getRelease,
  arch: getArch,
  totalmem: getMemory,
  cpus: getCpus,
} = require('os');
const { merge } = require('lodash');
const uuidv4 = require('uuid/v4');

const { memoize } = require('../utilities');
const { version: apiEngineVersion } = require('../../package.json');


// Retrieve process-specific and host-specific information
const getServerInfo = function () {
  const staticServerInfo = getStaticServerInfo();
  const dynamicServerInfo = getDynamicServerInfo();
  return merge({}, staticServerInfo, dynamicServerInfo);
};

// Information that do not change across a specific process.
// We need to memoize both for performnace and predictability,
// e.g. to assign a single `serverId` per process.
const getStaticServerInfo = memoize(function () {
  const hostname = getHostname();
  const osType = getOsType();
  const platform = getPlatform();
  const release = getRelease();
  const arch = getArch();
  const system = { hostname, osType, platform, release, arch };

  const memory = getMemory();
  const cpus = getCpus().length;
  const stats = { memory, cpus };

  const nodeVersion = process.version;
  const node = { version: nodeVersion };

  const apiEngine = { version: apiEngineVersion };

  const serverId = uuidv4();
  const serverName = process.env.API_ENGINE_SERVER_NAME || hostname || '';

  const staticServerInfo = {
    system,
    stats,
    node,
    apiEngine,
    serverId,
    serverName,
  };
  return staticServerInfo;
});

// Information that change across a specific process.
const getDynamicServerInfo = function () {
  const uptime = process.uptime();

  const dynamicServerInfo = { stats: { uptime } };
  return dynamicServerInfo;
};



module.exports = {
  getServerInfo,
};
