// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const user = context.params.user;

    if(!user){
      throw new Error('user must be authenticated first!');
    }

    const service = context.service;
    const method = context.method;

    if(!user.current_org){
      throw new Error('current org is not found!');
    }
    const current_org = user.current_org;

    const allowPermissions = [];

    const jsonApiPermissions = require('../APIs/data/api-permission.json');

    if(jsonApiPermissions[service.name + '-' + method]){
      allowPermissions = jsonApiPermissions[service.name + '-' + method];
    }

    if(allowPermissions.length === 0 || allowPermissions.includes['everyone']){
      return context;
    }

    let isRoleChecked = false;

    //user can modify own data
    if(service.name === 'users'){
      if(context.id && context.id.equal(user._id)){
        isRoleChecked = true;
      }
    } else {
      //by default, only allow administrators to access below api method
      if(['create','update','patch','remove'].includes(method)){
        if(allowPermissions.indexOf('administrators') !== -1){
          allowPermissions.push('administrators');
        }
      }

      allowPermissions = await allowPermissions.map( async o => {
        await permissionService.find({
          query: {
            org: current_org,
            path: o
          }
        }).then(results => {
          if(results.total === 0){
            return results.data[0];
          }
        })
      })

      const roleService = context.app.service('roles');
      const userRoles = await user.roles.map( async o => {
        if(o.org.oid.equal(current_org)){
          return await roleService.get(o._id);
        }
      });

      const permissionService = context.app.service('permissions');
      await userRoles.map( async o => {
        o.permissions.map( p => {
          allowPermissions.map( ap => {
            if(ap._id.equal(p)){
              isRoleChecked = true;
            }
          })
        })
      })
    } 

    if(!isRoleChecked){
      throw new Error('api is not allow to access by permission!');
    }

    return context;
  };
};
