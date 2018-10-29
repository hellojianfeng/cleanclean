// Initializes the `run-operation` service on path `/run-operation`
const createService = require('feathers-mongoose');
const createModel = require('../../models/run-operation.model');
const hooks = require('./run-operation.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/run-operation', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('run-operation');

  service.hooks(hooks);
};
