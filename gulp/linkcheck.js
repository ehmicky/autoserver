'use strict';

const { exec } = require('child_process');

// Checks for dead links in Markdown files
// eslint-disable-next-line promise/prefer-await-to-callbacks
const checkLinksTask = function (cb) {
  exec('./gulp/linkcheck.sh', checkLinks.bind(null, cb));
};

// eslint-disable-next-line max-params
const checkLinks = function (cb, error, out, err) {
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  if (error == null) { return cb(); }

  const message = `${out}${err}`;
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  cb(message);
};

module.exports = {
  checkLinksTask,
};
