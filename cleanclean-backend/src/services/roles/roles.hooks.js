const { authenticate } = require('@feathersjs/authentication').hooks;

const addNestedPath = require('../../hooks/add-nested-path');

module.exports = {
  before: {
    all: [ authenticate('jwt'), checkApiPermission() ],
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
