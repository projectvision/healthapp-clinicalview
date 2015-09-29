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
