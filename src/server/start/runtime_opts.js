'use strict';

const { getOptions } = require('../../options');

const getRuntimeOpts = async function ({ runtime }) {
  const [{ options }, perf] = await getOptions({
    command: 'run',
    config: runtime,
  });
  return [{ runtimeOpts: options }, perf];
};

module.exports = {
  getRuntimeOpts,
};
