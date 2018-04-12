'use strict';

const { env } = require('process');
const { spawn } = require('child_process');

const PluginError = require('plugin-error');

// Execute a shell command
const execCommand = function (command) {
  const [commandA, ...args] = command.trim().split(/ +/);
  const envA = getEnv();
  const child = spawn(commandA, args, { stdio: 'inherit', env: envA });

  // eslint-disable-next-line promise/avoid-new
  return new Promise(execCommandPromise.bind(null, child));
};

// Adds local Node modules binary to `$PATH`
const getEnv = function () {
  const PATH = getPath({ env });
  const envA = { ...env, PATH };
  return envA;
};

const getPath = function ({ env: { PATH = '' } }) {
  const hasLocalDir = PATH.split(':').includes(LOCAL_NODE_BIN_DIR);
  if (hasLocalDir) { return PATH; }

  return `${PATH}:${LOCAL_NODE_BIN_DIR}`;
};

const LOCAL_NODE_BIN_DIR = './node_modules/.bin/';

// Check command exit code
const execCommandPromise = function (child, resolve, reject) {
  child.on('exit', execCommandExit.bind(null, resolve, reject));
};

const execCommandExit = function (resolve, reject, exitCode) {
  if (exitCode === 0) { return resolve(); }

  const error = new PluginError('shell', 'Shell command failed');
  reject(error);
};

module.exports = {
  execCommand,
};
