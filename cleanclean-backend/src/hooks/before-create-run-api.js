// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const userOrgFind = require('../APIs/js/user-org-find');
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

    const permissionService = context.app.service('permissions');
    let permissions = jsonPermissions[apiName]['permissions'] ? jsonPermissions[apiName]['permissions'] : [];

    const allowPermissions = await permissions.map( async path => {
      return await permissionService.find({
        query: {
          org: user.current_org,
          path: path
        }
      }).then( results => {
        if (results.total === 1){
          return results.data[0];
        }
      });
    });

    const roleService = context.app.service('roles');

    const userRoles = await user.roles.map( async o => {
      return await roleService.get(o._id);
    });

    let isAllowed = false;

    userRoles.map ( role => {
      role.permissions.map ( p => {
        allowPermissions.map ( ap => {
          if (ap._id.equal(p.oid)){
            isAllowed = true;
          }
        });
      });
    });

    if (!isAllowed){
      throw new Error('user is not allowed to access api!');
    } 

    return await apiMethod(context, options);
  };
};
