import Ember from 'ember';
import ParseUser from 'ember-parse-adapter/models/parse-user';

// ParseUser is created by the Ember Parse Adapter.
// @see: 'node_modules/ember-parse-adapter/addon/models/parse-user.js'

ParseUser.reopenClass({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  db: Ember.inject.service('store'),

  /****************************************************************************
  /* ACTIONS
  /***************************************************************************/

  /* Current User - used by the parse authenticator */
  current: function() {
    var model = this,
      adapter = this.get('db').adapterFor('parse-user'),
      serializer = this.get('db').serializerFor('parse-user');

    return adapter.ajax(adapter.buildURL("parse-user", "me"), "GET", {}).then(function(user) {
      console.log('ParseUser current');
      console.log(user);

      return store.push({
        data: {
          id: user.objectId,
          type: 'parse-user',
          attributes: {
            sessionToken: user.sessionToken,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      });
    });
  }
});

export default ParseUser;
