'use strict';

module.exports = {
  ...require('./collname'),
  ...require('./required_id'),
  ...require('./type'),
  ...require('./type_validation'),
  ...require('./nested_coll'),
  ...require('./alias'),
  ...require('./description'),
  ...require('./authorize'),
};
