'use strict';


module.exports = Object.assign(
  {},
  require('./compile'),
  require('./run'),
  require('./test'),
  require('./variables'),
  require('./parameters'),
  require('./tokenize')
);
