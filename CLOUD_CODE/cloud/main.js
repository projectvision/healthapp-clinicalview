var _ = require('underscore');

// curl -X POST  -H "X-Parse-Application-Id: kAPizP7WxU9vD8ndEHZd4w14HBDANxCYi5VQQGJ9"  -H "X-Parse-REST-API-Key: 1wRXdgIGcnCPoeywMgdNQ7THSbMO7UxWZYdvlfJN"  -H "Content-Type: application/json" -d '{}'  https://api.parse.com/1/functions/patients

// http://stackoverflow.com/questions/29716664/parse-com-left-join-alternative
// https://www.parse.com/questions/parse-relationship-left-join-question
// https://www.parse.com/questions/javascript-pointers-how-to-retrieve-fields-using-pointers-and-include-in-query

/****************************************************************************
/* PATIENTS FOR PHYSICIAN
/***************************************************************************/

Parse.Cloud.define("patients", function(request, response) {

  // Get Physician
  //var physicianQuery = new Parse.Query(Parse.User);

  // Get Physician's Patients
  var Patients = Parse.Object.extend("UserTable");
  var patientQuery = new Parse.Query(Patients);
  patientQuery.notEqualTo("Fname", null); // @TODO: Find Patients that are connected to _User by MRN (PatientsPhysicians)
  patientQuery.select('Username.email','Username.ABSI_zscore','Fname','Lname','PercentFitnessChallengesLast','PercentDietChallengesLast','PercentStressChallengesLast');

  // Include email and ABSI_zscore from _User
  patientQuery.include("Username");

  patientQuery.find({
    success: function(patients) {
      // Get ACTIVITY_LEVEL from Diet...
      _.each(patients, function(patient) {
        console.log("-----------------------");

        // _User email is used as the key
        var username = patient.get('Username');
        if (!!username) {
          console.log(username);
          console.log(username.email);
        }

        //var Diet = Parse.Object.extend("Diet");
        //var dietQuery = new Parse.Query(Diet);
        //dietQuery.equalTo("email", "maedi");
        //dietQuery.find({
        //  success: function(diets) {
        //    console.log("diet found");
        //    console.log(diets);
        //  },
        //  error: function(error) {
        //    // error is an instance of Parse.Error.
        //  }
        //});
      });
      // Return patients
      response.success(patients);
    },
    error: function() {
      response.error("patientQuery failed");
    }
  });
});
