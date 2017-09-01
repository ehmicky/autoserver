'use strict';

const assemble = function ({ actions }) {
  return actions.map(({ data, actionPath }) => {
    const paths = actionPath.split('.');
    let obj = {};
    let memo = obj;
    paths.forEach((path, index) => {
      if (index === paths.length - 1) {
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
