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
      var user = this.store.modelFor('parse-user');
      var data = {
            username: this.get('username'),
            password: this.get('password'),
            email: this.get('email')
          };

      console.log('controller:');
      console.log(user);
      console.log(data);
      console.log(this);
      console.log(this.store);

      user.signup(this.store, data).then(
        function(user) {
          controller.set('logged-in', true);
          controller.set('login-message', 'Welcome!');
        },
        function(error) {
          controller.set('logged-in', false);
          controller.set('login-message', error.message || error.error);
        }
      );
    }
  }
});
