// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (seprator = '.') {
  return async context => {
    const { data } = context;

    if(Array.isArray(data)){
      let items = data.filter( item => {
        if(!item.name) {
          return false;
        }
        return true;
      });
      context.data = items.map( o => {
        if(!o.path){
          o.path = o.name;
        }
        // else {
        //   const lastName = o.path.split(seprator).pop();
        //   if (lastName !== o.name){
        //     o.path = o.path.replace(lastName,o.name);
        //   }
        // }
        return o;
      });
    } else {
      if(!data.name){
        throw new Error('must have a name');
      }
      if(!data.path){
        data.path = data.name;
      } else {
        const lastName = data.path.split(seprator).pop();
        if (lastName !== data.name){
          data.path = data.path.replace(lastName,data.name);
        }
      }
      context.data = data;
    }

    return context;
  };
};
