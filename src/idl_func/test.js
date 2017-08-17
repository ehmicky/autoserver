'use strict';

const { tokenizeInlineFunc } = require('./tokenize');

// Test whether a value is inline function
const isInlineFunc = ({ inlineFunc }) => testInlineFunc({ inlineFunc }) === 'InlineFunc';

// Test whether a value is almost inline function,
// except opening parenthesis is escaped
const isEscapedInlineFunc = ({ inlineFunc }) => testInlineFunc({ inlineFunc }) === 'Escaped';

const testInlineFunc = ({ inlineFunc }) => {
  if (typeof inlineFunc !== 'string') { return 'NotAString'; }

  const parsedInlineFunc = tokenizeInlineFunc({ inlineFunc });
  if (!parsedInlineFunc) { return 'NoParenthesis'; }

  const isEscaped = parsedInlineFunc[2] === '\\';
  if (isEscaped) { return 'Escaped'; }

  return 'InlineFunc';
};

module.exports = {
  isInlineFunc,
  isEscapedInlineFunc,
};
