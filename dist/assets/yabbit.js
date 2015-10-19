"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('yabbit/adapters/application', ['exports', 'ember', 'ember-parse-adapter/adapters/application'], function (exports, Ember, adapter) {

  'use strict';

  exports['default'] = adapter['default'].extend({

    pathForType: function pathForType(type) {
      if ('parseUser' === type || 'parse-user' === type) {
        return 'users';
      } else if ('login' === type) {
        return 'login';
      } else if ('function' === type) {
        return 'functions';
      }
      // APP SPECIFIC: Patient data is fragmented so it's a function instead
      else if ('patientsForPhysician' === type) {
          return 'functions/patientsForPhysician';
        }
        // APP SPECIFIC: Graph data is fragmented so it's a function instead
        else if ('graphsForPatient' === type) {
            return 'functions/graphsForPatient';
          } else {
            return 'classes/' + Ember['default'].String.capitalize(Ember['default'].String.camelize(type));
          }
    }
  });

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
          username: user.get('username'),
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

      // Use ember simple auth "identification" (email) as parse "username"
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
define('yabbit/components/area-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    /****************************************************************************
    /* PROPERTIES
    /***************************************************************************/

    chart: null,

    /****************************************************************************
    /* EVENTS
    /***************************************************************************/

    didInsertElement: function didInsertElement() {

      var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

      // Create chart using data injected via template
      this.chart = new Morris.Area({
        element: this.get('elementId'),
        data: this.get('values'),
        ykeys: 'y', //['p', 'd'], // patient, demographic
        xkey: 'x',
        xLabels: "week",
        xLabelFormat: function xLabelFormat(date) {
          return "Week " + moment(date).week();
          // convert date string or timestamp to just month
          //return months[new Date(date).getMonth()];
        },
        hoverUnits: this.get('hoverUnits'), // NOT Morris.js API
        hoverCallback: function hoverCallback(index, options, content, row) {
          return '<strong>' + row.y + '</strong> ' + options.hoverUnits + ' - ' + moment(row.x).format('MMM Do');
        },
        resize: true,
        hideHover: true,
        fillOpacity: 0.2,
        behaveLikeLine: true,
        lineColors: ['#848484', '#4BB3D2'],
        labels: ['Patient', 'Demographic'],
        pointFillColors: ['#848484', '#4BB3D2']
      });
    }
  });

});
define('yabbit/controllers/account/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    /****************************************************************************
    /* ACTIONS
    /***************************************************************************/

    actions: {
      update: function update() {

        // Get current user
        var user = this.get('model');

        // Sync username with email
        user.set('username', user.get('email'));

        // Update user to parse
        user.save();
      }
    }
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

    identification: null, // email/username
    password: null,
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
          // once logged in redirect user to their patients
          controller.transitionToRoute('patients.index');
        },
        // Handle errors
        function (error) {
          // show message to the user
          controller.set('message', error.message);
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
          email: this.get('identification'),
          username: this.get('identification'),
          firstName: this.get('firstName'),
          lastName: this.get('lastName'),
          password: this.get('password'),
          isPhysician: true
        };

        // Save User
        var controller = this;
        user.signup(this.store, data).then(function (user) {
          controller.set('message', 'You are now signed up!');
        },
        // Handle errors
        function (error) {
          // show message to the user
          controller.set('message', error.message);
          console.log(error);
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
define('yabbit/models/graph', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({

    /****************************************************************************
    /* PROPERTIES
    /***************************************************************************/

    title: DS['default'].attr('string'),
    measurement: DS['default'].attr('string'),
    values: DS['default'].attr(),

    /****************************************************************************
    /* RELATIONSHIPS
    /***************************************************************************/

    patient: DS['default'].belongsTo('patient')

  });

});
define('yabbit/models/parse-user', ['exports', 'ember', 'ember-parse-adapter/models/parse-user'], function (exports, Ember, ParseUser) {

  'use strict';

  ParseUser['default'].reopenClass({

    /****************************************************************************
    /* PROPERTIES
    /***************************************************************************/

    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    isPhysician: DS.attr('boolean'),

    /****************************************************************************
    /* RELATIONSHIPS
    /***************************************************************************/

    patients: DS.hasMany('patient'),

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
              username: user.username,
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

    /****************************************************************************
    /* PROPERTIES
    /***************************************************************************/

    firstName: DS['default'].attr('string'),
    lastName: DS['default'].attr('string'),
    email: DS['default'].attr('string'),
    challengeDiet: DS['default'].attr('number'),
    challengeStress: DS['default'].attr('number'),
    challengeFitness: DS['default'].attr('number'),
    activityLevelScore: DS['default'].attr('number'),
    zScore: DS['default'].attr('number'),
    user: DS['default'].attr('number'),

    /****************************************************************************
    /* COMPUTED PROPERTIES
    /***************************************************************************/

    healthRisk: Ember.computed('zScore', function () {

      // The normal range (given human height, weight, and waist circumfirence values) is between -2 and 2.
      // Below 0 is healthy while above 0 is unhealthy. Z score shows the total relative to the entire population
      if (this.get('zScore') < -1) {
        return 'Healthy';
      } else if (this.get('zScore') < 0) {
        return 'Low Risk';
      } else if (this.get('zScore') < 1) {
        return 'Moderate Risk';
      } else if (this.get('zScore') > 1) {
        return 'High Risk';
      }
    }),

    activityLevel: Ember.computed('activityLevelScore', function () {
      // 4 - 7 Sedentary
      if (this.get('activityLevelScore') <= 7) {
        return 'Sedentary';
      }
      // 8 - 10 Moderate
      else if (this.get('activityLevelScore') <= 10) {
          return 'Moderate';
        }
        // 11 - 13 Active
        else if (this.get('activityLevelScore') <= 13) {
            return 'Active';
          }
          // 14 - 16 Very Active
          else if (this.get('activityLevelScore') <= 16) {
              return 'Very Active';
            }
    }),

    /****************************************************************************
    /* RELATIONSHIPS
    /***************************************************************************/

    physician: DS['default'].belongsTo('parse-user'),
    graphs: DS['default'].hasMany('graph'),
    stats: DS['default'].hasMany('stat')

  });

});
define('yabbit/models/stat', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({

    /****************************************************************************
    /* PROPERTIES
    /***************************************************************************/

    title: DS['default'].attr('string'),
    stat: DS['default'].attr('string'),
    description: DS['default'].attr('string'),

    /****************************************************************************
    /* RELATIONSHIPS
    /***************************************************************************/

    patient: DS['default'].belongsTo('patient')

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

    this.route('account', function () {
      this.route('edit');
    });

    this.route('patients', function () {
      this.route('index', function () {
        this.route('show', { path: ':id' });
      });
    });
  });

  exports['default'] = Router;

});
define('yabbit/routes/account/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.get('store').modelFor('parse-user').current(this.get('store'));
    }
  });

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
    // Render Patient Index into master template
    renderTemplate: function renderTemplate() {
      this.render({
        outlet: 'master'
      });
    },

    /****************************************************************************
    /* PATIENTS FOR PHYSICIAN
    /***************************************************************************/

    model: function model(params) {

      // Get Store
      var store = this.get('store');

      // Get Adapter
      var adapter = store.adapterFor('parse-user');
      var serializer = store.serializerFor('parse-user');

      // Get Patients For Physician (POST insead of GET to avoid parse error)
      return adapter.ajax(adapter.buildURL("patientsForPhysician"), "POST", {}).then(function (data) {

        // Build Patients
        for (var index = 0; index < data.result.patients.length; index++) {
          var patient = data.result.patients[index];
          var diet = data.result.diet[index];

          // Build Patient
          var emberPatient = {
            data: {
              id: patient.objectId,
              type: 'patient',
              attributes: {
                firstName: patient.Fname,
                lastName: patient.Lname,
                email: patient.Username.email,
                challengeFitness: patient.PercentFitnessChallengesLast,
                challengeDiet: patient.PercentDietChallengesLast,
                challengeStress: patient.PercentStresshChallengesLast,
                user: patient.Username.objectId,
                zScore: patient.Username.ABSI_zscore,
                activityLevelScore: diet.activityLevel
              }
            }
          };
          // Create Patient
          store.push(emberPatient);
        }
        // Return Patients
        return store.findAll('patient');
      });
    }
  });

});
define('yabbit/routes/patients/index/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    // Render Patient Show into detail template
    renderTemplate: function renderTemplate() {
      this.render({
        outlet: 'detail'
      });
    },

    /****************************************************************************
    /* GRAPHS FOR PATIENT
    /***************************************************************************/

    model: function model(params) {

      //// Get Store
      var store = this.get('store');

      //// Get Adapter
      var adapter = store.adapterFor('parse-user');
      var serializer = store.serializerFor('parse-user');

      // Get Patient
      var patient = this.modelFor('patients.index').findBy('id', params.id);
      var patientUser = { user: patient.get('user') };

      // Get Graphs For Patient
      adapter.ajax(adapter.buildURL("graphsForPatient"), "POST", { data: patientUser }).then(function (data) {
        console.log(data.result.graphs);

        // Seperate Data
        var steps = [];
        var calories = [];
        var heartRates = [];

        for (var index = 0; index < data.result.graphs.length; index++) {
          var item = data.result.graphs[index];
          steps.push({ x: item.createdAt, y: item.Steps });
          calories.push({ x: item.createdAt, y: item.Calories });
          heartRates.push({ x: item.createdAt, y: item.NormalHR });
        }

        // Create Graphs
        store.createRecord('graph', {
          title: 'Calories',
          hoverUnits: 'calories',
          values: calories,
          patient: patient
        });
        store.createRecord('graph', {
          title: 'Steps',
          hoverUnits: 'steps',
          values: steps,
          patient: patient
        });
        store.createRecord('graph', {
          title: 'Heart Rate',
          units: 'bpm',
          hoverUnits: 'bpm',
          values: heartRates,
          patient: patient
        });
      });

      // Return patient and their graphs
      return patient;
    }
  });

  // Dummy Data
  /*return [
    {
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
      },
      "charts": [
        {
          title: "Heart Rate",
          measurement: "bpm",
          data: [
            {x:'2015-07', p:100, d:90},
            {x:'2015-08', p:105, d:87},
            {x:'2015-09', p:120, d:75},
            {x:'2015-10', p:115, d:80},
            {x:'2015-11', p:130, d:85},
            {x:'2015-12', p:110, d:110},
          ]
        },
        {
          title: "Step count",
          measurement: "steps",
          data: [
            {x:'2015-07', p:1000, d:3000},
            {x:'2015-08', p:1050, d:3500},
            {x:'2015-09', p:1500, d:4100},
            {x:'2015-10', p:1800, d:4000},
            {x:'2015-11', p:2000, d:3900},
            {x:'2015-12', p:2005, d:4030},
          ]
        },
        {
          title: "Weight",
          measurement: "lb",
          data: [
            {x:'2015-07', p:170, d:80},
            {x:'2015-08', p:165, d:80},
            {x:'2015-09', p:160, d:81},
            {x:'2015-10', p:155, d:83},
            {x:'2015-11', p:140, d:80},
            {x:'2015-12', p:130, d:78},
          ]
        },
        {
          title: "Calories burned",
          data: [
            {x:'2015-07', p:10000, d:20000},
            {x:'2015-08', p:11000, d:21000},
            {x:'2015-09', p:15000, d:23000},
            {x:'2015-10', p:16000, d:24000},
            {x:'2015-11', p:20000, d:23000},
            {x:'2015-12', p:35000, d:22000},
          ]
        }
      ]
    }
  ];*/

});
define('yabbit/routes/session/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function beforeModel(transition) {
      // Redirect authenticated users to the Patients Index
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
define('yabbit/templates/account/edit', ['exports'], function (exports) {

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
            "line": 15,
            "column": 0
          }
        },
        "moduleName": "yabbit/templates/account/edit.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Edit Account");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","edit");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("form");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","submit");
        var el4 = dom.createTextNode("Update");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
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
        var element0 = dom.childAt(fragment, [2, 1]);
        var element1 = dom.childAt(element0, [11]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(element0,1,1);
        morphs[1] = dom.createMorphAt(element0,3,3);
        morphs[2] = dom.createMorphAt(element0,5,5);
        morphs[3] = dom.createMorphAt(element0,7,7);
        morphs[4] = dom.createMorphAt(element0,9,9);
        morphs[5] = dom.createElementMorph(element1);
        return morphs;
      },
      statements: [
        ["inline","input",[],["value",["subexpr","@mut",[["get","model.email",["loc",[null,[6,18],[6,29]]]]],[],[]],"id","email","placeholder","Email"],["loc",[null,[6,4],[6,62]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","model.firstName",["loc",[null,[7,18],[7,33]]]]],[],[]],"id","firstname","placeholder","First name"],["loc",[null,[7,4],[7,75]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","model.lastName",["loc",[null,[8,18],[8,32]]]]],[],[]],"id","lastname","placeholder","Last name"],["loc",[null,[8,4],[8,72]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","model.password",["loc",[null,[9,18],[9,32]]]]],[],[]],"id","password","placeholder","Password"],["loc",[null,[9,4],[9,71]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","model.passwordConfirmation",["loc",[null,[10,18],[10,44]]]]],[],[]],"id","password-confirmation","placeholder","Confirm Password"],["loc",[null,[10,4],[10,104]]]],
        ["element","action",["update"],[],["loc",[null,[12,26],[12,45]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

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
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 10,
                "column": 16
              },
              "end": {
                "line": 10,
                "column": 50
              }
            },
            "moduleName": "yabbit/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Account");
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
              "line": 9,
              "column": 10
            },
            "end": {
              "line": 12,
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
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n            ");
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
          var element1 = dom.childAt(fragment, [3, 0]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          morphs[1] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [
          ["block","link-to",["account.edit"],[],0,null,["loc",[null,[10,16],[10,62]]]],
          ["element","action",["invalidateSession"],[],["loc",[null,[11,19],[11,49]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 10
            },
            "end": {
              "line": 14,
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
          ["element","action",["sessionRequiresAuthentication"],[],["loc",[null,[13,19],[13,61]]]]
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
        dom.setAttribute(el1,"id","main");
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
        var el6 = dom.createTextNode("        ");
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
        dom.setAttribute(el1,"class","container");
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
        ["block","if",[["get","session.isAuthenticated",["loc",[null,[9,16],[9,39]]]]],[],1,2,["loc",[null,[9,10],[14,17]]]],
        ["content","outlet",["loc",[null,[23,2],[23,12]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('yabbit/templates/components/area-chart', ['exports'], function (exports) {

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
        "moduleName": "yabbit/templates/components/area-chart.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" SVG rendered here by didInsertElement in area-chart.js ");
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
                "column": 95
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
            ["content","patient.firstName",["loc",[null,[5,53],[5,74]]]],
            ["content","patient.lastName",["loc",[null,[5,75],[5,95]]]]
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
          ["block","link-to",["patients.index.show",["get","patient.id",["loc",[null,[5,41],[5,51]]]]],[],0,null,["loc",[null,[5,8],[5,107]]]]
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
          var element5 = dom.childAt(element0, [3]);
          var element6 = dom.childAt(element0, [5]);
          var morphs = new Array(10);
          morphs[0] = dom.createAttrMorph(element2, 'style');
          morphs[1] = dom.createMorphAt(element2,0,0);
          morphs[2] = dom.createAttrMorph(element3, 'style');
          morphs[3] = dom.createMorphAt(element3,0,0);
          morphs[4] = dom.createAttrMorph(element4, 'style');
          morphs[5] = dom.createMorphAt(element4,0,0);
          morphs[6] = dom.createAttrMorph(element5, 'class');
          morphs[7] = dom.createMorphAt(element5,1,1);
          morphs[8] = dom.createAttrMorph(element6, 'class');
          morphs[9] = dom.createMorphAt(element6,1,1);
          return morphs;
        },
        statements: [
          ["attribute","style",["concat",["width: ",["get","patient.challengeFitness",["loc",[null,[24,53],[24,77]]]],"%"]]],
          ["content","patient.challengeFitness",["loc",[null,[24,82],[24,110]]]],
          ["attribute","style",["concat",["width: ",["get","patient.challengeDiet",["loc",[null,[25,50],[25,71]]]],"%"]]],
          ["content","patient.challengeDiet",["loc",[null,[25,76],[25,101]]]],
          ["attribute","style",["concat",["width: ",["get","patient.challengeStress",["loc",[null,[26,52],[26,75]]]],"%"]]],
          ["content","patient.challengeStress",["loc",[null,[26,80],[26,107]]]],
          ["attribute","class",["concat",["health-risk ",["get","patient.healthRisk.change",["loc",[null,[28,35],[28,60]]]]]]],
          ["content","patient.healthRisk",["loc",[null,[29,12],[29,34]]]],
          ["attribute","class",["concat",["activity-level ",["get","patient.activityLevel.change",["loc",[null,[31,38],[31,66]]]]]]],
          ["content","patient.activityLevel",["loc",[null,[32,12],[32,37]]]]
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
        var el3 = dom.createTextNode("\n    ");
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
              "line": 37,
              "column": 4
            },
            "end": {
              "line": 47,
              "column": 4
            }
          },
          "moduleName": "yabbit/templates/patients/index/show.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","column");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("section");
          dom.setAttribute(el2,"class","area-chart");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("header");
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("em");
          dom.setAttribute(el4,"class","measurement");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h2");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var element1 = dom.childAt(element0, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
          morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
          morphs[2] = dom.createMorphAt(element0,3,3);
          return morphs;
        },
        statements: [
          ["content","graph.units",["loc",[null,[41,36],[41,51]]]],
          ["content","graph.title",["loc",[null,[42,16],[42,31]]]],
          ["inline","area-chart",[],["values",["subexpr","@mut",[["get","graph.values",["loc",[null,[44,30],[44,42]]]]],[],[]],"hoverUnits",["subexpr","@mut",[["get","graph.hoverUnits",["loc",[null,[44,54],[44,70]]]]],[],[]]],["loc",[null,[44,10],[44,72]]]]
        ],
        locals: ["graph"],
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
              "line": 53,
              "column": 0
            },
            "end": {
              "line": 53,
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
            "line": 54,
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
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        dom.setAttribute(el7,"class","percent");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("Fitness");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","bar diet");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        dom.setAttribute(el7,"class","percent");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("Diet");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","bar stress");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        dom.setAttribute(el7,"class","percent");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("%");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("Strength");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
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
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","charts");
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
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
        var element2 = dom.childAt(fragment, [0]);
        var element3 = dom.childAt(element2, [1, 3, 1]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element4, [3]);
        var element7 = dom.childAt(element4, [5]);
        var element8 = dom.childAt(element3, [3]);
        var element9 = dom.childAt(element3, [5]);
        var morphs = new Array(12);
        morphs[0] = dom.createAttrMorph(element5, 'style');
        morphs[1] = dom.createMorphAt(dom.childAt(element5, [1]),0,0);
        morphs[2] = dom.createAttrMorph(element6, 'style');
        morphs[3] = dom.createMorphAt(dom.childAt(element6, [1]),0,0);
        morphs[4] = dom.createAttrMorph(element7, 'style');
        morphs[5] = dom.createMorphAt(dom.childAt(element7, [1]),0,0);
        morphs[6] = dom.createAttrMorph(element8, 'class');
        morphs[7] = dom.createMorphAt(element8,1,1);
        morphs[8] = dom.createAttrMorph(element9, 'class');
        morphs[9] = dom.createMorphAt(element9,1,1);
        morphs[10] = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
        morphs[11] = dom.createMorphAt(fragment,2,2,contextualElement);
        return morphs;
      },
      statements: [
        ["attribute","style",["concat",["width: ",["get","model.challengeFitness",["loc",[null,[12,51],[12,73]]]],"%"]]],
        ["content","model.challengeFitness",["loc",[null,[13,32],[13,58]]]],
        ["attribute","style",["concat",["width: ",["get","model.challengeDiet",["loc",[null,[16,48],[16,67]]]],"%"]]],
        ["content","model.challengeDiet",["loc",[null,[17,32],[17,55]]]],
        ["attribute","style",["concat",["width: ",["get","model.challengeStress",["loc",[null,[20,50],[20,71]]]],"%"]]],
        ["content","model.challengeStress",["loc",[null,[21,32],[21,57]]]],
        ["attribute","class",["concat",["health-risk ",["get","model.healthRisk.change",["loc",[null,[25,33],[25,56]]]]]]],
        ["content","model.healthRisk",["loc",[null,[26,10],[26,30]]]],
        ["attribute","class",["concat",["activity-level ",["get","model.activityLevel.change",["loc",[null,[28,36],[28,62]]]]]]],
        ["content","model.activityLevel",["loc",[null,[29,10],[29,33]]]],
        ["block","each",[["get","model.graphs",["loc",[null,[37,12],[37,24]]]]],[],0,null,["loc",[null,[37,4],[47,13]]]],
        ["block","link-to",["patients.index"],["id","view-all","class","button"],1,null,["loc",[null,[53,0],[53,78]]]]
      ],
      locals: [],
      templates: [child0, child1]
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
        dom.setAttribute(el1,"id","edit");
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
        ["inline","input",[],["value",["subexpr","@mut",[["get","password",["loc",[null,[9,16],[9,24]]]]],[],[]],"type","password","id","password","placeholder","Password"],["loc",[null,[9,2],[9,79]]]],
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
            "line": 16,
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
        var element1 = dom.childAt(element0, [11]);
        var morphs = new Array(7);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(element0,1,1);
        morphs[2] = dom.createMorphAt(element0,3,3);
        morphs[3] = dom.createMorphAt(element0,5,5);
        morphs[4] = dom.createMorphAt(element0,7,7);
        morphs[5] = dom.createMorphAt(element0,9,9);
        morphs[6] = dom.createElementMorph(element1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","message",["loc",[null,[1,6],[1,13]]]]],[],0,null,["loc",[null,[1,0],[5,7]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","identification",["loc",[null,[8,16],[8,30]]]]],[],[]],"id","identification","placeholder","Email"],["loc",[null,[8,2],[8,72]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","firstName",["loc",[null,[9,16],[9,25]]]]],[],[]],"id","firstname","placeholder","First name"],["loc",[null,[9,2],[9,67]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","lastName",["loc",[null,[10,16],[10,24]]]]],[],[]],"id","lastname","placeholder","Last name"],["loc",[null,[10,2],[10,64]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","password",["loc",[null,[11,16],[11,24]]]]],[],[]],"type","password","id","password","placeholder","Password"],["loc",[null,[11,2],[11,79]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","passwordConfirmation",["loc",[null,[12,16],[12,36]]]]],[],[]],"type","password","id","password-confirmation","placeholder","Confirm Password"],["loc",[null,[12,2],[12,112]]]],
        ["element","action",["signup"],[],["loc",[null,[14,24],[14,43]]]]
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
    assert.ok(false, 'authenticators/parse.js should pass jshint.\nauthenticators/parse.js: line 3, col 8, \'ParseUser\' is defined but never used.\nauthenticators/parse.js: line 87, col 53, \'reject\' is defined but never used.\n\n2 errors'); 
  });

});
define('yabbit/tests/authorizers/parse.jshint', function () {

  'use strict';

  QUnit.module('JSHint - authorizers');
  QUnit.test('authorizers/parse.js should pass jshint', function(assert) { 
    assert.ok(true, 'authorizers/parse.js should pass jshint.'); 
  });

});
define('yabbit/tests/components/area-chart.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/area-chart.js should pass jshint', function(assert) { 
    assert.ok(false, 'components/area-chart.js should pass jshint.\ncomponents/area-chart.js: line 20, col 22, \'Morris\' is not defined.\ncomponents/area-chart.js: line 27, col 26, \'moment\' is not defined.\ncomponents/area-chart.js: line 33, col 81, \'moment\' is not defined.\ncomponents/area-chart.js: line 17, col 9, \'months\' is defined but never used.\n\n4 errors'); 
  });

});
define('yabbit/tests/controllers/account/edit.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/account');
  QUnit.test('controllers/account/edit.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/account/edit.js should pass jshint.'); 
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
    assert.ok(false, 'controllers/session/signup.js should pass jshint.\ncontrollers/session/signup.js: line 39, col 18, \'user\' is defined but never used.\n\n1 error'); 
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
define('yabbit/tests/models/graph.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/graph.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/graph.js should pass jshint.'); 
  });

});
define('yabbit/tests/models/parse-user.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/parse-user.js should pass jshint', function(assert) { 
    assert.ok(false, 'models/parse-user.js should pass jshint.\nmodels/parse-user.js: line 15, col 15, \'DS\' is not defined.\nmodels/parse-user.js: line 16, col 14, \'DS\' is not defined.\nmodels/parse-user.js: line 17, col 17, \'DS\' is not defined.\nmodels/parse-user.js: line 23, col 13, \'DS\' is not defined.\nmodels/parse-user.js: line 1, col 8, \'Ember\' is defined but never used.\nmodels/parse-user.js: line 34, col 9, \'serializer\' is defined but never used.\n\n6 errors'); 
  });

});
define('yabbit/tests/models/patient.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/patient.js should pass jshint', function(assert) { 
    assert.ok(false, 'models/patient.js should pass jshint.\nmodels/patient.js: line 23, col 15, \'Ember\' is not defined.\nmodels/patient.js: line 41, col 18, \'Ember\' is not defined.\n\n2 errors'); 
  });

});
define('yabbit/tests/models/stat.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/stat.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/stat.js should pass jshint.'); 
  });

});
define('yabbit/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('yabbit/tests/routes/account/edit.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/account');
  QUnit.test('routes/account/edit.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/account/edit.js should pass jshint.'); 
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
    assert.ok(false, 'routes/patients/index.js should pass jshint.\nroutes/patients/index.js: line 24, col 9, \'serializer\' is defined but never used.\nroutes/patients/index.js: line 17, col 19, \'params\' is defined but never used.\n\n2 errors'); 
  });

});
define('yabbit/tests/routes/patients/index/show.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/patients/index');
  QUnit.test('routes/patients/index/show.js should pass jshint', function(assert) { 
    assert.ok(false, 'routes/patients/index/show.js should pass jshint.\nroutes/patients/index/show.js: line 22, col 9, \'serializer\' is defined but never used.\n\n1 error'); 
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
  require("yabbit/app")["default"].create({"applicationId":"kAPizP7WxU9vD8ndEHZd4w14HBDANxCYi5VQQGJ9","restApiId":"1wRXdgIGcnCPoeywMgdNQ7THSbMO7UxWZYdvlfJN","name":"yabbit","version":"0.0.0+7341f199"});
}

/* jshint ignore:end */
//# sourceMappingURL=yabbit.map