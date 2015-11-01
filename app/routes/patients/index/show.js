import Ember from 'ember';

export default Ember.Route.extend({
  // Render Patient Show into detail template
  renderTemplate: function() {
    this.render({
      outlet: 'detail',
    });
  },

  /****************************************************************************
  /* GRAPHS FOR PATIENT
  /***************************************************************************/

  model: function(params) {

    //// Get Store
    var store = this.get('store');

    //// Get Adapter
    var adapter = store.adapterFor('parse-user');
    var serializer = store.serializerFor('parse-user');

    // Get Patient
    var patient = this.modelFor('patients.index').findBy('id', params.id);
    var patientUser = {user: patient.get('user'), email: patient.get('email')};

    // Get Graphs For Patient
    if (patient.get('graphs').length == 0) {
      adapter.ajax(adapter.buildURL("graphsForPatient"), "POST", {data: patientUser}).then(function(data) {
        console.log(data.result);

        // Seperate Data
        var steps = [];
        var calories = [];
        var heartRates = [];

        for (var index = 0; index < data.result.graphs.length; index++) {
          var item = data.result.graphs[index];
          steps.push({x: item.createdAt, y: item.Steps});
          calories.push({x: item.createdAt, y: item.Calories});
          heartRates.push({x: item.createdAt, y: item.NormalHR});
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

        // Create Stats
        store.createRecord('stat', {
          title: 'Weight',
          units: 'lb',
          stat: data.result.stats.WEIGHT,
          patient: patient
        });
        store.createRecord('stat', {
          title: 'Waist Circumference',
          units: 'inches',
          stat: data.result.stats.Waist_Circumference,
          patient: patient
        });
      });
    }

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
