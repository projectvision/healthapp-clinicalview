/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'yabbit',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    }
  };

  ENV['ember-parse'] = {
    PARSE_APPLICATION_ID: 'vNmHb7Gvkgji498TMTEARjDB2oRJhgDZb04I3hNW',
    PARSE_JAVASCRIPT_KEY: '2I8w9D0u7GCp2dIhH7Vd1pRNaWG9yuhHn7LNXn1S',
    session: {
      authenticationRoute: 'index',
      ifAlreadyAuthenticatedRoute: 'patients'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
