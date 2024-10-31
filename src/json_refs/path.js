import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'

import { addGenErrorHandler } from '../errors/handler.js'

// Resolve JSON reference path to an absolute local file
export const getPath = ({ path, parentPath }) => {
  if (NODE_REGEXP.test(path)) {
    return eGetModulePath({ path })
  }

  // Same file
  if (path === '') {
    return parentPath
  }

  // Local file
  const parentDir = dirname(parentPath)
  return resolve(parentDir, path)
}

// Node module, e.g. $ref: 'lodash.node'
// TODO: use `import.meta.resolve()` when available
const getModulePath = ({ path }) => {
  const moduleName = path.replace(NODE_REGEXP, '')
  const { resolve: resolveModule } = createRequire(import.meta.url)
  const pathA = resolveModule(moduleName)
  return pathA
}

const NODE_REGEXP = /\.node$/u

const eGetModulePath = addGenErrorHandler(getModulePath, {
  message: ({ value }) =>
    `JSON reference '${value}' is invalid: this Node.js module does not exist`,
  reason: 'CONFIG_VALIDATION',
})
