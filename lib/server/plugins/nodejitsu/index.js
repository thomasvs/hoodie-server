exports.register = function (plugin, options, next) {

  var env_config = options.app.env_config;

  var internals = {
    mapProxyPath: function (req, cb) {
      var host = req.headers.host;
      var subdomain = host.split('.')[0];
      var target = 'http://' + env_config.host + ':';

      if (subdomain === 'admin') {
        target += env_config.admin_port;
      } else if (subdomain === 'couch') {
        target = env_config.couch.url;
      } else {
        target += env_config.www_port;
      }

      cb(null, target + req.url.path);
    }

  };

  plugin.select('nodejitsu').route([{
    path: '/{p*}',
    method: '*',
    handler: {
      proxy: {
        passThrough: true,
        mapUri: internals.mapProxyPath
      }
    }
  }]);

  return next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};

