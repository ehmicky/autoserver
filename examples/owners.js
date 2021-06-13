const owners = {
  description: "A pet's owner",
  attributes: {
    name: {},
    pets: {
      type: 'pets[]',
    },
  },
}

// eslint-disable-next-line import/no-default-export
export default owners
