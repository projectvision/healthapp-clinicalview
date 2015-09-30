import Ember from 'ember';

export default Ember.Controller.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  identification: "maediprichard@gmail.com", // email
  password: "m",
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

        //console.log('session.isAuthenticated');
        //console.log(controller.get('session.isAuthenticated'));

        // redirect physician to their patients
        controller.transitionToRoute('patients.index');

      },
      // Handle errors
      function(error) {
        // show message to the user
        controller.set('message', error.message || error.error);
        console.log(error);
      });

    },
  }
});
