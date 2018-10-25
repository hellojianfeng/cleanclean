// Initializes the `roles` service on path `/roles`
const createService = require('feathers-mongoose');
const createModel = require('../../models/roles.model');
const hooks = require('./roles.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  //app.use('/roles', createService(options));

  const docs = {
    //if we want to add the mongoose model to the 'definitions' so it is a named model in the swagger ui:
    definitions: {
      roles: {
        'type': 'object',
        'required': [
          'name','path','org'
        ],
        'properties': {
          'name': {
            'type': 'string',
            'description': 'role name, it is a unique name in organization'
          },
          'display_name': {
            'type': 'string',
            'description': 'role\'s display name'
          },
          'path': {
            'type': 'string',
            'description': 'dot separated string, like admin.sales,unique in organization'
          },
          'parent': {
            'type': 'objectId',
            'description': 'parent of role, null or ObjectId'
          },
          'org': {
            'type': 'object',
            'required': ['oid','name'],
            'properties':{
              'oid': {
                'type': 'objectId',
                'description': 'objectId of organization, only one of oid and name are required when creating a new role'
              },
              'name': {
                'type': 'string',
                'description': 'name of organization, only one of oid and name are required when creating a new role'
              },
            },  
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
  app.use('/roles', Object.assign(createService(options),{docs: docs}));

  // Get our initialized service so that we can register hooks
  const service = app.service('roles');

  service.hooks(hooks);
};
