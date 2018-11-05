// Initializes the `run-api` service on path `/run-api`
const createService = require('feathers-mongoose');
const createModel = require('../../models/run-api.model');
const hooks = require('./run-api.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/run-api', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('run-api');

  service.hooks(hooks);
};
