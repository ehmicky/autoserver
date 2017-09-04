'use strict';

const assemble = function ({ actions }) {
  return actions.map(({ data, actionPath }) => {
    let obj = {};
    let memo = obj;
    actionPath.forEach((path, index) => {
      if (index === actionPath.length - 1) {
        memo[path] = data;
        return;
      }

      memo[path] = {};
      memo = memo[path];
    });
    return { data: obj, actionPath };
  });
};

module.exports = {
  assemble,
};
