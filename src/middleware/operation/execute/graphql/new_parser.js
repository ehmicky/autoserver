'use strict';
/* eslint-disable */

const {
  assignArray,
  assignObject,
  mapValues,
} = require('../../../../utilities');

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

const parse = function ({
  selectionSet,
  parentPath = [],
  fragments,
  variables,
}) {
  return selectionSet.selections
    .filter(applyDirectives)
    .map(({
      name: { value: fieldName } = {},
      alias,
      selectionSet,
      arguments: args,
      kind,
    }) => {
      if (kind === 'Field') {
        const childPath = (alias && alias.value) || fieldName;

        if (!selectionSet) {
          return {
            actions: [],
            select: [{ outputKey: childPath, dbKey: fieldName }],
          };
        }

        const actionPath = [...parentPath, childPath];

        const argsA = objectArgParser({ fields: args, variables });

        const { actions: childActions, select: childSelect } = parse({
          selectionSet,
          parentPath: actionPath,
          fragments,
          variables,
        });

        const action = {
          actionName: fieldName,
          actionPath,
          args: argsA,
          select: childSelect,
        };

        const actions = [action, ...childActions];
        return { actions, select: [] };
      }

      if (kind === 'FragmentSpread') {
        const fragment = fragments.find(({ name }) => name.value === fieldName);

        if (!fragment) {
          throw new Error(`No fragment named ${fieldName}`);
        }

        const { selectionSet } = fragment;
        return parse({ selectionSet, parentPath, fragments, variables });
      }

      if (kind === 'InlineFragment') {
        return parse({ selectionSet, parentPath, fragments, variables });
      }
    })
    .reduce(
      (children, child) => mapValues(
        child,
        (arr, key) => (children[key] || []).concat(arr),
      ),
      {},
    );
};

const applyDirectives = function ({ directives = [], variables }) {
  return directives.every(applyDirective.bind(null, variables));
};

const applyDirective = function (
  variables,
  {
    arguments: args,
    name: { value: directiveName },
  },
) {
  if (directiveName === 'include') {
    return checkDirective({ variables, args, directiveName });
  }

  if (directiveName === 'skip') {
    return !checkDirective({ variables, args, directiveName });
  }

  return true;
};

const checkDirective = function ({ variables, args, directiveName }) {
  if (args.length !== 1) {
    throw new Error(`Incorrect number of arguments for the @${directiveName} directive.`);
  }

  const [{
    name: { value: ifArgName } = {},
    value: { kind: ifKind, value: ifValue, name: { value: ifValueName } = {} },
  }] = args;

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
  if (!fields || fields.length === 0) { return {}; }

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
  parse,
};
