'use strict'

const { parse } = require('./parse')

const rpc = {
  name: 'rest',
  title: 'REST',
  routes: ['/rest/:clientCollname/:id?'],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  parse,
}

module.exports = rpc
