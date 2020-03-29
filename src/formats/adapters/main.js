import { hjson } from './hjson.js'
import { ini } from './ini.js'
import { javascript } from './javascript.js'
import { json } from './json.js'
import { json5 } from './json5.js'
import { raw } from './raw.js'
import { urlencoded } from './urlencoded.js'
import { yaml } from './yaml.js'

// Order matters, as first ones will have priority
export const FORMAT_ADAPTERS = [
  json,
  yaml,
  urlencoded,
  javascript,
  hjson,
  json5,
  ini,
  raw,
]
