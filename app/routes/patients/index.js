import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

// This route requires authentication
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // Render Patient Index into master template
  renderTemplate: function() {
    this.render({
      outlet: 'master',
    });
  },

  /****************************************************************************
  /* PATIENTS FOR PHYSICIAN
  /***************************************************************************/

  model: function(params) {

    // Get Store
    var store = this.get('store');

    // Get Adapter
    var adapter = store.adapterFor('parse-user');
    var serializer = store.serializerFor('parse-user');

    // Get Patients For Physician (POST insead of GET to avoid parse error)
    return adapter.ajax(adapter.buildURL("patients"), "POST", {}).then(function(data) {

      // Build Patients
      for (var index = 0; index < data.result.patients.length; index++) {
        var patient = data.result.patients[index];
        var diet = data.result.diet[index];

        // Build Patient
        var emberPatient = {
          data: {
            id: patient.objectId,
            type: 'patient',
            attributes: {
              firstName:          patient.Fname,
              lastName:           patient.Lname,
              email:              patient.Username.email,
              challengeFitness:   patient.PercentFitnessChallengesLast,
              challengeDiet:      patient.PercentDietChallengesLast,
              challengeStress:    patient.PercentStresshChallengesLast,
              zScore:             patient.Username.ABSI_zscore,
              activityLevelScore: diet.activityLevel,
            }
          }
        };
        // Create Patient
        store.push(emberPatient);
      }
      // Return Patients
      return store.findAll('patient');
    });
  }
});
