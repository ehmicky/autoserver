'use strict';

const { getOptions } = require('../options');

const getRuntimeOpts = async function ({ runtimeOpts }) {
  const [{ options }, perf] = await getOptions({
    command: 'run',
    options: runtimeOpts,
  });
  return [{ runtimeOpts: options }, perf];
};

module.exports = {
  getRuntimeOpts,
};
