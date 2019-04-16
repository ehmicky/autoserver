import { getSumParams } from '../../../utils/sums.js'

// Add `response`-related parameters
export const getResponseParams = function({ type, content }) {
  // `responsedatasize` and `responsedatacount` parameters
  const sumParams = getSumParams({ attrName: 'responsedata', value: content })

  return {
    response: content,
    responsetype: type,
    responsedata: content,
    ...sumParams,
  }
}
