import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // Render Patient Index into master template
  renderTemplate: function() {
    this.render({
      outlet: 'master',
    });
  },
  actions: {
    //didTransition: function() {
    //  console.log('routeName: ' + this.routeName);
    //  return true; // Bubble the didTransition event
    //}
  },
  model: function(params) {

    // @TODO: Load patients from Parse

    //// Get adapter and serializer
    //var store = this.get('store');
    //var adapter = store.adapterFor('parse-user');
    //var serializer = store.serializerFor('parse-user');

    //var parsePatients = adapter.ajax(adapter.buildURL("parse-user", "me"), "GET", {}).then(function(user) {
    //  return store.push({
    //    data: {
    //      id: user.objectId,
    //      type: 'parse-user',
    //      attributes: {
    //        sessionToken: user.sessionToken,
    //        email: user.email,
    //        username: user.username,
    //        firstName: user.firstName,
    //        lastName: user.lastName
    //      }
    //    }
    //  });
    //});

    return [
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
            title: "Happy Heading",
            data: [
              {y:'2014', a:50,  b:90},
              {y:'2015', a:65,  b:75},
              {y:'2016', a:50,  b:50},
              {y:'2017', a:75,  b:60},
              {y:'2018', a:80,  b:65},
              {y:'2019', a:90,  b:70},
              {y:'2020', a:100, b:75},
              {y:'2021', a:115, b:75},
              {y:'2022', a:120, b:85},
              {y:'2023', a:145, b:85},
              {y:'2024', a:160, b:95}
            ]
          }
        ]
      },
      {
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
      },
      {
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
      },
    ];
  }
});
