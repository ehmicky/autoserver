'use strict'

const { _set } = require('./generic')
const { _add, _sub, _div, _mul } = require('./number')
const { _invert } = require('./boolean')
const { _replace } = require('./string')
const { _push, _unshift, _pop, _shift, _remove, _sort } = require('./array')
const { _slicestr, _slice, _insert, _insertstr } = require('./slice')

// All patch operators
const OPERATORS = {
  _set,
  _add,
  _sub,
  _div,
  _mul,
  _invert,
  _replace,
  _push,
  _unshift,
  _pop,
  _shift,
  _remove,
  _sort,
  _slicestr,
  _slice,
  _insert,
  _insertstr,
}

module.exports = {
  OPERATORS,
}
