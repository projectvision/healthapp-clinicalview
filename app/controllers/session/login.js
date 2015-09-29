import Ember from 'ember';

export default Ember.Controller.extend({

  identification: "maediprichard@gmail.com",
  password: "m",
  loggedIn: false,
  message: null,

  actions: {
    authenticate: function() {

      // Get Login Details
      var user = this.store.modelFor('parse-user');
      var data = this.getProperties('identification', 'password');

      this.get('session').authenticate('authenticator:parse', data);

      // Load User
      //var controller = this;

      //user.login(this.store, data).then(
      //  function(user) {
      //    controller.set('loggedIn', true);
      //    controller.set('message', 'Welcome!');
      //    //controller.get('session').authenticate('authenticator:parse', user);
      //    console.log(controller.get('session.isAuthenticated'));
      //  },
      //  function(error) {
      //    controller.set('loggedIn', false);
      //    controller.set('message', error.message || error.error);
      //  }
      //);
    },
  }
});
