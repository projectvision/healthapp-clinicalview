var _ = require('underscore');
var User = Parse.Object.extend('User');
var Diet = Parse.Object.extend('Diet');
var Patients = Parse.Object.extend('UserTable');
var ActivitiesImport = Parse.Object.extend('ActivitiesImport');
var Demographics = Parse.Object.extend('Demographics');

/****************************************************************************
/* PATIENTS FOR PHYSICIAN
/* Query UserTable for name and challenge completion percentages, then
/* query Diet for activity level by matching Diet.username with _User.username
/***************************************************************************/

Parse.Cloud.define('patientsForPhysician', function(request, response) {

  var patientResults = [];
  var dietResults = [];

  // Get Physician
  //var physicianQuery = new Parse.Query(Parse.User);

  // Get Patients
  var patientQuery = new Parse.Query(Patients);
  patientQuery.notEqualTo('Fname', null); // @TODO: Find Patients  connected to _User by MRN or PatientsPhysicians relationship
  patientQuery.select('Username.objectId', 'Username.username','Username.email','Username.ABSI_zscore','Fname','Lname','PercentFitnessChallengesLast','PercentDietChallengesLast','PercentStressChallengesLast');
  patientQuery.include('Username'); // include username(email) and ABSI_zscore from _User
  patientQuery.find().then(function(patients) {

    // Store promises
    var patientPromises = [];

    // Build patient
    _.each(patients, function(patient) {

      // only build patients connected to _User
      if (!!patient.get('Username')) {

        // Get Diet activity level
        var dietQuery = new Parse.Query(Diet);
        dietQuery.equalTo('username', patient.get('Username').username); // _User username is used as the key
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

Parse.Cloud.define('graphsForPatient', function(request, response) {

  console.log('--- graphsForPatient ----');
  console.log(request.params);

  // Define From Date
  //var d = new Date();
  //var time = (1 * 30 * 24 * 60 * 60 * 1000); // and convert seconds to milliseconds
  //var fromDate = new Date(d.getTime() - (time));

  // Get Patient's _User object with which to filter by
  var user = new User();
  user.id = request.params.user;
  user.email = request.params.email;

  // GRAPHS

  // Heart Rate, Step Count, Calories Burned
  var activitiesQuery = new Parse.Query(ActivitiesImport);
  activitiesQuery.equalTo('user', user);
  activitiesQuery.limit(30); // 30 days as there is a record for every day?
  //activitiesQuery.greaterThanOrEqualTo('Date', fromDate);
  activitiesQuery.select('NormalHR', 'Calories', 'Steps');
  activitiesQuery.find().then(function(activities) {

    // STATS

    // Weight, West Circumference
    var demographicsQuery = new Parse.Query(Demographics);
    demographicsQuery.equalTo('username', user.email); // Demographics username is actually an email, used as key
    demographicsQuery.select('WEIGHT', 'Waist_Circumference');
    demographicsQuery.first().then(function(demographics) {
      response.success({graphs: activities, stats: demographics});
    });
  }, function(error) {
    response.error(error);
  });

});
