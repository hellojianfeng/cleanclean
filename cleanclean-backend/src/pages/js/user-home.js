
const userOrgFind = require('../../APIs/js/user-org-find');
module.exports = async function (context) {

  //const pageData = context.data.data;
  const pageName = context.data.page;
  const action = context.data.action || 'open';
  const contextParser = require('../../APIs/js/context-parser');

  //const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  if (action === 'open'){
    const orgs = await userOrgFind(context);
    const orgList = Object.values(orgs);

    const result = {
      page: pageName,
      action: action,
      data: {
        user: user,
        orgs: orgList
      }
    };

    context.result = result;

    //remove user's current org
    //const userService = context.app.service('users');
    //await userService.patch(user._id, { current_org: null });
  }

  //provide orgs path with/without roles path for join
  /**
   * input format: [ { org: xxxx, roles: xxxx} , ....]
   */
  if (action === 'join-org'){

    const orgData = context.data.data || [];
    const user = context.params.user;
    const parser = contextParser.js;
    
    if (orgData){
      const results = [];
      if (!Array.isArray(orgData)){
        orgData = [orgData];
      }
      orgData.map ( o => {
        if (o.org){
          const org = await parser.getOrg(o.org);
          if (org && org._id){
            let roles = o.roles || [];
            roles = roles.map ( r => {
              if (r !== 'everyone'){
                return {
                  path: r,
                  org: org.path
                }
              }
            })
            //add everyone as default
            roles.push( { path: everyone, org: org.path });

            const roles = await parser.getRoles(roles);

            user.roles = user.roles.concat(roles.map( r => {
              return {
                oid: r._id,
                path: r.path,
                org_id: r.org_id,
                org_path: r.org_path
              }
            }));

            user.roles = _.uniqBy( user.roles, r => { return r.oid.toString(); });

            const patched = await userService.patch ( user._id, { roles: user.roles });

            if (patched){
              results.push ( { error: 0, message: 'add user roles successfully!', result: { user: user.email, roles: roles.map ( r => {
                return { path: r.path, org: r.org_path}
              })}})
            }
            
          } else {
            results.push( { error: 200, message: 'org is not valid, must exixt first!'});
          }
        } else {
          results.push( { error: 200, message: 'not find org data!'});
        }
      });
      context.result = results;
    } else {
      context.result = {
        error: 100,
        message: "not find valid org data!"
      }
    }
  }

  return context;
};

