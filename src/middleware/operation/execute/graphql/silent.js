'use strict';

// Apply `silent` settings:
//   - if true, the action will modify the database, but return an empty
//     response
//   - this can also be set for all the actions using:
//      - Prefer: return=minimal HTTP request header
const applySilent = function ({ fullResponse, top: { args: { silent } } }) {
  if (!silent) { return fullResponse; }

  return { ...fullResponse, content: { data: undefined } };
};

module.exports = {
  applySilent,
};
