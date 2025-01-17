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
    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
      'connect-src': "'self' api.parse.com",
      'style-src': "'self' 'unsafe-inline'",
    },
    APP: {
      // Yabbit
      // applicationId: 'vNmHb7Gvkgji498TMTEARjDB2oRJhgDZb04I3hNW',
      // restApiId: '2I8w9D0u7GCp2dIhH7Vd1pRNaWG9yuhHn7LNXn1S'
      // Sandbox
      applicationId: 'kAPizP7WxU9vD8ndEHZd4w14HBDANxCYi5VQQGJ9',
      restApiId: '1wRXdgIGcnCPoeywMgdNQ7THSbMO7UxWZYdvlfJN'
    }
  };

  ENV['simple-auth'] = {
    //authorizer: 'authorizer:parse',
    authenticationRoute: 'session.login',
    routeIfAlreadyAuthenticated: 'patients.index',
    crossOriginWhitelist: ['https://api.parse.com'], // https://github.com/simplabs/ember-simple-auth/issues/495
    store: 'simple-auth-session-store:local-storage'
  }

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
