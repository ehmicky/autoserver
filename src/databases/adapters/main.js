import { memory } from './memory/main.js'
import { mongodb } from './mongodb/main.js'

const DATABASE_ADAPTERS = [memory, mongodb]

module.exports = {
  DATABASE_ADAPTERS,
}
