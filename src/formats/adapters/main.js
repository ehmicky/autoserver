'use strict'

const { json } = require('./json')
const { yaml } = require('./yaml')
const { urlencoded } = require('./urlencoded')
const { javascript } = require('./javascript')
const { hjson } = require('./hjson')
const { json5 } = require('./json5')
const { ini } = require('./ini')
const { raw } = require('./raw')

// Order matters, as first ones will have priority
const FORMAT_ADAPTERS = [
  json,
  yaml,
  urlencoded,
  javascript,
  hjson,
  json5,
  ini,
  raw,
]

module.exports = {
  FORMAT_ADAPTERS,
}
