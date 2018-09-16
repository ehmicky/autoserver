'use strict'

const { run } = require('../run')

const { addErrorHandlers } = require('./error')

const instructions = { run }

const main = addErrorHandlers({ instructions })

module.exports = main
