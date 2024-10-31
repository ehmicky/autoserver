import {
  LATER_SYSTEM_PARAMS,
  POSITIONAL_PARAMS,
  SYSTEM_PARAMS,
  TEMP_SYSTEM_PARAMS,
} from './system.js'

// Retrieve parameters names
export const getParamsKeys = ({ config: { params = {} } }) => {
  const namedKeys = [
    ...Object.keys(SYSTEM_PARAMS),
    ...LATER_SYSTEM_PARAMS,
    ...TEMP_SYSTEM_PARAMS,
    ...Object.keys(params),
  ]
  const posKeys = POSITIONAL_PARAMS
  return { namedKeys, posKeys }
}
