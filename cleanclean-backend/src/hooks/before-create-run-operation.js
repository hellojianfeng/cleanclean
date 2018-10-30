
const orgInitialize = require('../operations/org-initialize');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    const operationService = context.app.service('operations');
    const user = context.params.user;

    //get operation first
    const operationPath = context.data.operation;
    const orgId = user.current_org;
    let appName = 'default';
    if(context.data.app){
      appName = context.data.app;
    }

    if(!operationPath){
      throw new Error('must provide operation path!');
    }

    if(!orgId){
      throw new Error('not find current org for user!');
    }

    await operationService.find({
      query: {
        path: operationPath,
        org: orgId.toString(),
        app: appName
      }
    }).then ( results => {
      if (results.total < 1){
        throw new Error('fail to find operation!, operation = '+operationPath);
      }
      if (results.total > 1){
        throw new Error('find too many operations, operation = '+operationPath);
      }

      const operation = results.data[0];

      context.data.operation = {
        oid: operation._id
      }
      context.data.user = {
        oid: user._id
      }

      let isAllowOperation = false;

      user.roles.map ( uo => {
        if( uo.org.oid.equals(orgId)){
          operation.roles.map( oo => {
            if(uo.role.oid.equals(oo.oid)){
              isAllowOperation = true;
            }
          });
        }
      });

      if(isAllowOperation === false){
        throw new Error('user is not allowed to run operation! operation = '+operationPath);
      }

      if(operation.path.toLowerCase() === 'org-initialize'){
        context = orgInitialize(context, operation);
      }
      
    })

    return context;
  };
};
