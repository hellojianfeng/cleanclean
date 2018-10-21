const users = require('./users/users.service.js');
const orgs = require('./orgs/orgs.service.js');
const roles = require('./roles/roles.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(orgs);
  app.configure(roles);
};
