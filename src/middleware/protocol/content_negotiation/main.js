'use strict';

const { omit } = require('../../../utilities');

const { getFormat } = require('./format');
const { getCharset } = require('./charset');
const { getCompress } = require('./compress');

// Retrieve format|charset|compress of the response payloads, and
// charset of the request payload
const handleContentNegotiation = function ({
  queryvars,
  format,
  charset,
  compress,
}) {
  const formatA = getFormat({ queryvars, format });
  const charsetA = getCharset({ queryvars, charset, format: formatA });
  const compressA = getCompress({ queryvars, compress });

  const queryvarsA = omit(queryvars, ['format', 'charset', 'compress']);

  return {
    queryvars: queryvarsA,
    format: formatA,
    charset: charsetA,
    compress: compressA,
  };
};

module.exports = {
  handleContentNegotiation,
};
