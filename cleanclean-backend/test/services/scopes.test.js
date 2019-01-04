const assert = require('assert');
const app = require('../../src/app');

describe('\'scopes\' service', () => {
  it('registered the service', () => {
    const service = app.service('scopes');

    assert.ok(service, 'Registered the service');
  });
});
