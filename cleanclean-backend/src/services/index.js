const users = require('./users/users.service.js');
const orgs = require('./orgs/orgs.service.js');
const roles = require('./roles/roles.service.js');
const orgTypes = require('./org-types/org-types.service.js');
const operations = require('./operations/operations.service.js');
const runOperation = require('./run-operation/run-operation.service.js');
const permissions = require('./permissions/permissions.service.js');
const runApi = require('./run-api/run-api.service.js');
const pages = require('./pages/pages.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(orgs);
  app.configure(roles);
  app.configure(orgTypes);
  app.configure(operations);
  app.configure(runOperation);
  app.configure(permissions);
  app.configure(runApi);
  app.configure(pages);
};
