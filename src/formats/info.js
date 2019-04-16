import { FORMAT_ADAPTERS } from './adapters/main.js'
import { getExtension } from './extensions.js'

// All possible extensions, for documentation
const getExtensions = function() {
  return FORMAT_ADAPTERS.map(formatAdapter =>
    getExtension(formatAdapter),
  ).filter(extension => extension !== undefined)
}

const EXTENSIONS = getExtensions()

module.exports = {
  EXTENSIONS,
}
