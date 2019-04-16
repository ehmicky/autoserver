import { validateSameType, parseAsIs } from './common.js'

// `{ attribute: { _lt: value } }`
const evalLt = function({ attr, value }) {
  return attr < value
}

// `{ attribute: { _gt: value } }`
const evalGt = function({ attr, value }) {
  return attr > value
}

// `{ attribute: { _lte: value } }`
const evalLte = function({ attr, value }) {
  return attr <= value
}

// `{ attribute: { _gte: value } }`
const evalGte = function({ attr, value }) {
  return attr >= value
}

// eslint-disable-next-line no-underscore-dangle
export const _lt = { parse: parseAsIs, validate: validateSameType, eval: evalLt }
// eslint-disable-next-line no-underscore-dangle
export const _gt = { parse: parseAsIs, validate: validateSameType, eval: evalGt }
// eslint-disable-next-line no-underscore-dangle
export const _lte = { parse: parseAsIs, validate: validateSameType, eval: evalLte }
// eslint-disable-next-line no-underscore-dangle
export const _gte = { parse: parseAsIs, validate: validateSameType, eval: evalGte }
