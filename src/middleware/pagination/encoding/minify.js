'use strict';


const { minifyOrderBy, unminifyOrderBy } = require('./minify_order_by');
const { removeDefaultValues, addDefaultValues } = require('./minify_default_values');
const { addNameShortcuts, removeNameShortcuts } = require('./minify_names');


// Make sure token is small by minifying it
const minifyToken = function ({ token }) {
  removeDefaultValues({ token });
  minifyOrderBy({ token });
  addNameShortcuts({ token });
  return token;
};

const unminifyToken = function ({ token }) {
  removeNameShortcuts({ token });
  unminifyOrderBy({ token });
  addDefaultValues({ token });
  return token;
};


module.exports = {
  minifyToken,
  unminifyToken,
};
