import { OPERATORS } from './operators/main.js'

// Properties of errors during `patch`
// We want to differentiate between errors due to engine bug or wrong config
const getPatchErrorProps = function({ type, extra }) {
  if (OPERATORS[type] !== undefined) {
    return { reason: 'ENGINE' }
  }

  const path = `config.operators.${type}`
  return { reason: 'CONFIG_RUNTIME', extra: { ...extra, path } }
}

module.exports = {
  getPatchErrorProps,
}
