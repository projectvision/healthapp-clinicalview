import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {

  email: null,
  password: null,
  passwordConfirmation: null,
  loggedIn: false,
  message: null,

  validations: {
    password: {
      presence: {message: 'password required'},
      length: {minimum: 5},
      confirmation: true
    },
    passwordConfirmation: {
      presence: {message: 'please confirm password'}
    }
  },

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
