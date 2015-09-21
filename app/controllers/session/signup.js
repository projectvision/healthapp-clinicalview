import Ember from 'ember';

export default Ember.Controller.extend({

  email: null,
  username: null,
  password: null,
  loggedIn: false,
  message: null,

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
          controller.set('message', 'Welcome!');
        },
        function(error) {
          console.log(error);
          controller.set('loggedIn', false);
          controller.set('message', error.error || error.message);
        }
      );
    }
  }
});
