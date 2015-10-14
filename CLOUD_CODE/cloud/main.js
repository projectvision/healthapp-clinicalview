var _ = require('underscore');
var Diet = Parse.Object.extend('Diet');
var Patients = Parse.Object.extend('UserTable');

// curl -X POST  -H "X-Parse-Application-Id: kAPizP7WxU9vD8ndEHZd4w14HBDANxCYi5VQQGJ9"  -H "X-Parse-REST-API-Key: 1wRXdgIGcnCPoeywMgdNQ7THSbMO7UxWZYdvlfJN"  -H "Content-Type: application/json" -d '{}'  https://api.parse.com/1/functions/patients

// http://stackoverflow.com/questions/29716664/parse-com-left-join-alternative
// https://www.parse.com/questions/parse-relationship-left-join-question
// https://www.parse.com/questions/javascript-pointers-how-to-retrieve-fields-using-pointers-and-include-in-query

/****************************************************************************
/* PATIENTS FOR PHYSICIAN
/***************************************************************************/

Parse.Cloud.define("patients", function(request, response) {

  var patientsArray = [];

  // Get Physician
  //var physicianQuery = new Parse.Query(Parse.User);

  // Get Physician's Patients
  var patientQuery = new Parse.Query(Patients);
  patientQuery.notEqualTo("Fname", null); // @TODO: Find Patients  connected to _User by MRN or PatientsPhysicians relationship
  patientQuery.select('Username.username','Username.ABSI_zscore','Fname','Lname','PercentFitnessChallengesLast','PercentDietChallengesLast','PercentStressChallengesLast');

  // Include email and ABSI_zscore from _User
  patientQuery.include("Username");

  patientQuery.find().then(function(patients) {

    var promises = [];
    patientsArray.push(patients);

    _.each(patients, function(patient) {
      // Get ACTIVITY_LEVEL from Diet...
      console.log("--------- each -----------");

      // _User username/email is used as the key
      if (!!patient.get('Username')) {
        console.log(patient.get('Username').username);

        var dietQuery = new Parse.Query(Diet);
        dietQuery.equalTo("username", 'uiu@uiu.uiu');
        dietQuery.select('ACTIVITY_LEVEL');
        promises.push(dietQuery.find().then(function(diets) {
          console.log("diet found");
          console.log(diets);
        }));
      }
    });

    return Parse.Promise.when(promises);
  }).then(function () {
    console.log('return');
    // Return patients
    response.success(patientsArray[0]);
  });
});
