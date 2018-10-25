// Initializes the `org-types` service on path `/org-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/org-types.model');
const hooks = require('./org-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/org-types', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('org-types');

  service.hooks(hooks);
};
