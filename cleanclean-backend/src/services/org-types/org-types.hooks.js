const { authenticate } = require('@feathersjs/authentication').hooks;
const addNestedPath = require('../../hooks/add-nested-path');

const checkApiPermission = require('../../hooks/check-api-permission');

module.exports = {
  before: {
    all: [ authenticate('jwt'), checkApiPermission() ],
    find: [],
    get: [],
    create: [addNestedPath()],
    update: [addNestedPath()],
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
