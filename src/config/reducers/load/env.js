import { env } from 'node:process'

import { set } from '../../../utils/functional/get_set.js'
import { transtype } from '../../../utils/transtype.js'

// Retrieve environment variables related to this project,
// as a normalized object, ready to be used as options
// Environment variables must be prefixed with AUTOSERVER__*
// The value will be JSON transtyped
// Nested variables can be indicated with double-underscores,
// e.g. `HTTP__HOSTNAME` becomes `{ http: { hostname } }`
export const getEnvVars = () => Object.entries(env).reduce(reduceEnvVar, {})

const reduceEnvVar = (envVars, [name, value]) => {
  if (!isValidEnvVar({ name })) {
    return envVars
  }

  const nameA = getEnvVarName({ name })
  const valueA = transtype(value)

  const envVarsA = set(envVars, nameA, valueA)
  return envVarsA
}

// Exclude environment variables not meant for the autoserver
const isValidEnvVar = ({ name }) =>
  ENV_VARS_PREFIX.test(name) || BASIC_NAMES_MAP[name]

// Common prefix to all environment variables
const ENV_VARS_PREFIX = /^AUTOSERVER__/u

// Shortcuts
const BASIC_NAMES_MAP = {
  NODE_ENV: 'AUTOSERVER__ENV',
  HOST: 'AUTOSERVER__PROTOCOLS__HTTP__HOSTNAME',
  PORT: 'AUTOSERVER__PROTOCOLS__HTTP__PORT',
}

const getEnvVarName = ({ name }) => {
  const nameA = BASIC_NAMES_MAP[name] || name
  const nameB = nameA
    .replace(ENV_VARS_PREFIX, '')
    .toLowerCase()
    // Transtype object and array values using `__VAR` in variable name
    .split('__')
    // Indexes must be actual number for `set()` utility to work
    .map(transtype)
  return nameB
}
