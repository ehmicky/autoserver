'use strict';

const { v4: uuidv4 } = require('uuid');

// Assigns unique ID (UUIDv4) to each request
// Available in mInput, events, system paramers and metadata
const setRequestid = function ({ metadata }) {
  const requestid = uuidv4();

  const metadataA = { ...metadata, requestid };
  return { requestid, metadata: metadataA };
};

module.exports = {
  setRequestid,
};
