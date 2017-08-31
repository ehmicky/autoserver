'use strict';

module.exports = {
  ...require('./default_validate'),
  ...require('./required_id'),
  ...require('./default_type'),
  ...require('./attr_type'),
  ...require('./nested_model'),
  ...require('./type_validation'),
};
