import { deepMerge } from '../../../utils/functional/merge.js'
import { dereferenceRefs } from '../../../json_refs/main.js'

import { getEnvVars } from './env.js'
import { getConfPath } from './path.js'

// Load config file
export const loadFile = async function ({ configPath, config: configOpts }) {
  const { config: envConfigPath, ...envVars } = getEnvVars()

  const path = await getConfPath({ envConfigPath, configPath })

  const configFile = await dereferenceRefs({ path })

  // Priority order: environment variables > Node.js/CLI options > config file
  const config = deepMerge(configFile, configOpts, envVars)

  return config
}
