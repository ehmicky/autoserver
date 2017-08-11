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

const { v4: uuidv4 } = require('uuid');

const { memoize } = require('../utilities');
const { version: apiEngineVersion } = require('../../package.json');

// Retrieve process-specific and host-specific information
const getServerInfo = function ({ runtimeOpts: { serverName } }) {
  const staticServerInfo = mGetStaticServerInfo({ serverName });
  const dynamicServerInfo = getDynamicServerInfo();
  return {
    ...staticServerInfo,
    ...dynamicServerInfo,
    stats: { ...staticServerInfo.stats, ...dynamicServerInfo.stats },
  };
};

// Information that do not change across a specific process.
// We need to memoize both for performnace and predictability,
// e.g. to assign a single `serverId` per process.
const getStaticServerInfo = function ({ serverName }) {
  const system = getSystemInfo();
  const stats = getStatsInfo();
  const node = getNodeInfo();
  const apiEngine = { version: apiEngineVersion };
  const serverId = uuidv4();
  const name = serverName || system.hostname || '';

  return {
    system,
    stats,
    node,
    apiEngine,
    serverId,
    serverName: name,
  };
};

const mGetStaticServerInfo = memoize(getStaticServerInfo);

const getSystemInfo = function () {
  const hostname = getHostname();
  const osType = getOsType();
  const platform = getPlatform();
  const release = getRelease();
  const arch = getArch();
  return { hostname, osType, platform, release, arch };
};

const getStatsInfo = function () {
  const memory = getMemory();
  const cpus = getCpus().length;
  return { memory, cpus };
};

const getNodeInfo = function () {
  const nodeVersion = process.version;
  return { version: nodeVersion };
};

// Information that change across a specific process.
const getDynamicServerInfo = function () {
  const uptime = process.uptime();

  const dynamicServerInfo = { stats: { uptime } };
  return dynamicServerInfo;
};

module.exports = {
  getServerInfo,
};
