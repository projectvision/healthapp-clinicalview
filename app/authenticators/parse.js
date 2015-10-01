import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import ParseUser from 'ember-parse-adapter/models/parse-user';

export default Base.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  db: Ember.inject.service('store'),

  /****************************************************************************
  /* ACTIONS
  /***************************************************************************/

  restore: function(data) {

    var store = this.get('db');
    var adapter = store.adapterFor('parse-user');

    if (!data.sessionToken) {
      return {};
    }

    // Set session token
    adapter.set('sessionToken', data.sessionToken);

    // Get current user
    return store.modelFor('parse-user').current(store).then(function(user) {
      return {
        userId: user.get('id'),
        sessionToken: user.get('sessionToken'),
        email: user.get('email'),
        username: user.get('username'),
        firstName: user.get('firstName'),
        lastName: user.get('lastName')
      };
    });
  },

  /* Authenticate - used by the login controller to login the user */
  authenticate: function(data) {

    // Get parse adapter and user login details
    var adapter = this.get('db').adapterFor('parse-user');
    var user = data.user;

    // Use ember simple auth "identification" (email) as parse "username"
    if (data.identification) {
      data.username = data.identification;
    }

    // Handle previously logged in user
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
    // Authenticate user
    else {
      return this.get('db').modelFor('parse-user').login(this.get('db'), data).then(function(user) {
        // set the session up with parse response
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

    var adapter = this.get('db').adapterFor('parse-user');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      adapter.set('sessionToken', null);
      return resolve(); // https://github.com/simplabs/ember-simple-auth/issues/663
    });
  }
});
