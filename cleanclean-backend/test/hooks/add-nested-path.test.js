const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const addNestedPath = require('../../src/hooks/add-nested-path');

describe('\'add-nested-path\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy1', {
      async create(data,params) {
        return data;
      }
    });

    app.service('dummy1').hooks({
      before: addNestedPath()
    });

  });

  it('runs the hook', async () => {
    const result1 = await app.service('dummy1').create({ name: 'name1'});
    
    assert.deepEqual(result1, { name: 'name1', path: 'name1' });

    const result2 = await app.service('dummy1').create({ name: 'name2', path: 'path2.name2'});
    
    assert.deepEqual(result2, { name: 'name2', path: 'path2.name2' });
    
  });
});
