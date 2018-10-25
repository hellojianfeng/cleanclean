// Initializes the `users` service on path `/users`
const createService = require('feathers-mongoose');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  //app.use('/users', createService(options));

  const docs = {
    //if we want to add the mongoose model to the 'definitions' so it is a named model in the swagger ui:
    definitions: {
      users: {
        "type": "object",
        "required": [
          "username","email","mobile","password"
        ],
        "properties": {
          "username": {
            "type": "string",
            "description": "username, unique, if not provide, generate automatically"
          },
          "familyname": {
            "type": "string",
            "description": "family name of user"
          },
          "surname": {
            "type": "string",
            "description": "surname of user"
          },
          "mobile": {
            "type": "object",
            "properties": {
              "number":{
                "type":"string"
              },
              "isVerified":{
                "type":"boolean",
                "default":"false"
              },
              "data":{
                "type":"mixed"
              }
            }
          },
          "email": {
            "type": "object",
            "properties": {
              "address":{
                "type":"string"
              },
              "isVerified":{
                "type":"boolean",
                "default":"false"
              },
              "data":{
                "type":"mixed"
              }
            }
          },
          "password": {
            "type": "string",
            "description": "password of user, it is encrypted by salt"
          },
          "salt": {
            "type": "string",
            "description": "salt for encryping password"
          },
          "auth0Id": {
            "type": "string",
            "description": "auth0Id"
          },
          "googleId": {
            "type": "string",
            "description": "googleId for logging with google account"
          },
          "facebookId": {
            "type": "string",
            "description": "facebookId for logging with facebook account"
          },
          "roles": {
            "type":"array",
            "items":{
              "type": "object",
              "required": ["oid","org"],
              "properties":{
                "oid": {
                  "type": "objectId",
                  "description": "objectId of role"
                },
                "org": {
                  "type": "object",
                  "required": ["oid","name"],
                  "description":"add org propery for easily search",
                  "properties":{
                    "oid": {
                      "type": "objectId",
                      "description": "objectId of org"
                    },
                    "name": {
                      "type": "string",
                      "description": "name of org"
                    },
                  }
                },
              }, 
            }
          },
          "data": {
            "type": "mixed",
            "description": "any other data for organization"
          }
        }
      }
    }
  }

  // Initialize our service with any options it requires
  //console.log('json model',Model.schema.obj);
  app.use('/users', Object.assign(createService(options),{docs: docs}));

  // Get our initialized service so that we can register hooks
  const service = app.service('users');

  service.hooks(hooks);
};
