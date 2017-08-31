'use strict';

const { pStat } = require('./promisify');
const { memoize } = require('./functional');

// `mStat() is like `fs.stat()` but: using promises, returning false if there
// is an error (e.g. file does not exit, or wrong permissions), and memoized.
const eStat = async function (path) {
  try {
    return await pStat(path);
  } catch (error) {
    return false;
  }
};

const mStat = memoize(eStat);

module.exports = {
  mStat,
};
