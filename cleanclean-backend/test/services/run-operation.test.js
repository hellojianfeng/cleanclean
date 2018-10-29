const assert = require('assert');
const app = require('../../src/app');

describe('\'run-operation\' service', () => {
  it('registered the service', () => {
    const service = app.service('run-operation');

    assert.ok(service, 'Registered the service');
  });
});
