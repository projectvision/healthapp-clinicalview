import Ember from 'ember';

export default Ember.Controller.extend({

  email: null,
  password: null,
  loggedIn: false,
  message: null,

  actions: {
    signup: function() {

      // Build User

      var user = this.store.modelFor('parse-user');
      var data = {
        email: this.get('email'),
        username: this.get('email'),
        password: this.get('password'),
      };

      // Save User

      var controller = this;

      user.signup(this.store, data).then(
        function(user) {
          controller.set('loggedIn', true);
          controller.set('message', 'You are now signed up!');
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
