'use strict';


/* eslint-disable no-multi-spaces */
const operations = [
  { name: 'findOne',     opType: 'find',     multiple: false,  },
  { name: 'findMany',    opType: 'find',     multiple: true,   },
  { name: 'createOne',   opType: 'create',   multiple: false,  },
  { name: 'createMany',  opType: 'create',   multiple: true,   },
  { name: 'replaceOne',  opType: 'replace',  multiple: false,  },
  { name: 'replaceMany', opType: 'replace',  multiple: true,   },
  { name: 'updateOne',   opType: 'update',   multiple: false,  },
  { name: 'updateMany',  opType: 'update',   multiple: true,   },
  { name: 'upsertOne',   opType: 'upsert',   multiple: false,  },
  { name: 'upsertMany',  opType: 'upsert',   multiple: true,   },
  { name: 'deleteOne',   opType: 'delete',   multiple: false,  },
  { name: 'deleteMany',  opType: 'delete',   multiple: true,   },
];
/* eslint-enable no-multi-spaces */


module.exports = {
  operations,
};