'use strict'

const { getProps } = require('../../errors/props.js')

// Retrieve response's status
// TODO: why is this called twice???
const getStatus = function({ error }) {
  const { status = 'SERVER_ERROR' } = getProps(error)
  const level = STATUS_LEVEL_MAP[status]
  return { status, level }
}

const STATUS_LEVEL_MAP = {
  INTERNALS: 'debug',
  SUCCESS: 'log',
  CLIENT_ERROR: 'warn',
  SERVER_ERROR: 'error',
}

module.exports = {
  getStatus,
}
