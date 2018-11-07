// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const userRoleFind = require('../APIs/js/user-role-find');
const userPermissionFind = require('../APIs/js/user-permission-find');
module.exports = function (options = {}) {
  return async context => {

    const fileTool = require('../utils/file.js');

    const user = context.params.user;

    if(!user){
      throw new Error('user is not authenticated!');
    }

    if(!user.current_org){
      throw new Error('please provide current org!');
    }

    const orgService = context.app.service('orgs');
    const org = await orgService.get(user.current_org);

    if(!org){
      throw new Error('org is not valid!');
    }

    let jsonTypePermissions = [];
    if(org.type && org.type.path){
      jsonTypePermissions = fileTool.getTailFileInDotFolder('src/APIs/data/org-types/'+ org.type.path, 'api-permission.json');
    }

    const jsonOrgPermissions = fileTool.getTailFileInDotFolder('src/APIs/data/orgs/'+ org.path, 'api-permission.json');
  
    const jsonApiPermissions = require('../APIs/data/api-permission.json');

    const jsonPermissions = Object.assign(jsonApiPermissions,jsonTypePermissions,jsonOrgPermissions);

    const apiName = context.data.api;

    const method = apiName.slice(apiName.lastIndexOf('-') + 1);

    const apiMethod = require('../APIs/js/'+apiName);

    //if not define permission for api, by default find and get is always allowed to access
    if(!jsonPermissions[apiName] && ['find','get'].includes(method) ){
      return await apiMethod(context, options);
    }

    let isAllowed = false;

    await userRoleFind(context);

    const userRoles = context.result;

    jsonApiPermissions.roles.map ( o => {
      if (userRoles.hasOwnProperty(o.path)){
        isAllowed = true;
      }
    })

    await userPermissionFind(context);

    const userPermissions = context.result;

    jsonApiPermissions.permissions.map ( o => {
      if (userPermissions.hasOwnProperty(o.path)){
        isAllowed = true;
      }
    })

    if (!isAllowed){
      throw new Error('user is not allowed to access api!');
    } 

    //reset context result
    context.result = null

    return await apiMethod(context, options);
  };
};
