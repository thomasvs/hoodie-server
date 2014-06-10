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
  
  describe('mapProxyPath', function () {
    before(function () {
      plugin.internals.couchCfg = {
        url: 'http://couch.somewhere:1234'
      }
    });

    it('should prepend the couchCfg url', function () {
      plugin.internals.mapProxyPath({
        headers: {},
        url: {
          path: '/_api/some/path'
        }
      }, function (arg1, url) {
        expect(url).to.eql('http://couch.somewhere:1234/some/path');
      });
    });

    it('should pass the headers through', function () {
      plugin.internals.mapProxyPath({
        headers: {
          some: 'header'
        },
        url: {
          path: '/_api/some/path'
        }
      }, function (arg1, url, headers) {
        expect(headers.some).to.eql('header');
      });
    });

    it('should strip any cookies', function () {
      plugin.internals.mapProxyPath({
        headers: {
          some: 'header',
          cookie: 'strip-me'
        },
        url: {
          path: '/_api/some/path'
        }
      }, function (arg1, url, headers) {
        expect(headers.cookie).to.be.an('undefined');
      });
    });

    it('should move any bearer token to the cookie', function () {
      plugin.internals.mapProxyPath({
        headers: {
          some: 'header',
          cookie: 'strip-me',
          authorization: 'Bearer my-token'
        },
        url: {
          path: '/_api/some/path'
        }
      }, function (arg1, url, headers) {
        expect(headers.cookie).to.eql('AuthSession=my-token');
      });
    });
  });
});
  /*
  extractToken: function (cookieHeader) {
    return (/AuthSession=(.*); Version(.*)/).exec(cookieHeader[0])[1];
  },
  addCorsAndBearerToken: function (err, res, request, reply) {
    if (err) {
      reply(err).code(500);
      return;
    }
    nipple.read(res, function (err, body) {
      var data, resp;
      if (err) {
        reply(err).code(500);
        return;
      }
      data = JSON.parse(body);
      if (Array.isArray(res.headers['set-cookie'])) {
        data.authToken = internals.extractToken(res.headers['set-cookie']);
        delete res.headers['set-cookie'];
      }

      if (request.method === 'options') {
        res.statusCode = 200;
      }

      resp = reply(data).code(res.statusCode).hold();
      resp.headers = res.headers;
      
      resp.headers['Access-Control-Allow-Origin'] = request.headers.origin || '*';
      resp.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Length, Content-Type, If-Match, If-None-Match, Origin, X-Requested-With';
      resp.headers['Access-Control-Expose-Headers'] = 'Content-Type, Content-Length, ETag';
      resp.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE';
      resp.headers['Access-Control-Allow-Credentials'] = 'true';
      resp.send();
    });
  }
  */
