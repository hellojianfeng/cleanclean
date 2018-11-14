
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const result = {
    title: 'User Home'
  };

  
  context.result = result;

  return context.result;
};

