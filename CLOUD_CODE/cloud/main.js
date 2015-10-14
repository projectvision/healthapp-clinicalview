var _ = require('underscore');
var Diet = Parse.Object.extend('Diet');
var Patients = Parse.Object.extend('UserTable');

// curl -X POST  -H "X-Parse-Application-Id: kAPizP7WxU9vD8ndEHZd4w14HBDANxCYi5VQQGJ9"  -H "X-Parse-REST-API-Key: 1wRXdgIGcnCPoeywMgdNQ7THSbMO7UxWZYdvlfJN"  -H "Content-Type: application/json" -d '{}'  https://api.parse.com/1/functions/patients

// http://stackoverflow.com/questions/29716664/parse-com-left-join-alternative
// https://www.parse.com/questions/parse-relationship-left-join-question
// https://www.parse.com/questions/javascript-pointers-how-to-retrieve-fields-using-pointers-and-include-in-query

/****************************************************************************
/* PATIENTS FOR PHYSICIAN
/* Query UserTable for name and challenge completion percentages, then
/* query Diet for activity level by matching Diet.username with _User.username
/***************************************************************************/

Parse.Cloud.define("patients", function(request, response) {

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

      if (!!patient.get('Username')) {

        // Get Diet activity level
        var dietQuery = new Parse.Query(Diet);
        dietQuery.equalTo("username", patient.get('Username').username); // _User username is used as the key
        dietQuery.select('ACTIVITY_LEVEL');

        // Create promise
        patientPromises.push(dietQuery.first().then(function(diet) {
          console.log("--------- promise -----------");
          console.log(diet);
          console.log(patient);
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
