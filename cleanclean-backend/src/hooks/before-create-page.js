// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const userRoleFind = require('../APIs/js/user-role-find');
const userPermissionFind = require('../APIs/js/user-permission-find');
module.exports = function (options = {}) {
  return async context => {

    const user = context.params.user;

    if(!user){
      throw new Error('user is not authenticated!');
    }

    const jsonPagePermissions = require('../pages/data/page-permission.json');

    const pageName = context.data.page;

    const jsPageFile = '../pages/js/'+pageName +'.js';

    //const resolvePath = require.resolve('../pages/js');

    if (!fs.existsSync(jsPageFile.replace('..','src'))){
      throw new Error('not find page of ' + pageName);
    }

    const jsPage = require(jsPageFile);

    let isAllowed = false;

    const pagePermissions = jsonPagePermissions[pageName];

    if(pagePermissions && (pagePermissions.roles || pagePermissions.permissions)){
      const userRoles = await userRoleFind(context);
      const userPermissions = await userPermissionFind(context);

      pagePermissions.roles.map ( o => {
        if (userRoles.hasOwnProperty(o.path)){
          isAllowed = true;
        }
      });

      pagePermissions.permissions.map ( o => {
        if (userPermissions.hasOwnProperty(o.path)){
          isAllowed = true;
        }
      });
    } else {
      //if not set role and permissions for page, always allow user to access page
      isAllowed = true;
    }

    if (!isAllowed){
      throw new Error('user is not allowed to access api!');
    } 

    //reset context result
    delete context.result;

    await jsPage(context, options);

    return context;
  };
};
