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
define('yabbit/controllers/session/signup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    username: null,
    password: null,
    email: null,
    loggedIn: false,
    loginMessage: null,

    actions: {
      signup: function signup() {
        var controller = this;
        var ParseUser = this.store.modelFor('parse-user');
        var data = {
          username: this.get('username'),
          password: this.get('password'),
          email: this.get('email')
        };

        console.log(this.store);

        ParseUser.signup(this.store, data).then(function (user) {
          controller.set('loggedIn', true);
          controller.set('loginMessage', 'Welcome!');
        }, function (error) {
          controller.set('loggedIn', false);
          controller.set('loginMessage', error.message || error.error);
        });
      }
    }
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
define('yabbit/models/parse-user', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    firstName: DS['default'].attr('string'),
    lastName: DS['default'].attr('string'),
    createdAt: DS['default'].attr('date'),
    patients: DS['default'].hasMany('patient', { async: true })
  });

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
define('yabbit/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      this.transitionTo('session.login');
    }
  });

});
define('yabbit/routes/patients/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
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
    //setupController(controller) {
    //  controller.set('title', 'Login');
    //}
  });

});
define('yabbit/routes/session/signup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.get('store').createRecord('parse-user');
    }
  });

});
define('yabbit/serializers/application', ['exports', 'ember-parse-adapter/serializers/application'], function (exports, serializer) {

	'use strict';

	exports['default'] = serializer['default'];

});
define('yabbit/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 4
            },
            "end": {
              "line": 3,
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
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
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
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
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
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],[],0,null,["loc",[null,[3,4],[3,74]]]],
        ["content","outlet",["loc",[null,[8,2],[8,12]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('yabbit/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
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
        "revision": "Ember@1.13.7",
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
            "revision": "Ember@1.13.7",
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
          "revision": "Ember@1.13.7",
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
          "revision": "Ember@1.13.7",
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
          "revision": "Ember@1.13.7",
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
        "revision": "Ember@1.13.7",
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
          "revision": "Ember@1.13.7",
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
        "revision": "Ember@1.13.7",
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
          "revision": "Ember@1.13.7",
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
          "revision": "Ember@1.13.7",
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
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 35
            }
          },
          "moduleName": "yabbit/templates/session.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Skip for now");
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
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
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
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(element1,1,1);
        morphs[1] = dom.createMorphAt(element1,3,3);
        morphs[2] = dom.createMorphAt(element0,3,3);
        morphs[3] = dom.createMorphAt(fragment,2,2,contextualElement);
        return morphs;
      },
      statements: [
        ["block","link-to",["session.login"],["id","login"],0,null,["loc",[null,[3,4],[3,60]]]],
        ["block","link-to",["session.signup"],["id","signup"],1,null,["loc",[null,[4,4],[4,63]]]],
        ["content","outlet",["loc",[null,[6,2],[6,12]]]],
        ["block","link-to",["patients"],[],2,null,["loc",[null,[9,0],[9,47]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('yabbit/templates/session/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
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
        var el1 = dom.createElement("input");
        dom.setAttribute(el1,"id","email");
        dom.setAttribute(el1,"type","text");
        dom.setAttribute(el1,"placeholder","Email");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("input");
        dom.setAttribute(el1,"id","password");
        dom.setAttribute(el1,"type","password");
        dom.setAttribute(el1,"placeholder","Password");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("button");
        dom.setAttribute(el1,"type","submit");
        var el2 = dom.createTextNode("Login");
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
  }()));

});
define('yabbit/templates/session/signup', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
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
        var el1 = dom.createElement("input");
        dom.setAttribute(el1,"id","email");
        dom.setAttribute(el1,"type","text");
        dom.setAttribute(el1,"placeholder","Email");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("input");
        dom.setAttribute(el1,"id","password");
        dom.setAttribute(el1,"type","password");
        dom.setAttribute(el1,"placeholder","Password");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("input");
        dom.setAttribute(el1,"id","password2");
        dom.setAttribute(el1,"type","password");
        dom.setAttribute(el1,"placeholder","Confirm Password");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("button");
        dom.setAttribute(el1,"type","submit");
        var el2 = dom.createTextNode("Signup");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [6]);
        var morphs = new Array(1);
        morphs[0] = dom.createElementMorph(element0);
        return morphs;
      },
      statements: [
        ["element","action",["signup"],[],["loc",[null,[5,22],[5,41]]]]
      ],
      locals: [],
      templates: []
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
define('yabbit/tests/controllers/session/signup.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/session');
  QUnit.test('controllers/session/signup.js should pass jshint', function(assert) { 
    assert.ok(false, 'controllers/session/signup.js should pass jshint.\ncontrollers/session/signup.js: line 23, col 18, \'user\' is defined but never used.\n\n1 error'); 
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
define('yabbit/tests/models/parse-user.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/parse-user.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/parse-user.js should pass jshint.'); 
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
    assert.ok(false, 'routes/patients/index.js should pass jshint.\nroutes/patients/index.js: line 15, col 19, \'params\' is defined but never used.\n\n1 error'); 
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
    assert.ok(true, 'routes/session/login.js should pass jshint.'); 
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
  require("yabbit/app")["default"].create({"name":"yabbit","version":"0.0.0+53cf64b7"});
}

/* jshint ignore:end */
//# sourceMappingURL=yabbit.map