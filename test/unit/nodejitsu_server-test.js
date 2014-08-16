var Lab = require('lab');

var Hapi = require('hapi');
var server = new Hapi.Server();
var pack = server.pack;

Lab.experiment('Nodejitsu plugin', function() {

  pack.server(8888, {
    labels: ['nodejitsu'],
    cors: true
  });

  Lab.test('Plugin successfully registers', function(done) {

    pack.register({
      plugin: require('../../lib/server/plugins/nodejitsu'),
      options: {
        app: {},
        web: '',
        admin: ''
      }
    }, function (err) {
      Lab.expect(err).to.not.exist;

      done();

    });

  });

});

