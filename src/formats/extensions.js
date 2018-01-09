'use strict';

// Retrieve format's prefered extension
const getExtension = function ({ extensions: [extension] = [] }) {
  if (extension === undefined) { return; }

  return `.${extension}`;
};

module.exports = {
  getExtension,
};
