'use strict';

const { getReason } = require('../../error');

const addErrorReason = function ({ error }) {
  if (!error) { return; }

  const errorReason = getReason({ error });
  return { reqInfo: { errorReason } };
};

module.exports = {
  addErrorReason,
};
