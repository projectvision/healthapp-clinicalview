Parse.Cloud.define("patients", function(request, response) {

  // Get Physician
  var userQuery = new Parse.Query(Parse.User);

  // Get Physician's Patients
  var query = new Parse.Query("UserTable");
  query.notEqualTo("Fname", null);
  query.select('Fname', 'Lname', 'PercentFitnessChallengesLast', 'PercentDietChallengesLast', 'PercentStressChallengesLast').find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("patients lookup failed");
    }
  });
});
