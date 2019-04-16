import { validateString } from './validate.js'

export const parseIp = function({
  protocolAdapter,
  protocolAdapter: { getIp },
  specific,
}) {
  const ip = getIp({ specific })

  validateString(ip, 'ip', protocolAdapter)

  return { ip }
}
