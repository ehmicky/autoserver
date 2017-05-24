'use strict';


// Merge the modifiers from a single action to the general request's modifier
const mergeModifiers = function () {
  return async function noOutputSet(input) {
    const { modifiers: allModifiers } = input;

    const { content, modifiers } = await this.next(input);

    defaultMods({ allModifiers });
    mergeMods({ allModifiers, modifiers });

    return content;
  };
};

// Adds default values to modifiers
const defaultMods = function ({ allModifiers }) {
  if (!allModifiers.noOutput) {
    allModifiers.noOutput = new Set();
  }
};

const mergeMods = function ({ allModifiers, modifiers }) {
  if (modifiers.noOutput) {
    allModifiers.noOutput.add(modifiers.noOutput);
  }
};


module.exports = {
  mergeModifiers,
};
