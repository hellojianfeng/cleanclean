const { authenticate } = require('@feathersjs/authentication').hooks;
const beforeCreateRunOperation = require('../../hooks/before-create-run-operation');

const checkApiPermission = require('../../hooks/check-api-permission');

module.exports = {
  before: {
    all: [ authenticate('jwt'), checkApiPermission() ],
    find: [],
    get: [],
    create: [beforeCreateRunOperation()],
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
