import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {
    // Redirect authenticated users to the Patients Index
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('patients.index');
    }
  }
});
