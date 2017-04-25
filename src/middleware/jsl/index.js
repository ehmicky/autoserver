'use strict';


module.exports = Object.assign(
  {},
  require('./handler'),
  require('./process'),
  require('./eval'),
  require('./variables'),
  require('./test')
);
