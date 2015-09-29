import Base from 'simple-auth/authenticators/base';
import ParseUser from 'ember-parse-adapter/models/parse-user';

export default Base.extend({
  restore: function(data) {
    var sessionToken, adapter, store;

    if (!data.sessionToken) {
      return {};
    }

    sessionToken = data.sessionToken;
    store = this.container.lookup('service:store');
    adapter = store.adapterFor('parse-user');

    adapter.set('sessionToken', sessionToken);

    return ParseUser.current().then(function(user) {
      // identify the user

      return {
        userId: user.get('id'),
        sessionToken: user.get('sessionToken'),
        email: user.get('email'),
        firstName: user.get('firstName'),
        lastName: user.get('lastName')
      };
    });
  },

  authenticate: function(data) {
    var store, adapter, user,
      authenticator = this;

    // Ember-Simple-Auth uses "identification", Parse uses "username"
    if (data.identification) {
      data.username = data.identification;
    }

    // Get the store and adapter
    store = this.container.lookup('service:store');
    adapter = store.adapterFor('parse-user');

    // If user data is already set
    user = data.user;
    if (user) {
      adapter.set('sessionToken', user.get('sessionToken'));
      data = {
        userId: user.get('id'),
        sessionToken: user.get('sessionToken'),
        email: user.get('email'),
        firstName: user.get('firstName'),
        lastName: user.get('lastName')
      };
      return Ember.RSVP.resolve(data);
    }
    // login a user
    else {
      return store.modelFor('parse-user').loginProxy(data).then(function(user) {

        // set the session up with Parse response
        adapter.set('sessionToken', user.get('sessionToken'));
        data = {
          userId: user.get('id'),
          sessionToken: user.get('sessionToken'),
          email: user.get('email'),
          firstName: user.get('firstName'),
          lastName: user.get('lastName')
        };

        return data;
      });
    }
  },

  invalidate: function() {
    // Get the store and adapter
    var store = this.container.lookup('service:store'),
      adapter = store.adapterFor('parse-user');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      adapter.set('sessionToken', null);
      return resolve();
    });
  }

});
