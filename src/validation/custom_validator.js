import moize from 'moize'

import { getModelParams } from '../functions/params/values.js'
import { runConfigFunc } from '../functions/run.js'

import { getValidator } from './validator.js'

// Add custom validation keywords, from config.validation
const mGetCustomValidator = ({ config: { validation = {} } = {} }) => {
  const validator = getValidator()
  return Object.entries(validation).reduce(addCustomKeyword, validator)
}

// Serializing the whole config as is too slow, so we just take keywords list.
const transformArgs = ([{ config: { validation = {} } = {} }]) =>
  Object.keys(validation).join(',')

export const getCustomValidator = moize(mGetCustomValidator, {
  transformArgs,
  maxSize: 1e3,
})

const addCustomKeyword = (
  validatorA,
  [keyword, { test: testFunc, message, type }],
) => {
  // We name `null` `empty` in config, as it is more YAML-friendly
  const typeA = type === 'empty' ? 'null' : type

  validateCustomKeyword({ type: typeA, keyword })

  const validate = keywordFunc({ keyword, testFunc, message })
  const validatorB = validatorA.addKeyword({
    keyword,
    validate,
    type: typeA,
    $data: true,
  })

  return validatorB
}

const validateCustomKeyword = ({ type, keyword }) => {
  const isRedundant =
    Array.isArray(type) && type.includes('number') && type.includes('integer')

  if (!isRedundant) {
    return
  }

  const message = `Custom validation keyword 'config.validation.${keyword}' must not have both types 'number' and 'integer', as 'number' includes 'integer'.`
  throw new Error(message)
}

const keywordFunc = ({ keyword, testFunc, message }) =>
  // eslint-disable-next-line max-params, prefer-arrow-functions/prefer-arrow-functions
  function validate(arg, dataVal, parentSchema, dataContext) {
    const {
      parentData: model,
      parentDataProperty: attrName,
      rootData: {
        [Symbol.for('extra')]: { mInput, currentDatum: previousmodel },
      },
    } = dataContext
    const modelParams = getModelParams({ model, attrName, previousmodel })
    const params = { arg, ...modelParams }

    const isValid = runConfigFunc({ configFunc: testFunc, mInput, params })

    if (isValid === true) {
      return true
    }

    const messageA = runConfigFunc({ configFunc: message, mInput, params })

    // eslint-disable-next-line fp/no-mutation
    validate.errors = [{ message: messageA, keyword, params: { arg } }]

    return false
  }
