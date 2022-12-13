import { isObjectType } from '../utils/functional/type.js'

const REF_SYM = Symbol('ref')

// Remember original JSON reference absolute path so it can be used later,
// for example to serialize back
export const setRef = ({ content, path }) => {
  if (!isObjectType(content)) {
    return content
  }

  const contentA = { ...content, [REF_SYM]: path }
  return contentA
}

export const getRef = (content) => content[REF_SYM]
