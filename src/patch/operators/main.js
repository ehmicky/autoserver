import { pop, push, remove, shift, sort, unshift } from './array.js'
import { invert } from './boolean.js'
import { set } from './generic.js'
import { add, div, mul, sub } from './number.js'
import { insert, insertstr, slice, slicestr } from './slice.js'
import { replace } from './string.js'

// All patch operators
export const OPERATORS = {
  _set: set,
  _add: add,
  _sub: sub,
  _div: div,
  _mul: mul,
  _invert: invert,
  _replace: replace,
  _push: push,
  _unshift: unshift,
  _pop: pop,
  _shift: shift,
  _remove: remove,
  _sort: sort,
  _slicestr: slicestr,
  _slice: slice,
  _insert: insert,
  _insertstr: insertstr,
}
