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
    host: { ...staticServerinfo.host, ...dynamicServerinfo.host },
  };
  return { serverinfo };
};

// Information that do not change across a specific process.
// We need to memoize both for performnace and predictability,
// e.g. to assign a single `serverid` per process.
const getStaticServerinfo = function ({ servername }) {
  const host = getHostInfo();
  const versions = getVersionsInfo();
  const serverid = uuidv4();
  const name = servername || host.name || '';

  return { host, versions, serverid, servername: name };
};

const mGetStaticServerinfo = memoize(getStaticServerinfo);

const getHostInfo = function () {
  const name = getHostname();
  const os = getOs();
  const platform = getPlatform();
  const release = getRelease();
  const arch = getArch();
  const memory = getMemory();
  const cpus = getCpus().length;

  return { name, os, platform, release, arch, memory, cpus };
};

const getVersionsInfo = function () {
  const node = process.version;
  const apiengine = `v${apiengineVersion}`;

  return { node, apiengine };
};

// Information that change across a specific process.
const getDynamicServerinfo = function () {
  const uptime = process.uptime();

  const dynamicServerinfo = { host: { uptime } };
  return dynamicServerinfo;
};

module.exports = {
  getServerinfo,
};
