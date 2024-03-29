// Starts connection
export const connect = ({ config, options: { data } }) => {
  validateEnv({ config })

  return data
}

const validateEnv = ({ config: { env } }) => {
  if (env === 'dev') {
    return
  }

  throw new Error(
    "Memory database must not be used in production, i.e. 'config.env' must be equal to 'dev'",
  )
}
