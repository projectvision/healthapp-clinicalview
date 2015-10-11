Parse.Cloud.define("patients", function(request, response) {

  // Get Physician
  //var physicianQuery = new Parse.Query(Parse.User);

  // Get Physician's Patients
  var Patients = Parse.Object.extend("UserTable");
  var patientQuery = new Parse.Query(Patients);
  patientQuery.notEqualTo("Fname", null); // @TODO: Find Patients that are connected to _User by MRN (PatientsPhysicians)
  //patientQuery.select('Username', 'Fname', 'Lname', 'PercentFitnessChallengesLast', 'PercentDietChallengesLast', 'PercentStressChallengesLast');

  // Include the patient's associated _User
  patientQuery.include("Username");

  patientQuery.find({
    success: function(patients) {
      // I can access _User via Username pointer...
      _.each(patients, function(patient) {
        console.log(patient.get('Username'));
      });
      // Return patients
      response.success(patients);
    },
    error: function() {
      response.error("patientQuery failed");
    }
  });
});
