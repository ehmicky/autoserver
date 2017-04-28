'use strict';


module.exports = Object.assign(
  {},
  require('./compile'),
  require('./process'),
  require('./test'),
  require('./variables'),
  require('./parameters')
);
