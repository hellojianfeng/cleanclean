const { authenticate } = require('@feathersjs/authentication').hooks;

const addNestedPath = require('../../hooks/add-nested-path');

const beforeAddOrg = require('../../hooks/before-add-org');

const afterCreateOrg = require('../../hooks/after-create-org');

//const checkApiPermission = require('../../hooks/check-api-permission');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [addNestedPath('#'), beforeAddOrg()],
    update: [beforeAddOrg()],
    patch: [beforeAddOrg()],
    remove: []
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
