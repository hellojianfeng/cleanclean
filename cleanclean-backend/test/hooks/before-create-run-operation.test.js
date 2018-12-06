const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const beforeCreateRunOperation = require('../../src/hooks/before-create-run-operation');

describe('\'before-create-run-operation\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      //after: beforeCreateRunOperation()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
