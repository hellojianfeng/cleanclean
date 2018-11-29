
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  const operation = options.operation;
  const action = context.data.action || 'open';
  const contextParser = require('../../../APIs/js/operation-context-parse')(context,options);

  //const mongooseClient = context.app.get('mongooseClient');
  const userService = context.app.service('users');

  //const user = context.params.user;

  const result = {
    operation: operation.path,
    action,
    result: {}
  };

  //open action return org user list
  if (action === 'open'){

    result.result.org_users = await contextParser.current_org_users;
    result.result.org_roles = await contextParser.current_org_roles;
    result.result.org_roles = result.result.org_roles.filter( r => {
      return r.path !== 'followone' // not allow add user directly into this role
    })
    result.result.org_permissions = await contextParser.current_org_permissions;
    result.result.org_operations = await contextParser.current_org_operations;
  
    context.result = result;
  }

  if (action === 'add-user'){
    const userData = operation.data.user;
  }

  return context;
};

