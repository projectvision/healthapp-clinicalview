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
        ],
        "behavioralRisk": {
          score: 50,
          percent: 33,
          level: 'low'
        },
        "radar": {
          labels: ["Susceptibility", "Severity", "Benefit", "Barrier", "Cues", "Self-efficacy"],
          datasets: [{
            label: "Health Belief Spectrum",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "#4BB3D2",
            pointColor: "#4BB3D2",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [1, 3, 3, 4, 4, 5]
          }]
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
        },
        "charts": [
          {
            title: "Heart Rate",
            measurement: "bpm",
            data: [
              {x:'2015-07', p:110, d:80},
              {x:'2015-08', p:145, d:67},
              {x:'2015-09', p:120, d:95},
              {x:'2015-10', p:125, d:50},
              {x:'2015-11', p:160, d:45},
              {x:'2015-12', p:120, d:90},
            ]
          },
          {
            title: "Step count",
            measurement: "steps",
            data: [
              {x:'2015-07', p:1100, d:3000},
              {x:'2015-08', p:900,  d:3500},
              {x:'2015-09', p:1200, d:3100},
              {x:'2015-10', p:1300, d:2500},
              {x:'2015-11', p:1600, d:3900},
              {x:'2015-12', p:1805, d:3000},
            ]
          },
          {
            title: "Weight",
            measurement: "lb",
            data: [
              {x:'2015-07', p:140, d:60},
              {x:'2015-08', p:165, d:80},
              {x:'2015-09', p:140, d:91},
              {x:'2015-10', p:155, d:83},
              {x:'2015-11', p:140, d:80},
              {x:'2015-12', p:130, d:78},
            ]
          },
          {
            title: "Calories burned",
            data: [
              {x:'2015-07', p:14000, d:18000},
              {x:'2015-08', p:15000, d:21000},
              {x:'2015-09', p:14000, d:23000},
              {x:'2015-10', p:16000, d:20000},
              {x:'2015-11', p:20000, d:23000},
              {x:'2015-12', p:35000, d:22000},
            ]
          }
        ],
        "behavioralRisk": {
          score: 90,
          percent: 60,
          level: 'moderate'
        },
        "radar": {
          labels: ["Susceptibility", "Severity", "Benefit", "Barrier", "Cues", "Self-efficacy"],
          datasets: [{
            label: "Health Belief Spectrum",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "#4BB3D2",
            pointColor: "#4BB3D2",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [5, 6, 3, 4, 2, 1]
          }]
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
        },
        "charts": [
          {
            title: "Heart Rate",
            measurement: "bpm",
            data: [
              {x:'2015-07', p:90,  d:99},
              {x:'2015-08', p:125, d:77},
              {x:'2015-09', p:123, d:75},
              {x:'2015-10', p:105, d:44},
              {x:'2015-11', p:110, d:85},
              {x:'2015-12', p:100, d:50},
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
        ],
        "behavioralRisk": {
          score: 110,
          percent: 73,
          level: 'high'
        },
        "radar": {
          labels: ["Susceptibility", "Severity", "Benefit", "Barrier", "Cues", "Self-efficacy"],
          datasets: [{
            label: "Health Belief Spectrum",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "#4BB3D2",
            pointColor: "#4BB3D2",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [4, 4, 1, 5, 3, 4]
          }]
        }
      },
    ];
  }
});
