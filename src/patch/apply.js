'use strict';

// Apply patch operation to a single datum
const applyPatchOp = function ({ datum, patchOp }) {
  return { ...datum, ...patchOp };
};

module.exports = {
  applyPatchOp,
};
