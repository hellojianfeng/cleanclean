// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const objectHash = require('object-hash');
const channelHelper = require('../APIs/js/channel-helper');
module.exports = function (options = {}) {
  return async context => {
    const channelService = context.app.service('channels');
    if (context.data.to_scope && context.data.from_scope){
      const to_scope = channelHelper.formatScope(context.data.to_scope);
      const from_scope = channelHelper.formatScope(context.data.from_scope);
      const to_scope = channelHelper.filterScopeByAllow(context.data.to_scope);
      if (!Array.isArray(to_scope) || to_scope.length <= 0){
        context.result = Object.assign(context.result, { 'create_channel_to_scope_error':"no allow to_scopes to find!"});
      }
      const to_hash = objectHash(to_scope);
      const from_hash = objectHash(from_scope);
      const results = await channelService.find({query: { to_hash, from_hash }});
      let channels = [];
      if (results.total < 1){
          const created = await channelService.create({type:'notify',from_scope, to_scope});
          channels.push(created);
        }
      } else {
        channels = channels.concat(results.data);
      }
      context.service.emit( 'notify_' + channels[0].channel_id, { type: 'notification', data: context.data});
      return context;
    }
  };
