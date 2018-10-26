// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    //add admin role
    const roleService = context.app.service("roles");
    const userService = context.app.service("users");
    const adminData = await roleService.create({
      name: "admin",
      org: {
        oid: context.id
      }
    });

    //add current user as admin
    const user = context.result.userId;
    await userService.update(context.result.userId,{
      roles: [
        {
          role: {
            oid: adminData.id
          },
          org: {
            oid: context.id,
            name: context.data.name
          }
        }]
    });

    return context;
  };
};
