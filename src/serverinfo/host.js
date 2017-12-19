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

const { flatten } = require('../utilities');

// Retrieve host-specific information
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
  const ifaces = getNetworkInterfaces();
  const ifacesA = Object.values(ifaces);
  const ifacesB = flatten(ifacesA);
  const { mac: macA } = ifacesB
    .find(({ internal, mac }) => !internal && mac) || {};

  if (macA === undefined) {
    return DEFAULT_MAC_ADDRESS;
  }

  return macA;
};

const DEFAULT_MAC_ADDRESS = '00:00:00:00:00:00';

module.exports = {
  getHostInfo,
};
