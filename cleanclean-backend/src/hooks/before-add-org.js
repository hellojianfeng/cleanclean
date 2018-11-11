// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const typeService = context.app.service('org-types');

    //add type for org
    if(context.data.type){

      let type = {};

      if(typeof context.data.type === 'string'){
        const path = context.data.type;
        type = { 
          path: path 
        };
        context.data.type = {};
      }

      const typeId = type._id || type.id || type.oid;

      return new Promise(function(resolve){
        if( typeId ){
          return typeService.get(typeId).then(function(oType){
            if(oType && oType.id){
              context.data.type.oid = oType.id;
            }
            return resolve(context);
          });
        }

        if(type.path){
          return typeService.find({query:{path:type.path}}).then(function(oTypes){
            if(oTypes && oTypes.total > 0){
              context.data.type.oid = oTypes.data[0]._id;
              return resolve(context);
            } else {
              type.name = type.path.slice(type.path.lastIndexOf('.')+1);
              return typeService.create(type).then( o => {
                context.data.type.oid = o._id;
                return resolve(context);
              });
            }
          });
        }
      });
    }
    return context;
  };
};
