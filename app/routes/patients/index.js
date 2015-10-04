import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // Render Patient Index into master template
  renderTemplate: function() {
    this.render({
      outlet: 'master',
    });
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

    // Dummy Data
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
            title: "Heart Rate",
            measurement: "bpm",
            data: [
              {y:'2015-07', a:100, b:90},
              {y:'2015-08', a:105, b:87},
              {y:'2015-09', a:120, b:75},
              {y:'2015-10', a:115, b:80},
              {y:'2015-11', a:130, b:85},
              {y:'2015-12', a:110, b:110},
            ]
          },
          {
            title: "Step count",
            measurement: "steps",
            data: [
              {y:'2015-07', a:1000, b:3000},
              {y:'2015-08', a:1050, b:3500},
              {y:'2015-09', a:1500, b:4100},
              {y:'2015-10', a:1800, b:4000},
              {y:'2015-11', a:2000, b:3900},
              {y:'2015-12', a:2005, b:4030},
            ]
          },
          {
            title: "Weight",
            measurement: "lb",
            data: [
              {y:'2015-07', a:170, b:80},
              {y:'2015-08', a:165, b:80},
              {y:'2015-09', a:160, b:81},
              {y:'2015-10', a:155, b:83},
              {y:'2015-11', a:140, b:80},
              {y:'2015-12', a:130, b:78},
            ]
          },
          {
            title: "Calories burned",
            data: [
              {y:'2015-07', a:10000, b:20000},
              {y:'2015-08', a:11000, b:21000},
              {y:'2015-09', a:15000, b:23000},
              {y:'2015-10', a:16000, b:24000},
              {y:'2015-11', a:20000, b:23000},
              {y:'2015-12', a:35000, b:22000},
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
        },
        "charts": [
          {
            title: "Heart Rate",
            measurement: "bpm",
            data: [
              {y:'2015-07', a:110, b:80},
              {y:'2015-08', a:145, b:67},
              {y:'2015-09', a:120, b:95},
              {y:'2015-10', a:125, b:50},
              {y:'2015-11', a:160, b:45},
              {y:'2015-12', a:120, b:90},
            ]
          },
          {
            title: "Step count",
            measurement: "steps",
            data: [
              {y:'2015-07', a:1100, b:3000},
              {y:'2015-08', a:900,  b:3500},
              {y:'2015-09', a:1200, b:3100},
              {y:'2015-10', a:1300, b:2500},
              {y:'2015-11', a:1600, b:3900},
              {y:'2015-12', a:1805, b:3000},
            ]
          },
          {
            title: "Weight",
            measurement: "lb",
            data: [
              {y:'2015-07', a:140, b:60},
              {y:'2015-08', a:165, b:80},
              {y:'2015-09', a:140, b:91},
              {y:'2015-10', a:155, b:83},
              {y:'2015-11', a:140, b:80},
              {y:'2015-12', a:130, b:78},
            ]
          },
          {
            title: "Calories burned",
            data: [
              {y:'2015-07', a:14000, b:18000},
              {y:'2015-08', a:15000, b:21000},
              {y:'2015-09', a:14000, b:23000},
              {y:'2015-10', a:16000, b:20000},
              {y:'2015-11', a:20000, b:23000},
              {y:'2015-12', a:35000, b:22000},
            ]
          }
        ]
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
        },
        "charts": [
          {
            title: "Heart Rate",
            measurement: "bpm",
            data: [
              {y:'2015-07', a:90,  b:99},
              {y:'2015-08', a:125, b:77},
              {y:'2015-09', a:123, b:75},
              {y:'2015-10', a:105, b:44},
              {y:'2015-11', a:110, b:85},
              {y:'2015-12', a:100, b:50},
            ]
          },
          {
            title: "Step count",
            measurement: "steps",
            data: [
              {y:'2015-07', a:1000, b:3000},
              {y:'2015-08', a:1050, b:3500},
              {y:'2015-09', a:1500, b:4100},
              {y:'2015-10', a:1800, b:4000},
              {y:'2015-11', a:2000, b:3900},
              {y:'2015-12', a:2005, b:4030},
            ]
          },
          {
            title: "Weight",
            measurement: "lb",
            data: [
              {y:'2015-07', a:170, b:80},
              {y:'2015-08', a:165, b:80},
              {y:'2015-09', a:160, b:81},
              {y:'2015-10', a:155, b:83},
              {y:'2015-11', a:140, b:80},
              {y:'2015-12', a:130, b:78},
            ]
          },
          {
            title: "Calories burned",
            data: [
              {y:'2015-07', a:10000, b:20000},
              {y:'2015-08', a:11000, b:21000},
              {y:'2015-09', a:15000, b:23000},
              {y:'2015-10', a:16000, b:24000},
              {y:'2015-11', a:20000, b:23000},
              {y:'2015-12', a:35000, b:22000},
            ]
          }
        ]
      },
    ];
  }
});
