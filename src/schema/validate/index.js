'use strict';

module.exports = {
  ...require('./database'),
  ...require('./circular_refs'),
  ...require('./json_schema_data'),
  ...require('./collname'),
  ...require('./syntax'),
  ...require('./json_schema'),
};
