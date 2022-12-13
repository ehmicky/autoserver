import { validateString } from './validate.js'

export const parseIp = ({
  protocolAdapter,
  protocolAdapter: { getIp },
  specific,
}) => {
  const ip = getIp({ specific })

  validateString(ip, 'ip', protocolAdapter)

  return { ip }
}
