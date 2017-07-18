'use strict';

// eslint-disable-next-line no-process-env
const ENV = process.env.NODE_ENV === 'dev' ? 'dev' : 'production';

module.exports = {
  ENV,
};
