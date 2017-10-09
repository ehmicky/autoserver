'use strict';

const { normalizeSchema } = require('../normalize');

const normalize = async function ({ rSchema }) {
  const cSchema = await normalizeSchema({ schema: rSchema });
  return { cSchema };
};

module.exports = {
  normalize,
};
