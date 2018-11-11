const { authenticate } = require('@feathersjs/authentication').hooks;
//const checkApiPermission = require('../../hooks/check-api-permission');
const addNestedPath = require('../../hooks/add-nested-path');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [addNestedPath()],
    update: [],
    patch: [],
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
