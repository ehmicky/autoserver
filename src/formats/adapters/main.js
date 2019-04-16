import { json } from './json.js'
import { yaml } from './yaml.js'
import { urlencoded } from './urlencoded.js'
import { javascript } from './javascript.js'
import { hjson } from './hjson.js'
import { json5 } from './json5.js'
import { ini } from './ini.js'
import { raw } from './raw.js'

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
