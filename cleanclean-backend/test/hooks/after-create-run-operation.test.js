const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const afterCreateOperationProcess = require('../../src/hooks/after-create-run-operation');

describe('\'after-create-operation-process\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: afterCreateOperationProcess()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
