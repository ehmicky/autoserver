'use strict';

const { getOptions } = require('../options');

const getRunOpts = async function ({ runOpts }) {
  const [{ options }, perf] = await getOptions({
    instruction: 'run',
    options: runOpts,
  });
  return [{ runOpts: options }, perf];
};

module.exports = {
  getRunOpts,
};
