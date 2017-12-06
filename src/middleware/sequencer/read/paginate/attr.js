'use strict';

// Retrieve list of nested attributes as `{ attrName, weight }`
// `weight` is the number of models spawn by each instance of this child action
const getNestedAttrs = function ({ childActions }) {
  const topChildActions = childActions
    .filter(({ parentAction: { commandpath } }) => commandpath.length === 1);
  const nestedAttrs = topChildActions.map(getNestedAttr);
  return nestedAttrs;
};

const getNestedAttr = function ({
  parentAction: { commandpath: [attrName] },
  childActions,
}) {
  const weight = getWeight({ childActions });
  return { attrName, weight };
};

const getWeight = function ({ childActions }) {
  const childWeights = childActions
    .map(childAction => getWeight({ childActions: childAction.childActions }))
    .reduce((sum, weightA) => sum + weightA, 0);
  return childWeights + 1;
};

module.exports = {
  getNestedAttrs,
};
