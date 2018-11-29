
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

  const current_org = await contextParser.current_org;

  if (!current_org) {
    result.result = {
      error: 'not find org!'
    };
    context.result = result;
    return context;
  } else {
    result.result.org = current_org;
  }

  //open action return org user list
  if (action === 'open'){

    const finds = await userService.find({query: { $or: [
      {'roles.org.path': current_org.path},
      {'permissions.org.path':current_org.path},
      {'operations.org.path': current_org.path}
    ]}});

    result.users = finds.data;
  
    context.result = result;
  }

  return context;
};

