const assert = require('assert');
const app = require('../../src/app');
let user;
const runService = app.service('run-operation');

describe('\'org-initialize\' operation', () => {

  beforeEach( async () => {
    //add user
    const userService = app.service('users');
    let finds = await userService.find({query:{email: 'user1@example.com'}});
    if (finds.total !== 1){
      await userService.create( { email: 'user1@example.com', password: 'secret' });
    }
    finds = await userService.find({query:{email: 'user1@example.com'}});
    user = finds.data[0];

    //create org
    const orgService = app.service('orgs');
    finds = await orgService.find({query:{path:'company1'}});
    if (finds.total !== 1){
      await orgService.create({ name: 'company1', type: 'company.clean'}, { user });
    }
    // finds = await orgService.find({query:{path:'company1'}});
    // org = finds.data[0];
    
  });

  it('runs org-initialize operation', async () => {
    
    const result  = await runService.create({operation: 'org-initialize',action: 'initialize'}, { user });

    assert.ok(result);
    
  });
});
