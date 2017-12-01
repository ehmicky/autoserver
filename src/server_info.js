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
const getServerinfo = function ({ schema: { name: processName } = {} }) {
  const staticServerinfo = mGetStaticServerinfo({ processName });
  const dynamicServerinfo = getDynamicServerinfo();
  const serverinfo = {
    ...staticServerinfo,
    ...dynamicServerinfo,
    host: { ...staticServerinfo.host, ...dynamicServerinfo.host },
  };
  return { serverinfo };
};

// Information that do not change across a specific process.
// We need to memoize both for performnace and predictability.
const getStaticServerinfo = function ({ processName }) {
  const host = getHostInfo();
  const versions = getVersionsInfo();
  const processInfo = getProcessInfo({ host, processName });

  return { host, versions, process: processInfo };
};

const mGetStaticServerinfo = memoize(getStaticServerinfo);

const getHostInfo = function () {
  const id = uuidv4();
  const name = getHostname();
  const os = getOs();
  const platform = getPlatform();
  const release = getRelease();
  const arch = getArch();
  const memory = getMemory();
  const cpus = getCpus().length;

  return { id, name, os, platform, release, arch, memory, cpus };
};

const getVersionsInfo = function () {
  const node = process.version;
  const apiengine = `v${apiengineVersion}`;

  return { node, apiengine };
};

const getProcessInfo = function ({ host, processName }) {
  const name = processName || host.name;
  return { name };
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
