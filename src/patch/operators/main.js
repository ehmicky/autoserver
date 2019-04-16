import { _set } from './generic.js'
import { _add, _sub, _div, _mul } from './number.js'
import { _invert } from './boolean.js'
import { _replace } from './string.js'
import { _push, _unshift, _pop, _shift, _remove, _sort } from './array.js'
import { _slicestr, _slice, _insert, _insertstr } from './slice.js'

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
