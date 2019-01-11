// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const objectHash = require('object-hash');
const _ = require('underscore');
module.exports = function (options = {}) {
  return async context => {
    if (context.data.to_scope){
      context.data.to_hash = objectHash(context.data.to_scope);
    }
    if (context.data.from_scope){
      context.data.from_hash = objectHash(context.data.to_scope);
    }
    context.data.channel_id = _.uniqueId();
    return context;
  };
};
