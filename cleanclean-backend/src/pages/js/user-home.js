
/**

 */
const userOrgFind = require('../../APIs/js/user-org-find');
module.exports = async function (context, options = {}) {

  const pageData = context.data.data;
  const pageName = context.data.page;
  const action = context.data.action || 'open';

  const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  if (action === 'open'){
    const orgs = await userOrgFind(context);
    const orgList = Object.values(orgs);

    const result = {
      page: pageName,
      action: action,
      user: user,
      orgs: orgList
    };

    context.result = result;

    //remove user's current org
    const userService = context.app.service('users');
    await userService.patch(user._id, { current_org: null });
  }

  return context;
};

