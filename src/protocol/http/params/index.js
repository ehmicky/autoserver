'use strict';


const { parse: headerParse, serialize: headerSerialize } = require('./app_headers');
const { parse: bodyParse, serialize: bodySerialize } = require('./body');
const { parse: queryParse, serialize: querySerialize } = require('./query_string.js');


module.exports = {
  appHeaders: { parse: headerParse, serialize: headerSerialize },
  body: { parse: bodyParse, serialize: bodySerialize },
  queryString: { parse: queryParse, serialize: querySerialize },
};
