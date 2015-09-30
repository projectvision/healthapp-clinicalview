import Ember from 'ember';

export default Ember.Controller.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  identification: null, // email/username
  password: null,
  message: null,

  /****************************************************************************
  /* ACTIONS
  /***************************************************************************/

  actions: {
    authenticate: function() {

      // Get controller and user details
      var controller = this;
      var data = this.getProperties('identification', 'password');

      // Authenticate with parse
      controller.get('session').authenticate('authenticator:parse', data).then(function(response) {
        // once logged in redirect user to their patients
        controller.transitionToRoute('patients.index');
      },
      // Handle errors
      function(error) {
        // show message to the user
        controller.set('message', error.message);
        console.log(error);
      });

    },
  }
});
