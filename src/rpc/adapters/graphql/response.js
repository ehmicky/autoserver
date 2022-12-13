import { excludeKeys } from 'filter-obj'

// Apply GraphQL-specific error response transformation
export const transformSuccess = ({
  response: {
    content: { metadata, ...content },
  },
}) => ({ ...content, extensions: metadata })

// Apply GraphQL-specific error response transformation
export const transformError = ({
  response: {
    content: { error, metadata },
  },
}) => {
  const errors = getError(error)

  // According to GraphQL spec, `data` should be `null` if `errors` is set
  // eslint-disable-next-line unicorn/no-null
  return { data: null, errors, extensions: metadata }
}

// GraphQL spec error format
const getError = ({ type, title, description, ...extraContent }) => {
  // Content following GraphQL spec
  // Custom information not following GraphQL spec is always rendered
  const error = { type, title, message: description, ...extraContent }

  const errorA = excludeKeys(error, isUndefined)
  return [errorA]
}

const isUndefined = (key, value) => value === undefined
