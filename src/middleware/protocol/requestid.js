'use strict';

const { v4: uuidv4 } = require('uuid');

// Assigns unique ID (UUIDv4) to each request
// Available in mInput, events, schema system variable and metadata
// Also assigns servername and serverid
const setRequestids = function ({
  serverinfo: { serverid, servername },
  metadata,
}) {
  const requestid = uuidv4();

  const metadataA = { ...metadata, requestid, servername, serverid };
  return { requestid, metadata: metadataA };
};

module.exports = {
  setRequestids,
};
