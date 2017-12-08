'use strict';

const { throwError } = require('../../error');
const { getLimits } = require('../../limits');

const { validateProtocolString } = require('./validate_parsing');

// Fill in `mInput.origin`
const parseOrigin = function ({
  protocolAdapter: { getOrigin, getUrl },
  specific,
  schema,
}) {
  const origin = getOrigin({ specific });
  validateProtocolString({ origin });

  const url = getUrl({ specific });
  validateUrlLength({ url, schema });

  return { origin };
};

const validateUrlLength = function ({ url, schema }) {
  const { maxUrlLength } = getLimits({ schema });
  if (url.length <= maxUrlLength) { return; }

  const message = `URL length must be less than ${maxUrlLength} characters`;
  throwError(message, { reason: 'URL_LIMIT' });
};

module.exports = {
  parseOrigin,
};
