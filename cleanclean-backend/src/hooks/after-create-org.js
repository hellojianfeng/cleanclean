// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    //add admin role
    const roleService = context.app.service('roles');
    const userService = context.app.service('users');
    const operationService = context.app.service('operations');

    let orgs = [];

    if(Array.isArray(context.result)){
      orgs = context.result
    } else {
      orgs.push(context.result);
    }

    const roles = context.params.user.roles || [];

    await Promise.all(orgs.map( async o => {
      //each org admin role
      const admin = await roleService.create({
        name: 'admin',
        org: o._id
      });

      //add admin to user
      roles.push({
        role: {
          oid: admin._id
        },
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

      //add default initialize operation for org
      await operationService.create({
        name: "org-initialize",
        org: o._id,
        roles: [
          {
            oid: admin._id
          }
        ]
      });
    }))

    return context;
  };
};
