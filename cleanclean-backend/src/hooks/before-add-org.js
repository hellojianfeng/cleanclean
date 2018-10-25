// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const typeService = context.app.service("org-types");

    if(context.data.type){

      let type = {};

      if(typeof context.data.type === 'string'){
        type = { path: context.data.type };
        context.data.type = {};
      }

      const typeId = type._id || type.id || type.oid;

      return new Promise(function(resolve, reject){
        if( typeId ){
          return typeService.get(typeId).then(function(oType){
            console.log('oType', oType);
            context.data.type.oid = oType.id;
            return resolve(context);
          })
        }

        if(type.path){
          return typeService.find({query:{path:type.path}}).then(function(oTypes){
            console.log('oTypes', oTypes);
            if(oTypes && oTypes.total > 0){
              context.data.type.oid = oTypes.data[0]._id;
              console.log('context.data', context.data);
            }
            return resolve(context);
          })
        }
      })
    }
    return context;
  };
};
