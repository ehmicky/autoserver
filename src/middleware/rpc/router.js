'use strict'

const { getRpcByPath } = require('../../rpc/router/main.js')

// Add route and URL parameters to mInput
const router = function({ path }) {
  const {
    rpcAdapter,
    rpcAdapter: { name: rpc },
    pathvars,
  } = getRpcByPath({ path })
  return { rpc, rpcAdapter, pathvars }
}

module.exports = {
  router,
}
