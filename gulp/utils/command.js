'use strict';

const { spawn } = require('child_process');

const PluginError = require('plugin-error');

// Execute a shell command
const execCommand = function (command, args = []) {
  const child = spawn(command, args, { stdio: 'inherit' });

  // eslint-disable-next-line promise/avoid-new
  return new Promise(execCommandPromise.bind(null, child));
};

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
