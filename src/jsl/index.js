'use strict';


module.exports = Object.assign(
  {},
  require('./compile'),
  require('./run'),
  require('./test'),
  require('./parameters'),
  require('./tokenize')
);
