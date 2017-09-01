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
  const fragmentMap = createFragmentMap(document);

  return await executeSelectionSet({
    selectionSet: mainDefinition.selectionSet,
    rootValue,
    fragmentMap,
    contextValue,
    variables,
    resolver,
  });
}

const createFragmentMap = function (doc) {
  return doc.definitions
    .filter(definition => definition.kind === 'FragmentDefinition')
    .map(fragment => ({ [fragment.name.value]: fragment }))
    .reduce(assignObject, {});
}

const executeSelectionSet = async function ({
  selectionSet,
  rootValue,
  fragmentMap,
  contextValue,
  variables,
  resolver,
}) {
  if (!selectionSet || rootValue == null) { return rootValue; }

  const resultPromises = selectionSet.selections
    .map(async field => {
      const {
        name: { value: fieldName } = {},
        selectionSet,
        arguments,
        kind,
        directives,
      } = field;

      if (!applyDirectives({ directives, variables })) { return; }

      if (kind === 'Field') {
        const args = objectArgParser({ fields: arguments, variables });

        const result = await resolver(fieldName, rootValue, args, contextValue);

        const { value: resultFieldKey } = field.alias || field.name;

        let fieldResult;
        if (Array.isArray(result)) {
          const promises = result.map(async item => {
            return await executeSelectionSet({
              selectionSet,
              rootValue: item,
              fragmentMap,
              contextValue,
              variables,
              resolver,
            });
          });
          fieldResult = await Promise.all(promises);
        } else {
          fieldResult = await executeSelectionSet({
            selectionSet,
            rootValue: result,
            fragmentMap,
            contextValue,
            variables,
            resolver,
          });
        }

        return { [resultFieldKey]: fieldResult };
      }

      const fragmentSet = getFragmentSet({
        fragmentMap,
        kind,
        selectionSet,
        fieldName,
      });

      return await executeSelectionSet({
        selectionSet: fragmentSet,
        rootValue,
        fragmentMap,
        contextValue,
        variables,
        resolver,
      });
    });
  const results = await Promise.all(resultPromises);
  return deepMerge(...results);
}

const getFragmentSet = function ({
  fragmentMap,
  kind,
  selectionSet,
  fieldName,
}) {
  if (kind === 'InlineFragment') {
    return selectionSet;
  }

  const fragment = fragmentMap[fieldName];

  if (!fragment) {
    throw new Error(`No fragment named ${fieldName}`);
  }

  return fragment.selectionSet;
};

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
