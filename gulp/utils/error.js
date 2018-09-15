'use strict'

const PluginError = require('plugin-error')

// Emit a Gulp plugin error
const emitError = function({ PLUGIN_NAME, stream, error }) {
  const errorA = new PluginError(PLUGIN_NAME, error, { showProperties: false })
  stream.emit('error', errorA)
}

// When the Gulp plugin does not support Vinyl.contents being a stream
const validateNotStream = function({ PLUGIN_NAME, file, stream }) {
  if (!file.isStream()) {
    return
  }

  const error = 'Streams are not supported'
  emitError({ PLUGIN_NAME, stream, error })
}

module.exports = {
  emitError,
  validateNotStream,
}
