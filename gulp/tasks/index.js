'use strict'

module.exports = {
  ...require('./main'),
  ...require('./build'),
  ...require('./check'),
  ...require('./unit'),
  ...require('./coverage'),
  ...require('./test'),
}
