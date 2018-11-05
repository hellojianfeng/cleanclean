const { authenticate } = require('@feathersjs/authentication').hooks;

const addNestedPath = require('../../hooks/add-nested-path');

const beforeAddOrg = require('../../hooks/before-add-org');

const afterCreateOrg = require('../../hooks/after-create-org');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [addNestedPath('#'), beforeAddOrg()],
    update: [addNestedPath('#'), checkApiPermission(), beforeAddOrg()],
    patch: [addNestedPath('#'), checkApiPermission(), beforeAddOrg()],
    remove: [checkApiPermission()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [afterCreateOrg()],
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
