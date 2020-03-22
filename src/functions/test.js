import { tokenizeInlineFunc } from './tokenize.js'

// Test whether a value is inline function
export const isInlineFunc = (inlineFunc) =>
  testInlineFunc(inlineFunc) === 'InlineFunc'

// Test whether a value is almost inline function,
// except opening parenthesis is escaped
export const isEscapedInlineFunc = (inlineFunc) =>
  testInlineFunc(inlineFunc) === 'Escaped'

const testInlineFunc = (inlineFunc) => {
  if (typeof inlineFunc !== 'string') {
    return 'NotAString'
  }

  const parsedInlineFunc = tokenizeInlineFunc(inlineFunc)

  if (parsedInlineFunc === null) {
    return 'NoParenthesis'
  }

  if (parsedInlineFunc.groups.escape !== '') {
    return 'Escaped'
  }

  return 'InlineFunc'
}
