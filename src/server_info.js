'use strict';

const {
  hostname: getHostname,
  type: getOs,
  platform: getPlatform,
  release: getRelease,
  arch: getArch,
  totalmem: getMemory,
  cpus: getCpus,
  networkInterfaces: getNetworkInterfaces,
} = require('os');

// eslint-disable-next-line import/no-internal-modules
const uuidv5 = require('uuid/v5');

const { version: apiengineVersion } = require('../package.json');

const { memoize, flatten } = require('./utilities');

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
  const id = getHostId();
  const name = getHostname();
  const os = getOs();
  const platform = getPlatform();
  const release = getRelease();
  const arch = getArch();
  const memory = getMemory();
  const cpus = getCpus().length;

  return { id, name, os, platform, release, arch, memory, cpus };
};

// Unique id for a given host machine.
// We use UUIDv5 with the MAC address.
const getHostId = function () {
  const macAddress = getMacAddress();
  const hostId = uuidv5(macAddress, uuidv5.DNS);
  return hostId;
};

const getMacAddress = function () {
  const ifaces = Object.values(getNetworkInterfaces());
  const ifacesA = flatten(ifaces);
  const iface = ifacesA.find(({ internal, mac }) => !internal && mac);

  if (iface === undefined) {
    return DEFAULT_MAC_ADDRESS;
  }

  return iface.mac;
};

const DEFAULT_MAC_ADDRESS = '00:00:00:00:00:00';

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
