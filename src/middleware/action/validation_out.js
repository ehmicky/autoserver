'use strict';

const { throwError } = require('../../errors');
const { CONTENT_TYPES } = require('../../content_types');

// Action layer output validation
// Those errors should not happen, i.e. server-side (e.g. 500)
const actionValidationOut = function ({ response: { content, type } }) {
  validateType({ type });
  validateContent({ content, type });
};

const validateType = function ({ type }) {
  if (typeof type !== 'string') {
    const message = `'type' must be a string, not '${type}'`;
    throwError(message, { reason: 'ENGINE' });
  }

  const isWrongType = CONTENT_TYPES[type] === undefined;

  if (isWrongType) {
    const message = `Invalid 'type': '${type}'`;
    throwError(message, { reason: 'ENGINE' });
  }
};

const validateContent = function ({ content, type }) {
  const isRightContent = CONTENT_TYPES[type].validate(content);
  if (isRightContent) { return; }

  const message = `Invalid 'content' of type '${type}': '${content}'`;
  throwError(message, { reason: 'ENGINE' });
};

module.exports = {
  actionValidationOut,
};
