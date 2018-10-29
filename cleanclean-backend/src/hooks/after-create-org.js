// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    //add admin role
    const roleService = context.app.service('roles');
    const userService = context.app.service('users');
    const operationService = context.app.service('operations');

    //each org have four default roles: everyone, member, admin and public
    const admin = await roleService.create({
      name: 'admin',
      org: context.result._id
    });

    //console.log('context',context);
    //console.log('admin',admin);

    const roles = context.params.user.roles || [];

    roles.push({
      role: {
        oid: admin._id
      },
      org: {
        oid: context.result._id,
        path: context.result.path
      }
    });

    //add current user as admin and set current org for user
    await userService.patch(context.params.user._id, {
      roles:roles,
      current_org: context.result._id
    });

    //add default initialize operation for org
    await operationService.create({
      name: "org-initialize",
      org: context.result._id,
      roles: [
        {
          oid: admin._id
        }
      ]
    });

    return context;
  };
};
