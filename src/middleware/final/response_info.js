'use strict';

const addResponseInfo = function ({ error, response: { content, type } = {} }) {
  if (error) { return; }

  return { reqInfo: { response: content, responseType: type } };
};

module.exports = {
  addResponseInfo,
};
