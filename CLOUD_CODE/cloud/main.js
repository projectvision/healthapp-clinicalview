Parse.Cloud.define("patientsForPhysician", function(request, response) {

  // Get Physician
  var userQuery = new Parse.Query(Parse.User);

  // Get Physician's Patients
  var query = new Parse.Query("UserTable");
  query.equalTo("PercentStressChallenges", 100);
  query.find({
    success: function(results) {
      //var sum = 0;
      //for (var i = 0; i < results.length; ++i) {
      //  sum += results[i].get("stars");
      //}
      response.success(results);
    },
    error: function() {
      response.error("movie lookup failed");
    }
  });
});
