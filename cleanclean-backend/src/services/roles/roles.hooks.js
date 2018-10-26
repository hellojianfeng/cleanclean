const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    //all: [ authenticate('jwt') ],
    all: [],
    find: [],
    get: [],
    create: [addNestedPath()],
    update: [addNestedPath()],
    patch: [addNestedPath()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
