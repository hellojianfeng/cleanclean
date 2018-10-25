const { authenticate } = require('@feathersjs/authentication').hooks;

const addNestedPath = require('../../hooks/add-nested-path');

const beforeAddOrg = require('../../hooks/before-add-org');

module.exports = {
  before: {
    //all: [ authenticate('jwt') ],
    all: [],
    find: [],
    get: [],
    create: [addNestedPath("#"), beforeAddOrg()],
    update: [addNestedPath("#"), beforeAddOrg()],
    patch: [addNestedPath("#"), beforeAddOrg()],
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
