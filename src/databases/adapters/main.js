const { memory } = require('./memory/main.js')
const { mongodb } = require('./mongodb/main.js')

const DATABASE_ADAPTERS = [memory, mongodb]

module.exports = {
  DATABASE_ADAPTERS,
}
