// Break down '  \\( inlineFunc )  '
// into tokens: '  ', '\', '(', ' inlineFunc ', ')', '  '
export const tokenizeInlineFunc = (inlineFunc) =>
  INLINE_FUNC_REGEXP.exec(inlineFunc)

const INLINE_FUNC_REGEXP = /^(\s*)(?<escape>\\?)(\()(?<body>.*)(\))(\s*)$/su

// Remove outer parenthesis from inline function
export const getInlineFunc = (inlineFunc) => {
  const parts = tokenizeInlineFunc(inlineFunc)
  return parts.groups.body
}

// Retrieves inline config function body
export const stringifyConfigFunc = ({ configFunc, configFunc: { name } }) => {
  if (name && name !== 'anonymous') {
    return `${name}()`
  }

  const funcStr = configFunc.toString()
  const parts = BODY_REGEXP.exec(funcStr)

  if (parts === null) {
    return funcStr
  }

  return parts[1]
}

// Extracts inline function. Only works on inline functions.
const BODY_REGEXP = /^function anonymous\(\{.*return \((.*)\)/su
