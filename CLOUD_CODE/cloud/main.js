Parse.Cloud.define("patientsForPhysician", function(request, response) {

  // Get Physician
  var userQuery = new Parse.Query(Parse.User);

  // Get Physician's Patients
  var query = new Parse.Query("UserTable");
  query.equalTo("PercentStressChallenges", 100);
  query.select('PercentFitnessChallengesLast', 'PercentDietChallengesLast', 'PercentStrengthChallengesLast').find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("movie lookup failed");
    }
  });
});
