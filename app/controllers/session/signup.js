import Ember from 'ember';

export default Ember.Controller.extend({

  username: null,
  password: null,
  email: null,
  loggedIn: false,
  loginMessage: null,

  actions: {
    signup: function() {

      // Build User

      // model
      var user = this.store.modelFor('parse-user');
      // controller
      var data = {
        username: this.get('username'),
        password: this.get('password'),
        email: this.get('email')
      };

      // Save User

      var controller = this;

      user.signup(this.store, data).then(
        function(user) {
          controller.set('loggedIn', true);
          controller.set('loginMessage', 'Welcome!');
        },
        function(error) {
          controller.set('loggedIn', false);
          controller.set('loginMessage', error.message || error.error);
        }
      );
    }
  }
});
