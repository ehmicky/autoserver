'use strict';

const { normalizeIdl } = require('../normalize');

const normalize = async function ({ rIdl }) {
  const cIdl = await normalizeIdl({ idl: rIdl });
  return { cIdl };
};

module.exports = {
  normalize,
};
