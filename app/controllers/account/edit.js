import Ember from 'ember';

export default Ember.Controller.extend({

  /****************************************************************************
  /* ACTIONS
  /***************************************************************************/

  actions: {
    update: function() {

      // Get current user
      var user = this.get('model');

      // Sync username with email
      user.set('username', user.get('email'));

      // Update user to parse
      user.save();
    }
  }
});
