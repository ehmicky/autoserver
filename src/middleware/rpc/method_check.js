'use strict';

// Check if protocol method is allowed for current rpc
const methodCheck = function ({ rpcAdapter: { checkMethod }, method }) {
  checkMethod({ method });
};

module.exports = {
  methodCheck,
};
