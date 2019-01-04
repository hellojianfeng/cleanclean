
module.exports = async function (context, options = {}) {

    //const operationData = context.data.data || {};
    //const operation = options.current_operation;
    const action = context.data.action || 'open';
    //const contextParser = require('../../../APIs/js/operation-context-parse')(context,options);
    const contextParser = require('../../../APIs/js/context-parser');
    const findUserRoles = require('../../../APIs/js/user-role-find');
    const buildOperationResult = require('../../../APIs/js/build-operation-result');
    const _ = require('lodash');
  
    //const mongooseClient = context.app.get('mongooseClient');
    const userService = context.app.service('users');
  
    //open action return org role list with operations and permissions
    if (action === 'open'){
  
      const result = {};
  
    }
  
    //if not provide role for user, use everyone role
    /**
     * input: 
     */
    if (action === 'add-operation-roles'){
        const result = {};
    }

    if (action === 'add-operation-permissions'){
        const result = {};
    }

    if(action === 'add-operation-users'){
        const result = {};
       
    }
  

  
    return context;
  };
  
  