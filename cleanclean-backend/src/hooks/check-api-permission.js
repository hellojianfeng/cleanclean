// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const user = context.params.user;

    const path = context.path;
    const method = context.method;

    const checkOrg1 = ['orgs','roles','operations','permissions'].includes(path) && ['update','patch','remove'].includes(method);

    const checkOrg2 = ['run-operation'].includes(path) && ['create','update','patch','remove'].includes(method);

    if(checkOrg1 || checkOrg2){
      if(!user){
        throw new Error('user must be authenticated first!');
      }
      if(!user.current_org){
        throw new Error('current org is not found!');
      }
      if(!context.data.org.equal(user.current_org)){
        throw new Error('user is not allowed to execute api from different org!');
      }
    }

    return context;
  };
};
