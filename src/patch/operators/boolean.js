// eslint-disable-next-line no-underscore-dangle
export const _invert = {
  attribute: ['boolean'],

  argument: ['empty'],

  apply({ value: attrVal = false }) {
    return !attrVal
  },
}
