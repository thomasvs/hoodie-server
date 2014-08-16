var expect = require('expect.js');

var Hapi = require('hapi');
var server = new Hapi.Server();
var pack = server.pack;

describe('Nodejitsu plugin', function() {

  pack.server(8888, {
    labels: ['nodejitsu'],
    cors: true
  });

  it('Plugin successfully registers', function(done) {

    pack.register({
      plugin: require('../../lib/server/plugins/nodejitsu'),
      options: {
        app: {},
        web: '',
        admin: ''
      }
    }, function (err) {
      expect(err).to.not.exist;

      done();

    });

  });

});

