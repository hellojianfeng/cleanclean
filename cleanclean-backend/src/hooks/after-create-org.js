// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    //add admin role
    const roleService = context.app.service('roles');
    const permissionService = context.app.service('permissions');
    const userService = context.app.service('users');
    const operationService = context.app.service('operations');

    let orgs = [];

    if(Array.isArray(context.result)){
      orgs = context.result;
    } else {
      orgs.push(context.result);
    }

    const roles = context.params.user.roles || [];

    await Promise.all(orgs.map( async o => {
      //add default initialize operation for org
      const orgInitialize = await operationService.create({
        name: 'org-initialize',
        org: o._id,
      });
      //add default org-home operation
      const orgHome = await operationService.create({
        name: 'org-home',
        org: o._id,
      });
      const administrators = await permissionService.create(
        {
          name: 'administrators',
          org: o._id,
          operations: [
            {
              oid: orgInitialize._id,
              path: orgInitialize.path
            },
            {
              oid: orgHome._id,
              path: orgHome.path
            }
          ]
        },
      );
      //everyone permission
      await permissionService.create(
        {
          name: 'everyone',
          org: o._id
        }
      );//no need to assign user to this permission

      //followone permission
      await permissionService.create(
        {
          name: 'followone',
          org: o._id
        }
      );//no need to assign user to this permission

      //self permission
      await permissionService.create(
        {
          name: 'self',
          org: o._id
        }
      );//no need to assign user to this permission

      //each org admin role
      const admin = await roleService.create({
        name: 'admin',
        permissions: [
          {
            oid: administrators._id,
            path: administrators.path
          }
        ],
        org: o._id
      });

      //add admin to user
      roles.push({
        oid: admin._id,
        path: admin.path,
        org: {
          oid: o._id,
          path: o.path
        }
      });

      //add current user as admin and set current org for user
      await userService.patch(context.params.user._id, {
        roles:roles,
        current_org: o._id
      });
    }));

    return context;
  };
};
