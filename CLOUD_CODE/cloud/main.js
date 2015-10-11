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
  //patientQuery.select('Username', 'Fname', 'Lname', 'PercentFitnessChallengesLast', 'PercentDietChallengesLast', 'PercentStressChallengesLast');

  // Include the user account with each patient
  patientQuery.include("username.email");

  patientQuery.find({
    success: function(patients) {

      //@TODO: Merge with "Diet" table that has Username equal to UserTable "objectId"

      console.log('------- patients --------');
      console.log(patients);

      _.each(patients, function(patient) {

        //patient.get('Username');
        console.log('--------------');
        console.log(patient.get('Username'));
        patient.get('Username');
        //patient.email = patient.get('Username.email');

      //  // Get patient's email

      //  //var emailQuery = new Parse.Query("User");
      //  //emailQuery.equalTo("objectId", patient.objectId);
      //  //emailQuery.select('username').find({
      //  //  success: function(user) {
      //  //    patient["email"] = user.username;
      //  //  },
      //  //  error: function() {
      //  //    response.error("emailQuery failed");
      //  //  }
      //  //});
      });
      // Return patients
      response.success(patients);
    },
    error: function() {
      response.error("patientQuery failed");
    }
  });
});

//job["applications"] = _.find(apps, function(app) {
//    return app.get("job").id == job.id;
//});

/*{
   "result":[
      {
         "Fname":"Eagle",
         "Lname":"Cyborg",
         "PercentDietChallengesLast":30,
         "PercentFitnessChallengesLast":60,
         "PercentStressChallengesLast":33,
         "Username":{
            "__type":"Pointer",
            "className":"_User",
            "objectId":"fBUFReEuOU"
         },
         "__type":"Object",
         "className":"UserTable",
         "createdAt":"2015-04-13T04:34:02.596Z",
         "objectId":"jHYAjEqDjr",
         "updatedAt":"2015-10-05T15:12:00.737Z"
      },
      {
         "Fname":"Jerry",
         "Lname":"Louis",
         "PercentDietChallengesLast":50,
         "PercentFitnessChallengesLast":30,
         "PercentStressChallengesLast":67,
         "Username":{
            "__type":"Pointer",
            "className":"_User",
            "objectId":"BvNiryEoMz"
         },
         "__type":"Object",
         "className":"UserTable",
         "createdAt":"2015-04-02T15:15:59.086Z",
         "objectId":"OnU7V3NGru",
         "updatedAt":"2015-10-05T15:11:58.863Z"
      },
      {
         "Fname":"John",
         "Lname":"Smith",
         "PercentDietChallengesLast":20,
         "PercentFitnessChallengesLast":20,
         "PercentStressChallengesLast":100,
         "Username":{
            "__type":"Pointer",
            "className":"_User",
            "objectId":"OVlCPAt706"
         },
         "__type":"Object",
         "className":"UserTable",
         "createdAt":"2015-08-18T13:21:01.473Z",
         "objectId":"Zrp2VDk0OQ",
         "updatedAt":"2015-10-05T15:11:58.020Z"
      },
      {
         "Fname":"Samantha",
         "Lname":"Loveleg",
         "PercentDietChallengesLast":60,
         "PercentFitnessChallengesLast":55,
         "PercentStressChallengesLast":70,
         "Username":{
            "__type":"Pointer",
            "className":"_User",
            "objectId":"5vho11OcS7"
         },
         "__type":"Object",
         "className":"UserTable",
         "createdAt":"2015-05-05T10:35:53.040Z",
         "objectId":"zdk1ILbW9Q",
         "updatedAt":"2015-10-05T15:12:21.476Z"
      },
      {
         "Fname":"Shingai",
         "Lname":"Samudzi",
         "PercentDietChallengesLast":0,
         "PercentFitnessChallengesLast":0,
         "PercentStressChallengesLast":0,
         "Username":{
            "__type":"Pointer",
            "className":"_User",
            "objectId":"fZUgKlRkp8"
         },
         "__type":"Object",
         "className":"UserTable",
         "createdAt":"2015-01-20T00:28:26.245Z",
         "objectId":"CLsODynwR4",
         "updatedAt":"2015-05-19T00:10:20.267Z"
      }
   ]
}*/
