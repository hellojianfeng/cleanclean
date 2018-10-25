// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (seprator = ".") {
  return async context => {
    const { data } = context;

    // Throw an error if we didn't get a text
    if(!data.name) {
      throw new Error('must have a name');
    }

    if(!data.path){
      context.data.path = data.name;
    } else {
      const lastName = data.path.split(seprator).pop();
      if (lastName !== data.name){
        context.data.path = data.path.replace(lastName,data.name);
      }
    }

    return context;
  };
};
