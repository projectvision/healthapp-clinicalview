import Ember from 'ember';

export default Ember.Route.extend({
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
    //return this.modelFor('patient').findBy('id', params.patient_id);
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
        }
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
