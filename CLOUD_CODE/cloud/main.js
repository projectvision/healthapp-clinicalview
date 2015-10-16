var _ = require('underscore');
var User = Parse.Object.extend("User");
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
  patientQuery.select('Username.objectId', 'Username.username','Username.ABSI_zscore','Fname','Lname','PercentFitnessChallengesLast','PercentDietChallengesLast','PercentStressChallengesLast');
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
  console.log(request.params);

  // Get Patient's _User object with which to filter by
  var user = new User();
  user.id = request.params.user;

  // Heart Rate, Step Count, Calories Burned
  var aQuery = new Parse.Query(ActivitiesImport);
  aQuery.equalTo("user", user);
  aQuery.select('NormalHR', 'Calories', 'Steps');
  aQuery.find().then(function(activities) {
    response.success(activities);
  }, function(error) {
    response.error(error);
  });

});
