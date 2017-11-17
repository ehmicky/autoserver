'use strict';

const { throwError } = require('../../error');
const { getLimits } = require('../../limits');

// Fill in `mInput.origin`
const parseOrigin = function ({
  protocolHandler: { getOrigin, getUrl },
  specific,
}) {
  const origin = getOrigin({ specific });
  validateOrigin({ origin });

  const url = getUrl({ specific });
  validateUrlLength({ url });

  return { origin };
};

const validateOrigin = function ({ origin }) {
  if (typeof origin === 'string') { return; }

  const message = `'origin' must be a string, not '${origin}'`;
  throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
};

const validateUrlLength = function ({ url, runOpts }) {
  const { maxUrlLength } = getLimits({ runOpts });
  if (url.length <= maxUrlLength) { return; }

  const message = `URL length must be less than ${maxUrlLength} characters`;
  throwError(message, { reason: 'URL_LIMIT' });
};

module.exports = {
  parseOrigin,
};
