module.exports = async function (context,options={}, refresh=false) {

const orgService = context.app.service('orgs');
  const operationService = context.app.service('operations');
  const permissionService = context.app.service('permissions');
  const roleService = context.app.service('roles');
  const userService = context.app.service('users');

  const operationParser = require('./operation-context-parse');

  const mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;
// if(mongoose.Types.ObjectId.isValid(contextOperation)){
//     operation = await operationService.get(contextOperation);
// } 

  context.parsed_models = context.parsed_models || {};

  const roleData = options.role || context.data && context.data.data && context.data.data.role;
  const rolesData = options.roles || context.data && context.data.data && context.data.data.roles || [];
  const orgData = options.org || context.data && context.data.data && context.data.data.org;
  const userData = options.user || context.data && context.data.data && context.data.data.user;
  const usersData = options.user || context.data && context.data.data && context.data.data.users || [];
  const operationData = options.org || context.data && context.data.operation;
  

  let org,role,roles,user,users, everyone_role, everyone_permission;

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
  }

  const getOperation = async () => {
    let operation;
    if(typeof operationData === 'string'){
        if (ObjectId.isValid(operationData)){
            operation = operationService.get(operationData);
        } else {
            let org = await getOrg() || await getCurrentOrg();
            if(!org){
                const finds = await operationService.find({query:{path:operationData,org_id: org._id, org_path: org.path}});
                if ( finds.total === 1){
                    operation =  finds.data[0];
                }
            }
        }
        if(operation && operation.path === 'org-home'){
            context.params.user.current_org = {oid: operation.org_id,path:operation.org_path};
            await userService.patch(context.params.user._id, { current_org: context.params.user.current_org});
        }
    }
  }

  const getRole = async () => {
    let rolePath;
    if ( typeof roleData === 'object'){
        if (roleData._id && roleData.path){
            return roleData;
        }
        if(roleData.oid && ObjectId.isValid(roleData.oid)){
            return await roleService.get(roleData.oid);
        }
        if(roleData.path && typeof roleData.path === 'string'){
            rolePath = roleData.path;
        }
    }

    if (typeof roleData === 'string'){
        if(roleData && ObjectId.isValid(roleData)){
            return await roleService.get(roleData.oid);
        }
        rolePath = roleData;
    }

    if (rolePath){
        const org = await getOrg() || await operationParser.current_org;
        if (org && org._id){
            const finds = roleService.find({query:{path:rolePath, org_id:org._id}});
            if (finds.total === 1){
                return finds.data[0];
            }
        }
    }
  }

  const getRoles = async () => {
    return getModelList(rolesData,roleService);
  }

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
  }

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
  }

  const getEveryoneRole = async () => {

  }

  const getEveryonePermission = async () => {

  }

  const getCurrentOrg = async () => {

  }
 
  const getModelList = async (listData, service) => {
        const list = [];
        let model, path;
        const org = await getOrg || await operationParser.current_org;
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
  } 

  everyone_role = await getEveryoneRole;
  everyone_permission = await getEveryonePermission;
  current_org = await getCurrentOrg;

  if (roleData){
    if(refresh){
        delete context.model_parser.role;
    }
    context.model_parser.role = role = context.model_parser.role ? context.model_parser.role : await getRole;
  }

  if (orgData){
    if(refresh){
        delete context.model_parser.org;
    }
    context.model_parser.org = org = context.model_parser.org ? context.model_parser.irg : await getOrg;
  }

  if (rolesData){
    if(refresh){
        delete context.model_parser.roles;
    }
    context.model_parser.roles = roles = context.model_parser.roles ? context.model_parser.roles : await getRoles;
  }

  if (userData){
    if(refresh){
        delete context.model_parser.user;
    }
    context.model_parser.user = user = context.model_parser.user ? context.model_parser.user : await getUser;
  }

  if (userData){
    if(refresh){
        delete context.model_parser.users;
    }
    context.model_parser.users = users = context.model_parser.users ? context.model_parser.users : await getUsers;
  }

  if (operationData){
      operation = await getOperation;
  }


  return { org, role, roles, user, users, everyone_role, everyone_permission, operation}
}