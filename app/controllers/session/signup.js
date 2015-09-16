import Ember from 'ember';

export default Ember.Controller.extend({
  username: null,
  password: null,
  email: null,
  loggedIn: false,
  loginMessage: null,

  actions: {
    signup: function() {
      var controller = this;
      var ParseUser  = this.store.modelFor('parse-user');
      var data = {
        username: this.get('username'),
        password: this.get('password'),
        email: this.get('email')
      };

      console.log(this.store);

      ParseUser.signup(this.store, data).then(
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
