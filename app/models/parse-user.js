import ParseUser from 'ember-parse-adapter/models/parse-user';

// ParseUser is created by Ember Parse Adapter and signup/login functions
// are located in 'node_modules/ember-parse-adapter/addon/models/parse-user.js'

ParseUser.reopenClass({

  current: function() {
    var model = this,
      store = application.container.lookup('service:store'),
      adapter = store.adapterFor('parse-user'),
      serializer = store.serializerFor('parse-user');

    return adapter.ajax(adapter.buildURL("parse-user", "me"), "GET", {}).then(function(user) {
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
    var store = application.container.lookup('service:store');
    return this.login(store, data);
  }
});

export default ParseUser;
