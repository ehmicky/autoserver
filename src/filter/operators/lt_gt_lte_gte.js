import { validateSameType, parseAsIs } from './common.js'

// `{ attribute: { _lt: value } }`
const evalLt = ({ attr, value }) => attr < value

// `{ attribute: { _gt: value } }`
const evalGt = ({ attr, value }) => attr > value

// `{ attribute: { _lte: value } }`
const evalLte = ({ attr, value }) => attr <= value

// `{ attribute: { _gte: value } }`
const evalGte = ({ attr, value }) => attr >= value

export const lt = {
  parse: parseAsIs,
  validate: validateSameType,
  eval: evalLt,
}
export const gt = {
  parse: parseAsIs,
  validate: validateSameType,
  eval: evalGt,
}
export const lte = {
  parse: parseAsIs,
  validate: validateSameType,
  eval: evalLte,
}
export const gte = {
  parse: parseAsIs,
  validate: validateSameType,
  eval: evalGte,
}
