var _ = require('underscore');
var Diet = Parse.Object.extend('Diet');
var Patients = Parse.Object.extend('UserTable');
var ActivitiesImport = Parse.Object.extend('ActivitiesImport');

/****************************************************************************
/* PATIENTS FOR PHYSICIAN
/* Query UserTable for name and challenge completion percentages, then
/* query Diet for activity level by matching Diet.username with _User.username
/***************************************************************************/

Parse.Cloud.define("patientsForPhysician", function(request, response) {

  var patientResults = [];
  var dietResults = [];

  // Get Physician
  //var physicianQuery = new Parse.Query(Parse.User);

  // Get Patients
  var patientQuery = new Parse.Query(Patients);
  patientQuery.notEqualTo("Fname", null); // @TODO: Find Patients  connected to _User by MRN or PatientsPhysicians relationship
  patientQuery.select('Username.username','Username.ABSI_zscore','Fname','Lname','PercentFitnessChallengesLast','PercentDietChallengesLast','PercentStressChallengesLast');
  patientQuery.include("Username"); // include username(email) and ABSI_zscore from _User
  patientQuery.find().then(function(patients) {

    // Store promises
    var patientPromises = [];

    // Build patient
    _.each(patients, function(patient) {

      // only build patients connected to _User
      if (!!patient.get('Username')) {

        // Get Diet activity level
        var dietQuery = new Parse.Query(Diet);
        dietQuery.equalTo("username", patient.get('Username').username); // _User username is used as the key
        dietQuery.select('ACTIVITY_LEVEL');

        // Create promise
        patientPromises.push(dietQuery.first().then(function(diet) {
          // Create patient
          dietResults.push({activityLevel: diet.get('ACTIVITY_LEVEL')});
          patientResults.push(patient);
        }));
      }
    });
    // Resolve promises
    return Parse.Promise.when(patientPromises);
  }).then(function () {
    // Return patients
    response.success({patients: patientResults, diet: dietResults});
  });
});

/****************************************************************************
/* GRAPHS FOR PATIENT
/***************************************************************************/

Parse.Cloud.define("graphsForPatient", function(request, response) {

  console.log('--- graphsForPatient ----');
  console.log(request.params.id);

  // Heart Rate, Step Count, Calories Burned
  var aQuery = new Parse.Query(ActivitiesImport);
  aQuery.equalTo("user", request.params.id);
  aQuery.select('NormalHR', 'Calories', 'Steps');
  aQuery.find().then({
    success: function(activities) {
      console.log(activities);
      response.success(activities);
    },
    error: function(error) {
      response.error(error);
    }
  });
});
