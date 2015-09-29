import Ember from 'ember';

export default Ember.Controller.extend({

  username: "maediprichard@gmail.com",
  password: "m",
  loggedIn: false,
  message: null,

  actions: {
    login: function() {

      // Get Login Details
      var user = this.store.modelFor('parse-user');
      var data = {
        username: this.get('username'),
        password: this.get('password')
      };

      // Load User
      var controller = this;

      user.login(this.store, data).then(
        function(user) {
          controller.set('loggedIn', true);
          controller.set('message', 'Welcome!');
          //controller.get('session').authenticate('authenticator:parse', user);
          console.log(controller.get('session.isAuthenticated'));          
        },
        function(error) {
          controller.set('loggedIn', false);
          controller.set('message', error.message || error.error);
        }
      );
    },
  }
});
