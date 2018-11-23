// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const userRoleFind = require('../APIs/js/user-role-find');
const userPermissionFind = require('../APIs/js/user-permission-find');
const JsonTools = require('../utils/JsonTools.js');
module.exports = function (options = {}) {
  return async context => {

    const user = context.params.user;

    if(!user){
      throw new Error('user is not authenticated!');
    }

    if(!(user.current_org && user.current_org.oid)){
      throw new Error('please provide current org!');
    }

    const orgService = context.app.service('orgs');
    const org = await orgService.get(user.current_org.oid);

    if(!org){
      throw new Error('org is not valid!');
    }

    const orgType = org.type && org.type.path ? org.type.path : 'company';

    const typeJsons = JsonTools.getJsonsFromPathFiles('../APIs/data/org-types/'+ orgType, 'api-permission.json');

    const typeJsonData = JsonTools.mergeObjectInArray(typeJsons,3);

    const orgJsons = JsonTools.getJsonsFromPathFiles('../APIs/data/orgs/'+ org.path, 'api-permission.json');

    const orgJsonData = JsonTools.mergeObjectInArray(orgJsons,3);

    const jsonApiPermissions = require('../APIs/data/api-permission.json');

    const jsonPermissions = JsonTools.mergeObjects(3,jsonApiPermissions,typeJsonData,orgJsonData);

    const apiName = context.data.api;

    const method = apiName.slice(apiName.lastIndexOf('-') + 1);

    const apiMethod = require('../APIs/js/'+apiName);

    //if not define permission for api, by default find and get is always allowed to access
    if(!jsonPermissions[apiName] && ['find','get','parse'].includes(method) ){
      await apiMethod(context, options);
      return context;
    }

    let isAllowed = false;

    await userRoleFind(context);

    const userRoles = context.result;

    if(jsonApiPermissions.roles && jsonApiPermissions.roles instanceof Object){
      Object.values(jsonApiPermissions.roles).map ( o => {
        if (userRoles.hasOwnProperty(o.path)){
          isAllowed = true;
        }
      });
    }

    await userPermissionFind(context);

    const userPermissions = context.result;

    if(jsonApiPermissions.permissions && jsonApiPermissions.permissions instanceof Object){
      jsonApiPermissions.permissions.map ( o => {
        if (userPermissions.hasOwnProperty(o.path)){
          isAllowed = true;
        }
      });
    }

    if (!isAllowed){
      throw new Error('user is not allowed to access api!');
    } 

    //reset context result
    context.result = null;

    await apiMethod(context, options);

    return context;
  };
};
