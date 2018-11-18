
/**
 * input format: 
 * {
 *    one of {
 *      org: org object with _id or path or both, or oid
 *      org is string for id or path
 *    }
 * }
 * 
 * result array of children orgs
 */
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');

  const orgService = context.app.service('orgs');

  let org = null;

  let orgData = null;

  if (context.data.data && context.data.data.org){
    orgData = context.data.data.org;
  }

  if (options.org){
    orgData = context.data.org;
  }

  if (orgData && typeof orgData === 'object'){
    if (orgData._id && orgData.path){
      org = orgData;
    }

    if(!org && orgData.oid){
      org = await orgService.get(orgData.oid);
    }

    if(!org && orgData.path){
      const finds =  await orgService.find({query: { path: orgData.path }});
      if (finds.total === 1){
        org = finds.data[0];
      }
    }
  }

  if (!org && typeof orgData === 'string'){
    const finds =  await orgService.find({query: { path: orgData }});
    if (finds.total === 1){
      org = finds.data[0];
    }
  }

  if (!org){
    throw new Error('api org-children-find: no valid org!');
  }
  
  if(!org && context && context.params && context.params.user && context.params.user.current_org){
    org = await orgService.get(context.params.user.current_org);
  } 

  if (!org){
    throw new Error('no valid org!');
  }

  const childrenMatch = new RegExp('^'+org.path+'#');

  const finds = await orgService.find({
    query: {
      path: childrenMatch
    }
  });

  context.result = {
    api: 'org-children-find',
    result: finds.data
  };

  return finds.data;
};

