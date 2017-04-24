'use strict';


/* eslint-disable no-multi-spaces */
const actions = [
  { name: 'findOne',     actionType: 'find',     multiple: false,  },
  { name: 'findMany',    actionType: 'find',     multiple: true,   },
  { name: 'createOne',   actionType: 'create',   multiple: false,  },
  { name: 'createMany',  actionType: 'create',   multiple: true,   },
  { name: 'replaceOne',  actionType: 'replace',  multiple: false,  },
  { name: 'replaceMany', actionType: 'replace',  multiple: true,   },
  { name: 'updateOne',   actionType: 'update',   multiple: false,  },
  { name: 'updateMany',  actionType: 'update',   multiple: true,   },
  { name: 'upsertOne',   actionType: 'upsert',   multiple: false,  },
  { name: 'upsertMany',  actionType: 'upsert',   multiple: true,   },
  { name: 'deleteOne',   actionType: 'delete',   multiple: false,  },
  { name: 'deleteMany',  actionType: 'delete',   multiple: true,   },
];
/* eslint-enable no-multi-spaces */


module.exports = {
  actions,
};
