
/**
 * input format: 
 * [
 *  {
 *    org:{ path(or oid) of org },
 *    follow: {
 *      roles: [ path(or oid) of role ],
 *      permissions: [ path(or oid) of permission]
 *    }
 *  }
 * ]
 */
const JsonTools = require('../../utils/JsonTools.js');
const _ = require('underscore');
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');

  const orgService = context.app.service('orgs');
  const roleService = context.app.service('roles');
  const permissionService = context.app.service('permissions');

  const modelsParse = require('./models-parse');
  const orgFollowAdd = require('./org-follow-add');

  const inputData = options && options.follows || context && context.data && context.data.data && context.data.data.follows;

  const results = [];
  for (const f of inputData){
    const result = await orgFollowAdd(context, { follow: f });
    results.push(result);
  }

  return context.result = results;
};

