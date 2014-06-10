var expect = require('expect.js');
var plugin = require('../../lib/server/plugins/api/index');

var _ = require('lodash');

describe('api plugin', function () {

  it('should expose n number of properties', function () {
    expect(_.size(plugin)).to.eql(2);
  });

  it('should export its internals (so we can test them here)', function () {
    expect(plugin.internals).to.be.an(Object);
  });

  it('should export a register function', function () {
    expect(plugin.register).to.be.an(Function);
  });

});
