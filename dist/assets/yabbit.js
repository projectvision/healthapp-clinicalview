"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('yabbit/adapters/application', ['exports', 'ember-parse-adapter/adapters/application'], function (exports, adapter) {

	'use strict';

	exports['default'] = adapter['default'];

});
define('yabbit/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'yabbit/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('yabbit/authenticators/parse', ['exports', 'ember', 'simple-auth/authenticators/base', 'ember-parse-adapter/models/parse-user'], function (exports, Ember, Base, ParseUser) {

  'use strict';

  exports['default'] = Base['default'].extend({

    /****************************************************************************
    /* PROPERTIES
    /***************************************************************************/

    db: Ember['default'].inject.service('store'),

    /****************************************************************************
    /* ACTIONS
    /***************************************************************************/

    //restore: function(data) {
    //  return new Ember.RSVP.Promise(function(resolve, reject) {
    //    console.log('restore');
    //    console.log(data);

    //    if (!Ember.isEmpty(data.sessionToken)) {
    //      console.log('sdf');
    //      adapter = this.get('db').adapterFor('parse-user');
    //      adapter.set('sessionToken', data.sessionToken);

    //      var useruser = ParseUser.current().then(function(user) {
    //        console.log('ParseUser.current() was returned');
    //        return {
    //          userId: user.get('id'),
    //          sessionToken: user.get('sessionToken'),
    //          email: user.get('email'),
    //          firstName: user.get('firstName'),
    //          lastName: user.get('lastName')
    //        };
    //      });

    //      resolve(useruser);
    //    } else {
    //      reject();
    //    }
    //  });
    //},

    restore: function restore(data) {

      var store = this.get('db');
      var adapter = store.adapterFor('parse-user');

      if (!data.sessionToken) {
        return {};
      }

      // Set session token
      adapter.set('sessionToken', data.sessionToken);

      // Get current user
      return store.modelFor('parse-user').current(store).then(function (user) {
        return {
          userId: user.get('id'),
          sessionToken: user.get('sessionToken'),
          email: user.get('email'),
          firstName: user.get('firstName'),
          lastName: user.get('lastName')
        };
      });
    },

    /* Authenticate - used by the login controller to login the user */
    authenticate: function authenticate(data) {

      // Get parse adapter and user login details
      var adapter = this.get('db').adapterFor('parse-user');
      var user = data.user;

      // Rename ember simple auth "identification" to parse "username"
      if (data.identification) {
        data.username = data.identification;
      }

      // Handle previously logged in user
      if (user) {
        adapter.set('sessionToken', user.get('sessionToken'));
        data = {
          userId: user.get('id'),
          sessionToken: user.get('sessionToken'),
          email: user.get('email'),
          firstName: user.get('firstName'),
          lastName: user.get('lastName')
        };
        return Ember['default'].RSVP.resolve(data);
      }
      // Authenticate user
      else {
          return this.get('db').modelFor('parse-user').login(this.get('db'), data).then(function (user) {
            // set the session up with parse response
            adapter.set('sessionToken', user.get('sessionToken'));
            data = {
              userId: user.get('id'),
              sessionToken: user.get('sessionToken'),
              email: user.get('email'),
              firstName: user.get('firstName'),
              lastName: user.get('lastName')
            };
            return data;
          });
        }
    },

    invalidate: function invalidate() {

      var adapter = this.get('db').adapterFor('parse-user');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        adapter.set('sessionToken', null);
        return resolve(); // https://github.com/simplabs/ember-simple-auth/issues/663
      });
    }
  });

});
define('yabbit/authorizers/parse', ['exports', 'simple-auth/authorizers/base'], function (exports, Base) {

  'use strict';

  exports['default'] = Base['default'].extend({
    authorize: function authorize(jqXHR, requestOptions) {
      console.log('authorizer 2');
      console.log(jqXHR);
      console.log(requestOptions);
      //if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.secure.token'))) {
      //  jqXHR.setRequestHeader('Authorization', 'X-Parse-Session-Token:' + this.get('session.secure.token'));
      //}
    }
  });

});
define('yabbit/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'yabbit/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('yabbit/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('yabbit/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('yabbit/controllers/patients/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    //isCorrectRouteActive: Ember.computed.equal('currentRouteName', 'currentRouteName')
  });

});
define('yabbit/controllers/patients/index/show', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('yabbit/controllers/session/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    /****************************************************************************
    /* PROPERTIES
    /***************************************************************************/

    identification: "maediprichard@gmail.com", // email
    password: "m",
    message: null,

    /****************************************************************************
    /* ACTIONS
    /***************************************************************************/

    actions: {
      authenticate: function authenticate() {

        // Get controller and user details
        var controller = this;
        var data = this.getProperties('identification', 'password');

        // Authenticate with parse
        controller.get('session').authenticate('authenticator:parse', data).then(function (response) {

          //console.log('session.isAuthenticated');
          //console.log(controller.get('session.isAuthenticated'));

          // redirect physician to their patients
          controller.transitionToRoute('patients.index');
        },
        // Handle errors
        function (error) {
          // show message to the user
          controller.set('message', error.message || error.error);
          console.log(error);
        });
      }
    }
  });

});
define('yabbit/controllers/session/signup', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(EmberValidations['default'], {

    email: null,
    password: null,
    passwordConfirmation: null,
    loggedIn: false,
    message: null,

    validations: {
      password: {
        presence: { message: 'password required' },
        length: { minimum: 5 },
        confirmation: true
      },
      passwordConfirmation: {
        presence: { message: 'please confirm password' }
      }
    },

    actions: {
      signup: function signup() {

        // Build User

        var user = this.store.modelFor('parse-user');
        var data = {
          email: this.get('email'),
          username: this.get('email'),
          password: this.get('password')
        };

        // Save User

        var controller = this;

        user.signup(this.store, data).then(function (user) {
          controller.set('loggedIn', true);
          controller.set('message', 'You are now signed up!');
        }, function (error) {
          console.log(error);
          controller.set('loggedIn', false);
          controller.set('message', error || error.message);
        });
      }
    }
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/adapters/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter/adapters');
  QUnit.test('modules/ember-parse-adapter/adapters/application.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/adapters/application.js should pass jshint.');
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/file.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter');
  QUnit.test('modules/ember-parse-adapter/file.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/file.js should pass jshint.');
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/geopoint.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter');
  QUnit.test('modules/ember-parse-adapter/geopoint.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/geopoint.js should pass jshint.');
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/initializers/initialize.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter/initializers');
  QUnit.test('modules/ember-parse-adapter/initializers/initialize.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/initializers/initialize.js should pass jshint.');
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/models/parse-user.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter/models');
  QUnit.test('modules/ember-parse-adapter/models/parse-user.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/models/parse-user.js should pass jshint.');
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/serializers/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter/serializers');
  QUnit.test('modules/ember-parse-adapter/serializers/application.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/serializers/application.js should pass jshint.');
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/transforms/date.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter/transforms');
  QUnit.test('modules/ember-parse-adapter/transforms/date.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/transforms/date.js should pass jshint.');
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/transforms/file.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter/transforms');
  QUnit.test('modules/ember-parse-adapter/transforms/file.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/transforms/file.js should pass jshint.');
  });

});
define('yabbit/ember-parse-adapter/tests/modules/ember-parse-adapter/transforms/geopoint.jshint', function () {

  'use strict';

  QUnit.module('JSHint - modules/ember-parse-adapter/transforms');
  QUnit.test('modules/ember-parse-adapter/transforms/geopoint.js should pass jshint', function (assert) {
    assert.ok(true, 'modules/ember-parse-adapter/transforms/geopoint.js should pass jshint.');
  });

});
define('yabbit/file', ['exports', 'ember-parse-adapter/file'], function (exports, file) {

	'use strict';

	exports['default'] = file['default'];

});
define('yabbit/geopoint', ['exports', 'ember-parse-adapter/geopoint'], function (exports, geopoint) {

	'use strict';

	exports['default'] = geopoint['default'];

});
define('yabbit/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'yabbit/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('yabbit/initializers/export-application-global', ['exports', 'ember', 'yabbit/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('yabbit/initializers/initialize', ['exports', 'ember-parse-adapter/initializers/initialize'], function (exports, initializer) {

  'use strict';

  exports['default'] = {
    name: 'ember-parse-adapter',

    after: 'ember-data',

    initialize: initializer['default']
  };

});
define('yabbit/initializers/simple-auth', ['exports', 'simple-auth/configuration', 'simple-auth/setup', 'yabbit/config/environment'], function (exports, Configuration, setup, ENV) {

  'use strict';

  exports['default'] = {
    name: 'simple-auth',
    initialize: function initialize(container, application) {
      Configuration['default'].load(container, ENV['default']['simple-auth'] || {});
      setup['default'](container, application);
    }
  };

});
define('yabbit/models/parse-user', ['exports', 'ember', 'ember-parse-adapter/models/parse-user'], function (exports, Ember, ParseUser) {

  'use strict';

  ParseUser['default'].reopenClass({

    /****************************************************************************
    /* ACTIONS
    /***************************************************************************/

    /* Current User - called by 'authenticators/parse.js' */
    current: function current(store) {

      // Get adapter and serializer
      var adapter = store.adapterFor('parse-user');
      var serializer = store.serializerFor('parse-user');

      return adapter.ajax(adapter.buildURL("parse-user", "me"), "GET", {}).then(function (user) {
        return store.push({
          data: {
            id: user.objectId,
            type: 'parse-user',
            attributes: {
              sessionToken: user.sessionToken,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            }
          }
        });
      });
    }
  });

  exports['default'] = ParseUser['default'];

});
define('yabbit/models/patient', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    physician: DS['default'].belongsTo('physician', { async: true })
  });

});
define('yabbit/router', ['exports', 'ember', 'yabbit/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {

    this.route('session', function () {
      this.route('login');
      this.route('signup');
    });

    this.route('patients', function () {
      this.route('index', function () {
        this.route('show', { path: ':id' });
      });
    });
  });

  exports['default'] = Router;

});
define('yabbit/routes/application', ['exports', 'ember', 'simple-auth/mixins/application-route-mixin'], function (exports, Ember, ApplicationRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(ApplicationRouteMixin['default']);

});
define('yabbit/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      this.transitionTo('session.login');
    }
  });

});
define('yabbit/routes/patients/index', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    renderTemplate: function renderTemplate() {
      this.render({
        outlet: 'master'
      });
    },
    actions: {
      //didTransition: function() {
      //  console.log('routeName: ' + this.routeName);
      //  return true; // Bubble the didTransition event
      //}
    },
    model: function model(params) {
      //return this.modelFor('patient').findBy('id', params.patient_id);
      return [{
        "patientId": 123456789,
        "firstName": "John",
        "lastName": "Doe",
        "alerts": false,
        "challengeCompletion": {
          "fitness": 90,
          "diet": 65,
          "stress": 75
        },
        "healthRisk": {
          "status": "Low",
          "change": false
        },
        "activityLevel": {
          "status": "Moderate Exercise",
          "change": "up"
        }
      }, {
        "patientId": 987654321,
        "firstName": "Miguel",
        "lastName": "Ferrara",
        "alerts": ["overweight"],
        "challengeCompletion": {
          "fitness": 50,
          "diet": 40,
          "stress": 66
        },
        "healthRisk": {
          "status": "Warning",
          "change": "up"
        },
        "activityLevel": {
          "status": "Sedentary",
          "change": "down"
        }
      }, {
        "patientId": 76764565643,
        "firstName": "Marlon",
        "lastName": "Jones",
        "alerts": false,
        "challengeCompletion": {
          "fitness": 50,
          "diet": 15,
          "stress": 95
        },
        "healthRisk": {
          "status": "Low",
          "change": false
        },
        "activityLevel": {
          "status": "Moderate Exercise",
          "change": "up"
        }
      }];
    }
  });

});
define('yabbit/routes/patients/index/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    renderTemplate: function renderTemplate() {
      this.render({
        outlet: 'detail'
      });
    },
    model: function model(params) {
      return this.modelFor('patients.index').findBy('patientId', parseInt(params.id));
    }
  });

});
define('yabbit/routes/session/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function beforeModel(transition) {
      if (this.get('session.isAuthenticated')) {
        this.transitionTo('patients.index');
      }
    }
  });

});
define('yabbit/routes/session/signup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    //model: function() {
    //  return this.get('store').createRecord('parse-user');
    //}
  });

});
define('yabbit/serializers/application', ['exports', 'ember-parse-adapter/serializers/application'], function (exports, serializer) {

	'use strict';

	exports['default'] = serializer['default'];

});
define('yabbit/services/validations', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var set = Ember['default'].set;

  exports['default'] = Ember['default'].Service.extend({
    init: function init() {
      set(this, 'cache', {});
    }
  });

});
define('yabbit/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 4
            },
            "end": {
              "line": 4,
              "column": 62
            }
          },
          "moduleName": "yabbit/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"id","logo");
          dom.setAttribute(el1,"src","assets/logo.png");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 10
            },
            "end": {
              "line": 11,
              "column": 10
            }
          },
          "moduleName": "yabbit/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createElement("a");
          var el3 = dom.createTextNode("Logout");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1, 0]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [
          ["element","action",["invalidateSession"],[],["loc",[null,[10,19],[10,49]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 10
            },
            "end": {
              "line": 13,
              "column": 10
            }
          },
          "moduleName": "yabbit/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createElement("a");
          var el3 = dom.createTextNode("Login");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 0]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [
          ["element","action",["sessionRequiresAuthentication"],[],["loc",[null,[12,19],[12,61]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 25,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"id","user");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"id","user-icon");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Help");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","main");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element2,1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element2, [3, 1, 2]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],[],0,null,["loc",[null,[4,4],[4,74]]]],
        ["block","if",[["get","session.isAuthenticated",["loc",[null,[9,16],[9,39]]]]],[],1,2,["loc",[null,[9,10],[13,17]]]],
        ["content","outlet",["loc",[null,[23,2],[23,12]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('yabbit/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[1,0],[1,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('yabbit/templates/patients', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/patients.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","patients");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        return morphs;
      },
      statements: [
        ["inline","outlet",["master"],[],["loc",[null,[2,2],[2,21]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('yabbit/templates/patients/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 8
              },
              "end": {
                "line": 5,
                "column": 102
              }
            },
            "moduleName": "yabbit/templates/patients/index.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(" ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
            morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [
            ["content","patient.firstName",["loc",[null,[5,60],[5,81]]]],
            ["content","patient.lastName",["loc",[null,[5,82],[5,102]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 4
            },
            "end": {
              "line": 7,
              "column": 4
            }
          },
          "moduleName": "yabbit/templates/patients/index.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["block","link-to",["patients.index.show",["get","patient.patientId",["loc",[null,[5,41],[5,58]]]]],[],0,null,["loc",[null,[5,8],[5,114]]]]
        ],
        locals: ["patient"],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 4
            },
            "end": {
              "line": 9,
              "column": 4
            }
          },
          "moduleName": "yabbit/templates/patients/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("Empty");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 21,
              "column": 6
            },
            "end": {
              "line": 35,
              "column": 6
            }
          },
          "moduleName": "yabbit/templates/patients/index.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","bar fitness");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("%");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","bar diet");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("%");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","bar stress");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("%");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element1, [3]);
          var element4 = dom.childAt(element1, [5]);
          var morphs = new Array(8);
          morphs[0] = dom.createAttrMorph(element2, 'style');
          morphs[1] = dom.createMorphAt(element2,0,0);
          morphs[2] = dom.createAttrMorph(element3, 'style');
          morphs[3] = dom.createMorphAt(element3,0,0);
          morphs[4] = dom.createAttrMorph(element4, 'style');
          morphs[5] = dom.createMorphAt(element4,0,0);
          morphs[6] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
          morphs[7] = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
          return morphs;
        },
        statements: [
          ["attribute","style",["concat",["width: ",["get","patient.challengeCompletion.fitness",["loc",[null,[24,53],[24,88]]]],"%"]]],
          ["content","patient.challengeCompletion.fitness",["loc",[null,[24,93],[24,132]]]],
          ["attribute","style",["concat",["width: ",["get","patient.challengeCompletion.diet",["loc",[null,[25,50],[25,82]]]],"%"]]],
          ["content","patient.challengeCompletion.diet",["loc",[null,[25,87],[25,123]]]],
          ["attribute","style",["concat",["width: ",["get","patient.challengeCompletion.stress",["loc",[null,[26,52],[26,86]]]],"%"]]],
          ["content","patient.challengeCompletion.stress",["loc",[null,[26,91],[26,129]]]],
          ["content","patient.healthRisk.status",["loc",[null,[29,12],[29,41]]]],
          ["content","patient.activityLevel.status",["loc",[null,[32,12],[32,44]]]]
        ],
        locals: ["patient"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 41,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/patients/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("aside");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","patients-overview");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("table");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("thead");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4,"class","challenge-completion");
        var el5 = dom.createTextNode("Challenge Completion");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4,"class","health-risk");
        var el5 = dom.createTextNode("Health Risk");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4,"class","activity-level");
        var el5 = dom.createTextNode("Activity Level");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    \n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tbody");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 1, 3]),1,1);
        morphs[2] = dom.createMorphAt(fragment,4,4,contextualElement);
        return morphs;
      },
      statements: [
        ["block","each",[["get","model",["loc",[null,[3,12],[3,17]]]]],[],0,1,["loc",[null,[3,4],[9,13]]]],
        ["block","each",[["get","model",["loc",[null,[21,14],[21,19]]]]],[],2,null,["loc",[null,[21,6],[35,15]]]],
        ["inline","outlet",["detail"],[],["loc",[null,[40,0],[40,19]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('yabbit/templates/patients/index/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 0
            },
            "end": {
              "line": 28,
              "column": 66
            }
          },
          "moduleName": "yabbit/templates/patients/index/show.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("View All");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 29,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/patients/index/show.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","patient");
        dom.setAttribute(el1,"class","pane");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("table");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("thead");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4,"class","challenge-completion");
        var el5 = dom.createTextNode("Challenge Completion");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4,"class","health-risk");
        var el5 = dom.createTextNode("Health Risk");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4,"class","activity-level");
        var el5 = dom.createTextNode("Activity Level");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tbody");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","bar fitness");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("%");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","bar diet");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("%");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","bar stress");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("%");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 3, 1]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var element4 = dom.childAt(element1, [5]);
        var morphs = new Array(9);
        morphs[0] = dom.createAttrMorph(element2, 'style');
        morphs[1] = dom.createMorphAt(element2,0,0);
        morphs[2] = dom.createAttrMorph(element3, 'style');
        morphs[3] = dom.createMorphAt(element3,0,0);
        morphs[4] = dom.createAttrMorph(element4, 'style');
        morphs[5] = dom.createMorphAt(element4,0,0);
        morphs[6] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        morphs[7] = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        morphs[8] = dom.createMorphAt(fragment,2,2,contextualElement);
        return morphs;
      },
      statements: [
        ["attribute","style",["concat",["width: ",["get","model.challengeCompletion.fitness",["loc",[null,[12,51],[12,84]]]],"%"]]],
        ["content","model.challengeCompletion.fitness",["loc",[null,[12,89],[12,126]]]],
        ["attribute","style",["concat",["width: ",["get","model.challengeCompletion.diet",["loc",[null,[13,48],[13,78]]]],"%"]]],
        ["content","model.challengeCompletion.diet",["loc",[null,[13,83],[13,117]]]],
        ["attribute","style",["concat",["width: ",["get","model.challengeCompletion.stress",["loc",[null,[14,50],[14,82]]]],"%"]]],
        ["content","model.challengeCompletion.stress",["loc",[null,[14,87],[14,123]]]],
        ["content","model.healthRisk.status",["loc",[null,[17,10],[17,37]]]],
        ["content","model.activityLevel.status",["loc",[null,[20,10],[20,40]]]],
        ["block","link-to",["patients.index"],["id","view-all","class","button"],0,null,["loc",[null,[28,0],[28,78]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('yabbit/templates/session', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 4
            },
            "end": {
              "line": 3,
              "column": 48
            }
          },
          "moduleName": "yabbit/templates/session.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Login");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 4
            },
            "end": {
              "line": 4,
              "column": 51
            }
          },
          "moduleName": "yabbit/templates/session.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Signup");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/session.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","session");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","tabs");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element1,1,1);
        morphs[1] = dom.createMorphAt(element1,3,3);
        morphs[2] = dom.createMorphAt(element0,3,3);
        return morphs;
      },
      statements: [
        ["block","link-to",["session.login"],["id","login"],0,null,["loc",[null,[3,4],[3,60]]]],
        ["block","link-to",["session.signup"],["id","signup"],1,null,["loc",[null,[4,4],[4,63]]]],
        ["content","outlet",["loc",[null,[6,2],[6,12]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('yabbit/templates/session/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "yabbit/templates/session/login.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","message");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["content","message",["loc",[null,[3,4],[3,15]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/session/login.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","submit");
        var el3 = dom.createTextNode("Login");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [5]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(element0,1,1);
        morphs[2] = dom.createMorphAt(element0,3,3);
        morphs[3] = dom.createElementMorph(element1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","message",["loc",[null,[1,6],[1,13]]]]],[],0,null,["loc",[null,[1,0],[5,7]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","identification",["loc",[null,[8,16],[8,30]]]]],[],[]],"id","identification","placeholder","Email"],["loc",[null,[8,2],[8,72]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","password",["loc",[null,[9,16],[9,24]]]]],[],[]],"id","password","placeholder","Password"],["loc",[null,[9,2],[9,63]]]],
        ["element","action",["authenticate"],[],["loc",[null,[11,24],[11,49]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('yabbit/templates/session/signup', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "yabbit/templates/session/signup.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","message");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["content","message",["loc",[null,[3,4],[3,15]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/session/signup.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","submit");
        var el3 = dom.createTextNode("Signup");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [7]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(element0,1,1);
        morphs[2] = dom.createMorphAt(element0,3,3);
        morphs[3] = dom.createMorphAt(element0,5,5);
        morphs[4] = dom.createElementMorph(element1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","message",["loc",[null,[1,6],[1,13]]]]],[],0,null,["loc",[null,[1,0],[5,7]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","email",["loc",[null,[8,16],[8,21]]]]],[],[]],"id","email","placeholder","Email"],["loc",[null,[8,2],[8,54]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","password",["loc",[null,[9,16],[9,24]]]]],[],[]],"id","password","placeholder","Password"],["loc",[null,[9,2],[9,63]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","passwordConfirmation",["loc",[null,[10,16],[10,36]]]]],[],[]],"id","password-confirmation","placeholder","Confirm Password"],["loc",[null,[10,2],[10,96]]]],
        ["element","action",["signup"],[],["loc",[null,[12,24],[12,43]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('yabbit/tests/adapters/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('yabbit/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('yabbit/tests/authenticators/parse.jshint', function () {

  'use strict';

  QUnit.module('JSHint - authenticators');
  QUnit.test('authenticators/parse.js should pass jshint', function(assert) { 
    assert.ok(false, 'authenticators/parse.js should pass jshint.\nauthenticators/parse.js: line 3, col 8, \'ParseUser\' is defined but never used.\nauthenticators/parse.js: line 114, col 53, \'reject\' is defined but never used.\n\n2 errors'); 
  });

});
define('yabbit/tests/authorizers/parse.jshint', function () {

  'use strict';

  QUnit.module('JSHint - authorizers');
  QUnit.test('authorizers/parse.js should pass jshint', function(assert) { 
    assert.ok(true, 'authorizers/parse.js should pass jshint.'); 
  });

});
define('yabbit/tests/controllers/patients/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/patients');
  QUnit.test('controllers/patients/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/patients/index.js should pass jshint.'); 
  });

});
define('yabbit/tests/controllers/patients/index/show.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/patients/index');
  QUnit.test('controllers/patients/index/show.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/patients/index/show.js should pass jshint.'); 
  });

});
define('yabbit/tests/controllers/session/login.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/session');
  QUnit.test('controllers/session/login.js should pass jshint', function(assert) { 
    assert.ok(false, 'controllers/session/login.js should pass jshint.\ncontrollers/session/login.js: line 25, col 89, \'response\' is defined but never used.\n\n1 error'); 
  });

});
define('yabbit/tests/controllers/session/signup.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/session');
  QUnit.test('controllers/session/signup.js should pass jshint', function(assert) { 
    assert.ok(false, 'controllers/session/signup.js should pass jshint.\ncontrollers/session/signup.js: line 40, col 18, \'user\' is defined but never used.\n\n1 error'); 
  });

});
define('yabbit/tests/helpers/resolver', ['exports', 'ember/resolver', 'yabbit/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('yabbit/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('yabbit/tests/helpers/start-app', ['exports', 'ember', 'yabbit/app', 'yabbit/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('yabbit/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('yabbit/tests/helpers/validate-properties', ['exports', 'ember', 'ember-qunit'], function (exports, Ember, ember_qunit) {

  'use strict';

  exports.testValidPropertyValues = testValidPropertyValues;
  exports.testInvalidPropertyValues = testInvalidPropertyValues;

  var run = Ember['default'].run;

  function validateValues(object, propertyName, values, isTestForValid) {
    var promise = null;
    var validatedValues = [];

    values.forEach(function (value) {
      function handleValidation(errors) {
        var hasErrors = object.get('errors.' + propertyName + '.firstObject');
        if (hasErrors && !isTestForValid || !hasErrors && isTestForValid) {
          validatedValues.push(value);
        }
      }

      run(object, 'set', propertyName, value);

      var objectPromise = null;
      run(function () {
        objectPromise = object.validate().then(handleValidation, handleValidation);
      });

      // Since we are setting the values in a different run loop as we are validating them,
      // we need to chain the promises so that they run sequentially. The wrong value will
      // be validated if the promises execute concurrently
      promise = promise ? promise.then(objectPromise) : objectPromise;
    });

    return promise.then(function () {
      return validatedValues;
    });
  }

  function testPropertyValues(propertyName, values, isTestForValid, context) {
    var validOrInvalid = isTestForValid ? 'Valid' : 'Invalid';
    var testName = validOrInvalid + ' ' + propertyName;

    ember_qunit.test(testName, function (assert) {
      var object = this.subject();

      if (context && typeof context === 'function') {
        context(object);
      }

      // Use QUnit.dump.parse so null and undefined can be printed as literal 'null' and
      // 'undefined' strings in the assert message.
      var valuesString = QUnit.dump.parse(values).replace(/\n(\s+)?/g, '').replace(/,/g, ', ');
      var assertMessage = 'Expected ' + propertyName + ' to have ' + validOrInvalid.toLowerCase() + ' values: ' + valuesString;

      return validateValues(object, propertyName, values, isTestForValid).then(function (validatedValues) {
        assert.deepEqual(validatedValues, values, assertMessage);
      });
    });
  }

  function testValidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, true, context);
  }

  function testInvalidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, false, context);
  }

});
define('yabbit/tests/models/parse-user.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/parse-user.js should pass jshint', function(assert) { 
    assert.ok(false, 'models/parse-user.js should pass jshint.\nmodels/parse-user.js: line 1, col 8, \'Ember\' is defined but never used.\nmodels/parse-user.js: line 18, col 9, \'serializer\' is defined but never used.\n\n2 errors'); 
  });

});
define('yabbit/tests/models/patient.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/patient.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/patient.js should pass jshint.'); 
  });

});
define('yabbit/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('yabbit/tests/routes/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('yabbit/tests/routes/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('yabbit/tests/routes/patients/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/patients');
  QUnit.test('routes/patients/index.js should pass jshint', function(assert) { 
    assert.ok(false, 'routes/patients/index.js should pass jshint.\nroutes/patients/index.js: line 16, col 19, \'params\' is defined but never used.\n\n1 error'); 
  });

});
define('yabbit/tests/routes/patients/index/show.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/patients/index');
  QUnit.test('routes/patients/index/show.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/patients/index/show.js should pass jshint.'); 
  });

});
define('yabbit/tests/routes/session/login.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/session');
  QUnit.test('routes/session/login.js should pass jshint', function(assert) { 
    assert.ok(false, 'routes/session/login.js should pass jshint.\nroutes/session/login.js: line 4, col 25, \'transition\' is defined but never used.\n\n1 error'); 
  });

});
define('yabbit/tests/routes/session/signup.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/session');
  QUnit.test('routes/session/signup.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/session/signup.js should pass jshint.'); 
  });

});
define('yabbit/tests/test-helper', ['yabbit/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('yabbit/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('yabbit/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

});
define('yabbit/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/adapters');
  QUnit.test('unit/adapters/application-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('yabbit/tests/unit/controllers/patients-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:patients', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('yabbit/tests/unit/controllers/patients-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers');
  QUnit.test('unit/controllers/patients-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/controllers/patients-test.js should pass jshint.'); 
  });

});
define('yabbit/tests/unit/models/patient-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('patient', 'Unit | Model | patient', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('yabbit/tests/unit/models/patient-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/patient-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/models/patient-test.js should pass jshint.'); 
  });

});
define('yabbit/tests/unit/models/physician-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('physician', 'Unit | Model | physician', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('yabbit/tests/unit/models/physician-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/physician-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/models/physician-test.js should pass jshint.'); 
  });

});
define('yabbit/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('yabbit/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/index-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/index-test.js should pass jshint.'); 
  });

});
define('yabbit/tests/unit/routes/patient-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:patient', 'Unit | Route | patient', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('yabbit/tests/unit/routes/patient-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/patient-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/patient-test.js should pass jshint.'); 
  });

});
define('yabbit/transforms/date', ['exports', 'ember-parse-adapter/transforms/date'], function (exports, transform) {

	'use strict';

	exports['default'] = transform['default'];

});
define('yabbit/transforms/file', ['exports', 'ember-parse-adapter/transforms/file'], function (exports, transform) {

	'use strict';

	exports['default'] = transform['default'];

});
define('yabbit/transforms/geopoint', ['exports', 'ember-parse-adapter/transforms/geopoint'], function (exports, transform) {

	'use strict';

	exports['default'] = transform['default'];

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('yabbit/config/environment', ['ember'], function(Ember) {
  var prefix = 'yabbit';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("yabbit/tests/test-helper");
} else {
  require("yabbit/app")["default"].create({"applicationId":"kAPizP7WxU9vD8ndEHZd4w14HBDANxCYi5VQQGJ9","restApiId":"1wRXdgIGcnCPoeywMgdNQ7THSbMO7UxWZYdvlfJN","name":"yabbit","version":"0.0.0+f5abf505"});
}

/* jshint ignore:end */
//# sourceMappingURL=yabbit.map