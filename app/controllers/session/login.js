import Ember from 'ember';

export default Ember.Controller.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  identification: "maediprichard@gmail.com",
  password: "m",
  message: null,

  /****************************************************************************
  /* ACTIONS
  /***************************************************************************/

  actions: {
    authenticate: function() {

      var controller = this;
      var data = this.getProperties('identification', 'password');

      controller.get('session').authenticate('authenticator:parse', data).then(function(response) {

        console.log('session.isAuthenticated');
        console.log(controller.get('session.isAuthenticated'));

      }, function(error) {
        controller.set('message', error.message || error.error);
        console.log(error);
      });

    },
  }
});
