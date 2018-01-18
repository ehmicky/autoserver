'use strict';

const NO_CONTENT_LENGTH = {
  status: 'CLIENT_ERROR',
  title: 'The request payload\'s length must be specified',
};

module.exports = {
  NO_CONTENT_LENGTH,
};
