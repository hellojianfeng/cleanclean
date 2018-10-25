// Initializes the `orgs` service on path `/orgs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/orgs.model');
const hooks = require('./orgs.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  //app.use('/orgs', createService(options));

  const docs = {
    //overwrite things here.
    //if we want to add a mongoose style $search hook to find, we can write this:
    // find: {
    //   parameters: [
    //     {
    //       description: 'Number of results to return',
    //       in: 'query',
    //       name: '$limit',
    //       type: 'integer'
    //     },
    //     {
    //       description: 'Number of results to skip',
    //       in: 'query',
    //       name: '$skip',
    //       type: 'integer'
    //     },
    //     {
    //       description: 'Property to sort results',
    //       in: 'query',
    //       name: '$sort',
    //       type: 'string'
    //     },
    //     {
    //       description: 'Property to query results',
    //       in: 'query',
    //       name: '$search',
    //       type: 'string'
    //     }
    //   ]
    // },
    //if we want to add the mongoose model to the 'definitions' so it is a named model in the swagger ui:
    definitions: {
      orgs: {
        'type': 'object',
        'required': [
          'name'
        ],
        'properties': {
          'name': {
            'type': 'string',
            'description': 'organization name, it is a unique name'
          },
          'display_name': {
            'type': 'string',
            'description': 'organization\'s display name'
          },
          'profiles': {
            'type': 'array of orgProfile',
            'description': 'a lot of information for organization, like photos, icons'
          },
          'data': {
            'type': 'mixed',
            'description': 'any other data for organization'
          }
        }
      }
    }
  };

  // Initialize our service with any options it requires
  //console.log('json model',Model.schema.obj);
  app.use('/orgs', Object.assign(createService(options), {docs: docs}));

  // Get our initialized service so that we can register hooks
  const service = app.service('orgs');

  service.hooks(hooks);
};
