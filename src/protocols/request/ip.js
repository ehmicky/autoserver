import { validateString } from './validate.js'

const parseIp = function({
  protocolAdapter,
  protocolAdapter: { getIp },
  specific,
}) {
  const ip = getIp({ specific })

  validateString(ip, 'ip', protocolAdapter)

  return { ip }
}

module.exports = {
  parseIp,
}
