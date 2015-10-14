import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

// This route requires authentication
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // Render Patient Index into master template
  renderTemplate: function() {
    this.render({
      outlet: 'master',
    });
  },

  /****************************************************************************
  /* PATIENTS FOR PHYSICIAN
  /***************************************************************************/

  model: function(params) {

    //// Get Store
    var store = this.get('store');

    //// Get Adapter
    var adapter = store.adapterFor('parse-user');
    var serializer = store.serializerFor('parse-user');

    // Get Patients For Physician (POST insead of GET to avoid parse error)
    return adapter.ajax(adapter.buildURL("patients"), "POST", {}).then(function(data) {
      console.log(data.result);

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
              firstName:          patient.Fname,
              lastName:           patient.Lname,
              email:              patient.Username.email,
              challengeFitness:   patient.PercentFitnessChallengesLast,
              challengeDiet:      patient.PercentDietChallengesLast,
              challengeStress:    patient.PercentStresshChallengesLast,
              zScore:             patient.Username.ABSI_zscore,
              activityLevelScore: diet.activityLevel,
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
