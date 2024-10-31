import { readdir } from 'node:fs/promises'
import { isAbsolute, resolve } from 'node:path'
import { cwd } from 'node:process'

import { addGenErrorHandler } from '../../../errors/handler.js'
import { throwError } from '../../../errors/main.js'
import { getByExt } from '../../../formats/get.js'

// Retrieves final config path to use
export const getConfPath = async ({ envConfigPath, configPath }) => {
  const path = envConfigPath || configPath

  const pathA = await getPath({ path })

  validatePath({ path: pathA })

  return pathA
}

const getPath = ({ path }) => {
  const baseDir = cwd()

  if (path === undefined) {
    return findConfPath(baseDir)
  }

  return resolvePath({ path, baseDir })
}

// Try to find autoserver.config.EXT in current directory, or any parent
const findConfPath = async (dir) => {
  const paths = await readdir(dir)
  const pathA = paths.find((path) => CONFIG_REGEXP.test(path))

  // Found a file
  if (pathA !== undefined) {
    return resolve(dir, pathA)
  }

  const parentDir = resolve(dir, '..')

  // Reached root directory
  if (parentDir === dir) {
    return
  }

  return findConfPath(parentDir)
}

const CONFIG_REGEXP = /^autoserver.config.[a-z]+$/u

// When `config` option or environment variable is used
const resolvePath = ({ path, baseDir }) => {
  validateConfig({ path })

  if (isAbsolute(path)) {
    return path
  }

  const pathA = resolve(baseDir, path)
  return pathA
}

const validateConfig = ({ path }) => {
  if (typeof path === 'string') {
    return
  }

  const message = `'config' option must be a string, not '${path}'`
  throwError(message, { reason: 'CONFIG_VALIDATION' })
}

const validatePath = ({ path }) => {
  if (path === undefined) {
    const message = 'No config file was found'
    throwError(message, { reason: 'CONFIG_VALIDATION' })
  }

  // Validates config file format
  eGetByExt({ path })
}

const eGetByExt = addGenErrorHandler(getByExt, {
  message: ({ path }) => `Config file format is not supported: '${path}'`,
  reason: 'CONFIG_VALIDATION',
})
