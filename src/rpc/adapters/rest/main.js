'use strict'

const { parse } = require('./parse')

const rest = {
  name: 'rest',
  title: 'REST',
  routes: ['/rest/:clientCollname/:id?'],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  parse,
}

module.exports = {
  rest,
}
