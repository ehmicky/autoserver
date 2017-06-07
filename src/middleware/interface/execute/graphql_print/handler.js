'use strict';


const { getSchema } = require('../graphql_schema');
const { printSchema } = require('./print');


const printGraphql = async function (opts) {
  const perf = opts.startupLog.perf.start('graphqlprint', 'middleware');
  const schema = getSchema(opts);
  const content = await printSchema(schema);
  perf.stop();

  return function printGraphql() {
    return {
      type: 'html',
      content,
    };
  };
};


module.exports = {
  printGraphql,
};
