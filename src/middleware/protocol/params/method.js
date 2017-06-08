'use strict';


const parsing = require('../../../parsing');


// Retrieves protocol method and goal
const getMethod = function ({ specific, protocol }) {
  const protocolMethod = parsing[protocol].method.getProtocolMethod({
    specific,
  });
  const goal = parsing[protocol].method.getGoal({ specific });

  return { protocolMethod, goal };
};


module.exports = {
  getMethod,
};
