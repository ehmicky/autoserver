'use strict';


// Like JSON.stringify(), but handles infinite recursion
const stringify = function (val, indent) {
  const cache = [];
  return JSON.stringify(val, (_, value) => {
    if (typeof value === 'object' && value !== null) {
      // Circular reference found, discard key
      if (cache.includes(value)) { return; }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }, indent);
};


module.exports = {
  stringify,
};
