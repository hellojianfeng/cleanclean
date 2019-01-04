// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    return context;

    if (context.data.to && context.data.from){
      scopeService.find(context.data.to)
      .then( results => {
        if (results.total < 1){
          return scopeService.create(context.data.to);
        } else {
          return Promise.resolve(results.data[0]);
        }
      })
      .then ( result  => {
        context.service.emit( 'notify'+'_'+result._id, { type: 'notification', data: context.data});
      })

    }
  };
};
