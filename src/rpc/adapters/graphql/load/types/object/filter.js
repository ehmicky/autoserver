export const filterField = (def, opts) => {
  const isFiltered = filters.some((filter) => filter(def, opts))
  // eslint-disable-next-line unicorn/no-null
  return isFiltered ? null : def
}

// `patch` does not allow `data.id`
const patchIdData = ({ command }, { inputObjectType, defName }) =>
  inputObjectType === 'data' && command === 'patch' && defName === 'id'

const filters = [patchIdData]
