import { getWordsList } from '../../utils/string.js'

const getMessage = ({ value, suggestions }) => {
  const protocols = getWordsList(suggestions, { op: 'or' })
  return `Protocol ${value} is invalid: it should be ${protocols}`
}

// Extra:
//  - value STR
//  - suggestions STR_ARR
export const METHOD = {
  status: 'CLIENT_ERROR',
  title: 'The protocol method is invalid',
  getMessage,
}
