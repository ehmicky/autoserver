import { validateString } from './validate.js'

export const parsePath = ({
  protocolAdapter,
  protocolAdapter: { getPath },
  specific,
}) => {
  if (getPath === undefined) {
    return
  }

  const path = getPath({ specific })

  validateString(path, 'path', protocolAdapter)

  return { path }
}
