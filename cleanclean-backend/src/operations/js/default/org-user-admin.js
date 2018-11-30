
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  const operation = options.operation;
  const action = context.data.action || 'open';
  const contextParser = require('../../../APIs/js/operation-context-parse')(context,options);
  const modelParser = require('../../../APIs/js/models-parse');

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
      return r.path !== 'followone'; // not allow add user directly into this role
    });
    result.result.org_permissions = await contextParser.current_org_permissions;
    result.result.org_operations = await contextParser.current_org_operations;
  
    context.result = result;
  }

  //if not provide role for user, use everybody role
  if (action === 'add-org-user' || action === 'add-user-role'){
    let {role,user} = await modelParser.role(context,operation.data);
    if (!role){
      role = await contextParser.everybody;
    }
    if(user && role){
      const userRoles = await contextParser.user_roles;
      if (userRoles.length === 0){ //if user is not in org, add user as everybody role
        await userService.patch(user._id,{ roles: {oid: role._id, path: role.path, org_id: role.org_id, org_path: role.org_path}});
      } else {
        const pathList = userRoles.map ( ur => {
          return ur.path;
        });
        if (!pathList.includes(role.path)){
          user.roles.push({oid: role._id, path: role.path, org_id: role.org_id, org_path: role.org_path});
          await userService.patch(user._id, { roles: user.roles });
        }
      }
    } else {
      throw new Error('no valid user or role!');
    }
  }

  if(action === 'create-org-user'){

  }

  if(action === 'find-user'){

  }

  if(action === 'add-user-permission'){

  }

  if(action === 'add-user-operation'){

  }

  return context;
};

