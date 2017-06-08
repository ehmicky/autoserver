'use strict';


const parsing = require('../../../parsing');


// Retrieves protocol method and goal
const getMethod = function ({ specific, protocol }) {
  const method = parsing[protocol].method.getMethod({ specific });
  const goal = parsing[protocol].method.getGoal({ specific });

  return { method, goal };
};


module.exports = {
  getMethod,
};
