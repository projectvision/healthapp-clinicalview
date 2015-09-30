import Base from 'simple-auth/authorizers/base';

// @TODO: Configure for use with Parse

export default Base.extend({
  authorize: function(jqXHR, requestOptions) {
    console.log('authorizer 2');
    console.log(jqXHR);
    console.log(requestOptions);
    //if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.secure.token'))) {
    //  jqXHR.setRequestHeader('Authorization', 'X-Parse-Session-Token:' + this.get('session.secure.token'));
    //}
  }
});
