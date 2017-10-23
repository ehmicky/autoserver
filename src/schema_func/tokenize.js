'use strict';

// Break down '  \\( inlineFunc )  '
// into tokens: '  ', '\', '(', ' inlineFunc ', ')', '  '
const tokenizeInlineFunc = function ({ inlineFunc }) {
  return INLINE_FUNC_REGEXP.exec(inlineFunc);
};

const INLINE_FUNC_REGEXP = /^(\s*)(\\?)(\()(.*)(\))(\s*)$/;
const INLINE_FUNC_INDEX = 4;

// Remove outer parenthesis from inline function
const getInlineFunc = function ({ inlineFunc }) {
  const parts = tokenizeInlineFunc({ inlineFunc });
  return (parts && parts[INLINE_FUNC_INDEX]) || '';
};

module.exports = {
  tokenizeInlineFunc,
  getInlineFunc,
};
