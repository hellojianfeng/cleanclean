module.exports = async function (context,options={}, refresh=false) {

  const orgService = context.app.service('orgs');
  const operationService = context.app.service('operations');
  const permissionService = context.app.service('permissions');
  const roleService = context.app.service('roles');
  const userService = context.app.service('users');

  const operationParser = require('./operation-context-parse')(context,options);

  const mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;
  // if(mongoose.Types.ObjectId.isValid(contextOperation)){
  //     operation = await operationService.get(contextOperation);
  // } 

  context.model_parser = context.model_parser || {};

  const roleData = options.role || context.data && context.data.data && context.data.data.role;
  const rolesData = options.roles || context.data && context.data.data && context.data.data.roles || [];
  const permissionData = options.role || context.data && context.data.data && context.data.data.permission;
  const permissionsData = options.roles || context.data && context.data.data && context.data.data.permissions || [];
  const operationData = options.role || context.data && context.data.data && context.data.data.operation;
  const operationsData = options.roles || context.data && context.data.data && context.data.data.operations || [];
  const orgData = options.org || context.data && context.data.data && context.data.data.org;
  const userData = options.user || context.data && context.data.data && context.data.data.user;
  const usersData = options.user || context.data && context.data.data && context.data.data.users || [];
  const currentOperationData = options.org || context.data && context.data.operation;

  let user,users, org,role,roles,permission, permissions,operation, operations;
  let everyone_role, everyone_permission,current_operation,current_operation_org,current_org,follow_org;

  const getOrg = async () => {
    let orgPath;
    if ( typeof orgData === 'object'){
      if (orgData._id && orgData.path){
        return orgData;
      }
      if(orgData.oid && ObjectId.isValid(orgData.oid)){
        return await orgService.get(orgData.oid);
      }
      if(orgData.path && typeof orgData.path === 'string'){
        orgPath = orgData.path;
      }
    }

    if (typeof orgData === 'string'){
      if(orgData && ObjectId.isValid(orgData)){
        return await orgService.get(orgData.oid);
      }
      orgPath = orgData;
    }

    if (orgPath){
      const finds = orgService.find({query: { path: orgPath}});
      if (finds.total === 1) {
        return finds.data[0];
      }
    }
  };

  const getCurrentOperation = async () => {
    let operation;
    if(typeof currentOperationData === 'string'){
      if (ObjectId.isValid(currentOperationData)){
        operation = operationService.get(currentOperationData);
      } else {
        let org = await getOrg() || await getFollowOrg() || await getCurrentOrg();
        if(org && org._id){
          context.model_parser.current_operation_org = org;
          const finds = await operationService.find({query:{path:currentOperationData,org_id: org._id, org_path: org.path}});
          if ( finds.total === 1){
            operation =  finds.data[0];
          }
        }
      }
    }
    if(operation && operation.path === 'org-home'){
      context.params.user.current_org = {oid: operation.org_id,path:operation.org_path};
      context.params.user.follow_org = null;
      delete context.model_parser.current_org;
      context.model_parser.current_org = await getCurrentOrg;
      await userService.patch(context.params.user._id, { current_org: context.params.user.current_org, follow_org: null});
    }
    if(operation && operation.path === 'org-follow'){
      context.params.user.follow_org = {oid: operation.org_id,path:operation.org_path};
      delete context.model_parser.follow_org;
      context.model_parser.follow_org = await getFollowOrg;
      await userService.patch(context.params.user._id, { follow_org: context.params.user.follow_org});
    }
    return operation;
  };

  const getCurrentOperationOrg = async () => {
    if(context.model_parser.current_operation_org && !refresh){
      return context.model_parser.current_operation_org;
    }
    const operation = getCurrentOperation;
    if(operation && operation.org_id){
      return context.model_parser.current_operation_org = await operationService.get(operation.org_id);
    }
    return null;
  };

  const getRole = async () => {
    return await getModel(roleData,roleService);
  };

  const getRoles = async () => {
    return getModelList(rolesData,roleService);
  };

  const getUser = async () => {
    let email;
    if ( typeof userData === 'object'){
      if (userData._id && userData.path){
        return userData;
      }
      if(userData.oid && ObjectId.isValid(userData.oid)){
        return await userService.get(userData.oid);
      }
      if(userData.email && typeof userData.email === 'string'){
        email = userData.email;
      }
    }

    if (typeof userData === 'string'){
      if(userData && ObjectId.isValid(userData)){
        return await userService.get(userData.oid);
      }
      email = userData;
    }

    if (email){
      const finds = userService.find({query: { email: email}});
      if (finds.total === 1) {
        return finds.data[0];
      }
    }
  };

  const getUsers = async () => {
    const users = [];
    let user, email;
    for (const u of usersData){
      if (typeof u === 'object') {
        if (u._id && u.path){
          users.push(u);
        }
        if(u.oid && ObjectId.isValid(u.oid)){
          user = await userService.get(u.oid);
          users.push(user);
        }
        if(!u.oid && u.path){
          email = u.email;
        }
      }
      if(typeof u === 'string'){
        if(ObjectId.isValid(u)){
          user = await userService.get(u);
          users.push(user);
        } else {
          email = u;
        }
      }
      if(email){
        const finds = userService.find({query:{email: email}});
        if (finds.total === 1){
          users.push(finds.data[0]);
        }
      }
    }
    return users;
  };

  const getEveryoneRole = async () => {
    if (context.model_parser.everyone_role){
      return context.model_parser.everyone_role;
    }
    const org = await getCurrentOrg;
    if(org && org._id){
      const finds = await roleService.find({query:{path:'everyone',org_id:org._id}});
      if (finds.total === 1) {
        return context.model_parser.everyone_role = finds.data[0];
      }
    }
    return null;
  };

  const getEveryonePermission = async () => {
    if (context.model_parser.everyone_permission){
      return context.model_parser.everyone_permission;
    }
    const org = await getCurrentOrg;
    if(org && org._id){
      const finds = await permissionService.find({query:{path:'everyone',org_id:org._id}});
      if (finds.total === 1) {
        return context.model_parser.everyone_permission = finds.data[0];
      }
    }
    return null;
  };

  const getCurrentOrg = async () => {
    if (context.model_parser.current_org){
      return context.model_parser.current_org;
    }
    const orgData = context.params.user.current_org;
    if (orgData && orgData.oid && ObjectId.isValid(orgData.oid)){
      return context.model_parser.current_org = await orgService.get(orgData.oid);
    }
    return null;
  };

  const getFollowOrg = async () => {
    if (context.model_parser.follow_org){
      return context.model_parser.follow_org;
    }
    const orgData = context.params.user.follow_org;
    if (orgData && orgData.oid && ObjectId.isValid(orgData.oid)){
      return context.model_parser.follow_org = await orgService.get(orgData.oid);
    }
    return null;
  };

  const getModel = async (modelData, service) => {
    let path;
    if ( typeof modelData === 'object'){
      if (modelData._id && modelData.path){
        return modelData;
      }
      if(modelData.oid && ObjectId.isValid(modelData.oid)){
        return await service.get(modelData.oid);
      }
      if(modelData.path && typeof modelData.path === 'string'){
        path = modelData.path;
      }
    }

    if (typeof modelData === 'string'){
      if(modelData && ObjectId.isValid(modelData)){
        return await service.get(modelData.oid);
      }
      path = modelData;
    }

    if (path){
      const org = await getOrg || await getCurrentOrg;
      if (org && org._id){
        const finds = service.find({query:{path:path, org_id:org._id}});
        if (finds.total === 1){
          return finds.data[0];
        }
      }
    }
    return null;
  };
 
  const getModelList = async (listData, service) => {
    const list = [];
    let model, path;
    const org = await getOrg || await getCurrentOrg;
    for (const e of listData){
      if (typeof e === 'object') {
        if (e._id && e.path){
          list.push(e);
        }
        if(e.oid && ObjectId.isValid(e.oid)){
          model = await service.get(e.oid);
          list.push(model);
        }
        if(!e.oid && e.path){
          path = e.path;
        }
      }
      if(typeof e === 'string'){
        if(ObjectId.isValid(e)){
          model = await service.get(e);
          list.push(model);
        } else {
          path = e;
        }
      }
      if(path){
        if (org && org._id){
          const finds = service.find({query:{path: path, org_id: org._id}});
          if (finds.total === 1){
            list.push(finds.data[0]);
          }
        }
      }
    }
    return list;
  }; 

  const getPermission = async () => {
    return await getModel(permissionData, permissionService);
  };

  const getPermissions = async () => {
    return await getModelList(permissionsData,permissionService);
  };

  const getOperation = async () => {
    return await getModel(operationData, operationService);
  };

  const getOperations = async () => {
    return await getModelList(operationsData,operationService);
  };

  if (currentOperationData){
    if (context.model_parser.current_operation && !refresh){
      current_operation = context.model_parser.current_operation;
    } else {
      current_operation = context.model_parser.current_operation = await getCurrentOperation();
    }
  }

  current_operation_org = await getCurrentOperationOrg();
  everyone_role = await getEveryoneRole();
  const everyone_role_permissions = await operationParser.everyone_role_permissions;
  const everyone_role_operations = await operationParser.everyone_role_operations;
  everyone_permission = await getEveryonePermission();
  const everyone_permission_operations = await operationParser.everyone_permission_operations;
  const user_roles = await operationParser.user_roles;
  const user_permissions = await operationParser.user_permissions;
  const user_operations = await operationParser.user_operations;
  const user_follow_permissions = await operationParser.user_follow_permissions;
  const user_follow_operations = await operationParser.user_follow_operations;
  current_org = await getCurrentOrg();
  const current_org_users = await operationParser.current_org_users;
  const current_org_roles = await operationParser.current_org_roles;
  const current_org_permissions = await operationParser.current_org_permissions;
  const current_org_operations = await operationParser.current_org_operations;
  follow_org = await getFollowOrg();

  if (orgData){
    if(refresh){
      delete context.model_parser.org;
    }
    context.model_parser.org = org = context.model_parser.org ? context.model_parser.irg : await getOrg;
  }

  if (roleData){
    if(refresh){
      delete context.model_parser.role;
    }
    context.model_parser.role = role = context.model_parser.role ? context.model_parser.role : await getRole;
  }

  if (rolesData){
    if(refresh){
      delete context.model_parser.roles;
    }
    context.model_parser.roles = roles = context.model_parser.roles ? context.model_parser.roles : await getRoles;
  }

  if (permissionData){
    if(refresh){
      delete context.model_parser.permission;
    }
    context.model_parser.permission = permission = context.model_parser.permission ? context.model_parser.permission : await getPermission;
  }

  if (permissionsData){
    if(refresh){
      delete context.model_parser.permissions;
    }
    context.model_parser.permissions = permissions = context.model_parser.permissions ? context.model_parser.permissions : await getPermissions;
  }

  if (operationData){
    if(refresh){
      delete context.model_parser.operation;
    }
    context.model_parser.operation = operation = context.model_parser.operation ? context.model_parser.operation : await getOperation;
  }

  if (operationsData){
    if(refresh){
      delete context.model_parser.operations;
    }
    context.model_parser.operations = operations = context.model_parser.operations ? context.model_parser.operations : await getOperations;
  }

  if (userData){
    if(refresh){
      delete context.model_parser.user;
    }
    context.model_parser.user = user = context.model_parser.user ? context.model_parser.user : await getUser;
  }

  if (usersData){
    if(refresh){
      delete context.model_parser.users;
    }
    context.model_parser.users = users = context.model_parser.users ? context.model_parser.users : await getUsers;
  }

  return { 
    org, role, roles, permission, permissions, operation, operations,
    user, users, everyone_role, everyone_role_permissions, everyone_role_operations, 
    everyone_permission, everyone_permission_operations, current_operation, current_operation_org, 
    current_org, current_org_users,current_org_roles, current_org_permissions, current_org_operations,
    follow_org, user_roles, user_permissions, user_operations, 
    user_follow_permissions, user_follow_operations
  };
};