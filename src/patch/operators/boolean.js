export const invert = {
  attribute: ['boolean'],

  argument: ['empty'],

  apply: ({ value: attrVal = false }) => !attrVal,
}
