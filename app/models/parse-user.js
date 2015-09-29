import ParseUser from 'ember-parse-adapter/models/parse-user';

// ParseUser is created by Ember Parse Adapter. Signup and login actions
// are located in 'node_modules/ember-parse-adapter/addon/models/parse-user.js'

ParseUser.reopenClass({

  current: function() {
    var model = this,
      store = this.container.lookup('service:store'),
      //store = Ember.inject.service('store'),
      adapter = store.adapterFor('parse-user'),
      serializer = store.serializerFor('parse-user');

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
  },

  loginProxy: function(data) {
    var store = this.container.lookup('service:store');
    //var store = Ember.inject.service('store');
    return this.login(store, data);
  }
});

export default ParseUser;
