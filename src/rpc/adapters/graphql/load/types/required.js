import { GraphQLNonNull } from 'graphql'

// Returns whether a field is required
export const graphqlRequiredTest = (def, opts) =>
  optionalTests.every((testFunc) => !testFunc(def, opts))

// Already wrapped in Required type
const isWrapped = ({ requiredWrapped }) => requiredWrapped

// `attr.validate.required` must be true
const isNotRequiredValidated = ({ validate = {} }) => !validate.required

// `args.filter` fields are never required
const isFilterArg = (def, { inputObjectType }) => inputObjectType === 'filter'

// `patchOne|patchMany` do not require any attribute in `args.data`
const isPatchArg = ({ command }, { inputObjectType }) =>
  inputObjectType === 'data' && command === 'patch'

// `data.id` is optional in createOne|createMany
const isCreateId = ({ command }, { defName, inputObjectType }) =>
  inputObjectType === 'data' && command === 'create' && defName === 'id'

const optionalTests = [
  isWrapped,
  isNotRequiredValidated,
  isFilterArg,
  isPatchArg,
  isCreateId,
]

// Required field TGetter
export const graphqlRequiredTGetter = (def, opts) => {
  const defA = { ...def, requiredWrapped: true }
  const subType = opts.getType(defA, opts)
  const type = new GraphQLNonNull(subType)
  return type
}
