'use strict';

// Keep track of innererror
const getInnerError = function ({ opts, stack: upperStack }) {
  const { shallowInnerError, deepInnerError, innererror } = getInnerErrors({
    opts,
  });
  if (!innererror) { return; }

  const innererrorStack = getInnerErrorStack({ innererror, upperStack });
  // Innermost innererror stack is kept, but outermost innererror message and
  // reason are kept as well.
  const shallowInnerErrorMessage = deepInnerError
    ? `${shallowInnerError.reason} - ${shallowInnerError.message}\n`
    : '';
  // eslint-disable-next-line fp/no-mutation
  innererror.stack = `${shallowInnerErrorMessage}${innererrorStack}`;

  return innererror;
};

const getInnerErrors = function ({ opts }) {
  const shallowInnerError = opts.innererror;
  const deepInnerError = shallowInnerError && shallowInnerError.innererror;

  // Keep innermost innererror stack
  const innererror = deepInnerError || shallowInnerError;

  return { shallowInnerError, deepInnerError, innererror };
};

const getInnerErrorStack = function ({
  innererror: { message, stack = '' },
  upperStack,
}) {
  // Node core errors include a `stack` property, but it actually does not
  // have any stack, and just repeats the `message`. We don't want this.
  if (!(/\n/).test(stack)) { return `${stack}\n${upperStack}`; }

  // We only keep innererror's stack, so if it does not include the
  // error message, which might be valuable information, prepends it
  if (message && stack.indexOf(message) === -1) {
    return `${message}\n${stack}`;
  }

  return stack;
};

module.exports = {
  getInnerError,
};
