import { PROTOCOL_OPTS } from '../../protocols/info.js'

import { validateAdaptersOpts } from './adapter_opts.js'

// Validates `protocols.PROTOCOL.*`
const validateProtocols = function({ config: { protocols } }) {
  validateAdaptersOpts({
    opts: protocols,
    adaptersOpts: PROTOCOL_OPTS,
    key: 'protocols',
  })
}

module.exports = {
  validateProtocols,
}
