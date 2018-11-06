
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
module.exports = async function (context, options = {}) {

  const user = context.params.user;

  const orgService = context.app.service('orgs');
  const roleService = context.app.service('roles');

  const orgList = {};

  await Promise.all(user.roles.map ( async o => {
    const org = await orgService.get(o.org.oid);
    const role = await roleService.get(o.oid);

    let newOrg = org;
    if(orgList[org.path]){
      newOrg = orgList[org.path];
    }

    const roleList = newOrg.userRoles ? newOrg.userRoles : {};

    const userRole = {};
    userRole[role.path] = role;

    Object.assign(roleList, userRole);

    newOrg.userRoles = roleList;

    const oOrg = {};
    
    oOrg[newOrg.path] = newOrg;

    Object.assign(orgList, oOrg);

  }));

  context.result = orgList;

  return context;
};

