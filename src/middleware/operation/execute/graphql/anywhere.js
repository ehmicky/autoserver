/* eslint-disable */

const { assignObject, deepMerge, mapValues } = require('../../../../utilities');

const {
  DocumentNode,
  SelectionSetNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
  DirectiveNode,
  FieldNode,
  IntValueNode,
  FloatValueNode,
  StringValueNode,
  BooleanValueNode,
  ObjectValueNode,
  ListValueNode,
  EnumValueNode,
  VariableNode,
  InlineFragmentNode,
  ValueNode,
  SelectionNode,
  ExecutionResult,
  NameNode,
} = require('graphql');

const graphql = async function (
  resolver,
  document,
  mainDefinition,
  contextValue,
  variables = {},
  rootValue = {},
) {
  const fragments = document.definitions
    .filter(({ kind }) => kind === 'FragmentDefinition');

  const { actions } = require('./new_parser').parse({
    selectionSet: mainDefinition.selectionSet,
    fragments,
    variables,
  });

  const actionsA = await require('./fire_resolver').fireResolvers({ actions, contextValue, resolver });

  const actionsB = await require('./select').selectFields({ actions: actionsA });

  const actionsC = await require('./assemble').assemble({ actions: actionsB });
  console.log(JSON.stringify(actionsC, null, 2));

  return await executeSelectionSet({
    selectionSet: mainDefinition.selectionSet,
    rootValue,
    fragments,
    contextValue,
    variables,
    resolver,
  });
}

const executeSelectionSet = async function ({
  selectionSet,
  rootValue,
  fragments,
  contextValue,
  variables,
  resolver,
}) {
  if (!selectionSet || rootValue == null) { return rootValue; }

  const resultPromises = selectionSet.selections.map(async ({
    name: { value: fieldName } = {},
    alias,
    selectionSet,
    arguments,
    kind,
    directives,
  }) => {
    if (!applyDirectives({ directives, variables })) { return; }

    if (kind === 'Field') {
      const resultFieldKey = (alias && alias.value) || fieldName;

      const args = objectArgParser({ fields: arguments, variables });

      const result = await resolver({
        name: fieldName,
        parent: rootValue,
        args,
        context: contextValue,
      });

      if (Array.isArray(result)) {
        const promises = result.map(async item => {
          return await executeSelectionSet({
            selectionSet,
            rootValue: item,
            fragments,
            contextValue,
            variables,
            resolver,
          });
        });
        const fieldResult = await Promise.all(promises);
        return { [resultFieldKey]: fieldResult };
      }

      const fieldResult = await executeSelectionSet({
        selectionSet,
        rootValue: result,
        fragments,
        contextValue,
        variables,
        resolver,
      });
      return { [resultFieldKey]: fieldResult };
    }

    if (kind === 'FragmentSpread') {
      const fragment = fragments.find(({ name }) => name.value === fieldName);

      if (!fragment) {
        throw new Error(`No fragment named ${fieldName}`);
      }

      return await executeSelectionSet({
        selectionSet: fragment.selectionSet,
        rootValue,
        fragments,
        contextValue,
        variables,
        resolver,
      });
    }

    if (kind === 'InlineFragment') {
      return await executeSelectionSet({
        selectionSet,
        rootValue,
        fragments,
        contextValue,
        variables,
        resolver,
      });
    }
  });
  const results = await Promise.all(resultPromises);
  return deepMerge(...results);
}

const applyDirectives = function ({ directives = [], variables }) {
  return directives.every(applyDirective.bind(null, variables));
};

const applyDirective = function (
  variables,
  {
    arguments,
    name: { value: directiveName },
  },
) {
  if (directiveName === 'include') {
    return checkDirective({ variables, arguments, directiveName });
  }

  if (directiveName === 'skip') {
    return !checkDirective({ variables, arguments, directiveName });
  }

  return true;
};

const checkDirective = function ({ variables, arguments, directiveName }) {
  if (arguments.length !== 1) {
    throw new Error(`Incorrect number of arguments for the @${directiveName} directive.`);
  }

  const [{
    name: { value: ifArgName } = {},
    value: { kind: ifKind, value: ifValue, name: { value: ifValueName } = {} },
  }] = arguments;

  if (ifArgName !== 'if') {
    throw new Error(`Invalid argument for the @${directiveName} directive.`);
  }

  const checkSpecificDirective = directivesCheckers[ifKind];

  if (!checkSpecificDirective) {
    throw new Error(`Argument for the @${directiveName} directive must be a variable or a boolean value.`);
  }

  return checkSpecificDirective({
    ifValue,
    variables,
    ifValueName,
    directiveName,
  });
};

const checkBooleanDirective = function ({ ifValue }) {
  return ifValue;
};

const checkVariableDirective = function ({
  variables,
  ifValueName,
  directiveName,
}) {
  const evaledValue = variables[ifValueName];

  if (typeof evaledValue !== 'boolean') {
    throw new Error(`Invalid variable referenced in @${directiveName} directive.`);
  }

  return evaledValue;
};

const directivesCheckers = {
  BooleanValue: checkBooleanDirective,
  Variable: checkVariableDirective,
};

const objectArgParser = function ({ fields, variables }) {
  if (!fields) { return null; }

  const fieldsA = fields
    .map(field => ({ [field.name.value]: field }))
    .reduce(assignObject, {});
  const fieldsB = mapValues(
    fieldsA,
    ({ value: arg }) => argParsers[arg.kind]({ ...arg, variables })
  );
  return fieldsB;
};

const arrayArgParser = function ({ values, variables }) {
  return values.map(arg => argParsers[arg.kind]({ ...arg, variables }));
};

const numberArgParser = function ({ value }) {
  return Number(value);
};

const identityArgParser = function ({ value }) {
  return value;
};

const variableArgParser = function ({ name, variables }) {
  return variables[name.value];
};

const argParsers = {
  ObjectValue: objectArgParser,
  ListValue: arrayArgParser,
  IntValue: numberArgParser,
  FloatValue: numberArgParser,
  StringValue: identityArgParser,
  BooleanValue: identityArgParser,
  EnumValue: identityArgParser,
  Variable: variableArgParser,
}

module.exports = {
  graphql,
};
