// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const typeService = context.app.service('org-types');

    //add type for org
    let orgs = [];
    if(!Array.isArray(context.data)){
      orgs.push(context.data);
    } else {
      orgs = orgs.concat(context.data);
    }
    for ( const org of orgs){
      if(org.type){
        let type = {};
        if(typeof org.type === 'string'){
          const path = org.type;
          type = { 
            path: path 
          };
          org.type = {};
        }
  
        const typeId = type._id || type.id || type.oid;

        if(typeId){
          const oType = await typeService.get(typeId);
          org.type.oid = oType.id;
          org.type.path = oType.path;
        }

        if(type.path){
          const finds = await typeService.find({query:{path:type.path}});
          if(finds && finds.total > 0){
            org.type.oid = finds.data[0]._id;
            org.type.path = finds.data[0].path;
          } else {
            type.name = type.path.slice(type.path.lastIndexOf('.')+1);
            await typeService.create(type).then( o => {
              org.type.oid = o._id;
              org.type.path = o.path;
            });
          }
        }
      }
    }
    
    return context;
  };
};
