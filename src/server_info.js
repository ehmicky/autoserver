'use strict';

const {
  hostname: getHostname,
  type: getOs,
  platform: getPlatform,
  release: getRelease,
  arch: getArch,
  totalmem: getMemory,
  cpus: getCpus,
} = require('os');

const { v4: uuidv4 } = require('uuid');

const { version: apiengineVersion } = require('../package.json');

const { memoize } = require('./utilities');

// Retrieve process-specific and host-specific information
const getServerinfo = function ({ runOpts: { servername } }) {
  const staticServerinfo = mGetStaticServerinfo({ servername });
  const dynamicServerinfo = getDynamicServerinfo();
  const serverinfo = {
    ...staticServerinfo,
    ...dynamicServerinfo,
    stats: { ...staticServerinfo.stats, ...dynamicServerinfo.stats },
  };
  return { serverinfo };
};

// Information that do not change across a specific process.
// We need to memoize both for performnace and predictability,
// e.g. to assign a single `serverid` per process.
const getStaticServerinfo = function ({ servername }) {
  const system = getSystemInfo();
  const stats = getStatsInfo();
  const node = getNodeInfo();
  const apiengine = { version: apiengineVersion };
  const serverid = uuidv4();
  const name = servername || system.hostname || '';

  return {
    system,
    stats,
    node,
    apiengine,
    serverid,
    servername: name,
  };
};

const mGetStaticServerinfo = memoize(getStaticServerinfo);

const getSystemInfo = function () {
  const hostname = getHostname();
  const os = getOs();
  const platform = getPlatform();
  const release = getRelease();
  const arch = getArch();
  return { hostname, os, platform, release, arch };
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
const getDynamicServerinfo = function () {
  const uptime = process.uptime();

  const dynamicServerinfo = { stats: { uptime } };
  return dynamicServerinfo;
};

module.exports = {
  getServerinfo,
};
